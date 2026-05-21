import Fuse from 'fuse.js';
import Contact, { IContact } from '../models/Contact.js';

class TrieNode {
  children: Map<string, TrieNode> = new Map();
  contactIds: Set<string> = new Set();
  isEnd: boolean = false;
}

interface ContactRecord {
  _id: string;
  name: string;
  email?: string;
  company?: string;
  phone?: string;
  tags?: string[];
}

class SearchIndexService {
  private tries: Map<string, TrieNode> = new Map();
  private invertedIndices: Map<string, Map<string, Set<string>>> = new Map();
  private contacts: Map<string, Map<string, ContactRecord>> = new Map();

  /**
   * Build or rebuild the entire search index for a user from MongoDB.
   */
  async buildForUser(userId: string): Promise<void> {
    const trie = new TrieNode();
    const invertedIndex = new Map<string, Set<string>>();
    const contactMap = new Map<string, ContactRecord>();

    const userContacts = await Contact.find({ userId }).lean<IContact[]>();

    for (const contact of userContacts) {
      const contactId = String(contact._id);
      const record: ContactRecord = {
        _id: contactId,
        name: contact.name,
        email: contact.email,
        company: contact.company,
        phone: contact.phone,
        tags: contact.tags,
      };
      contactMap.set(contactId, record);

      const tokens = this.tokenize(contact);
      for (const token of tokens) {
        this.insertIntoTrie(trie, token, contactId);

        if (!invertedIndex.has(token)) {
          invertedIndex.set(token, new Set());
        }
        invertedIndex.get(token)!.add(contactId);
      }
    }

    this.tries.set(userId, trie);
    this.invertedIndices.set(userId, invertedIndex);
    this.contacts.set(userId, contactMap);
  }

  /**
   * Incrementally add a single contact to the index.
   */
  addContact(userId: string, contact: IContact): void {
    let trie = this.tries.get(userId);
    if (!trie) {
      trie = new TrieNode();
      this.tries.set(userId, trie);
    }

    let invertedIndex = this.invertedIndices.get(userId);
    if (!invertedIndex) {
      invertedIndex = new Map();
      this.invertedIndices.set(userId, invertedIndex);
    }

    let contactMap = this.contacts.get(userId);
    if (!contactMap) {
      contactMap = new Map();
      this.contacts.set(userId, contactMap);
    }

    const contactId = String(contact._id);
    const record: ContactRecord = {
      _id: contactId,
      name: contact.name,
      email: contact.email,
      company: contact.company,
      phone: contact.phone,
      tags: contact.tags,
    };
    contactMap.set(contactId, record);

    const tokens = this.tokenize(contact);
    for (const token of tokens) {
      this.insertIntoTrie(trie, token, contactId);

      if (!invertedIndex.has(token)) {
        invertedIndex.set(token, new Set());
      }
      invertedIndex.get(token)!.add(contactId);
    }
  }

  /**
   * Remove a single contact from the index.
   */
  removeContact(userId: string, contactId: string, contact: IContact): void {
    const contactMap = this.contacts.get(userId);
    if (contactMap) {
      contactMap.delete(contactId);
    }

    const invertedIndex = this.invertedIndices.get(userId);
    if (invertedIndex) {
      const tokens = this.tokenize(contact);
      for (const token of tokens) {
        const idSet = invertedIndex.get(token);
        if (idSet) {
          idSet.delete(contactId);
          if (idSet.size === 0) {
            invertedIndex.delete(token);
          }
        }
      }
    }

    // For trie, we rebuild lazily — removing individual entries from a trie
    // is complex and error-prone. The inverted index handles search correctness.
    // Trie autocomplete may return stale IDs which get filtered by existence check.
  }

  /**
   * Update a contact in the index by removing old data and adding new.
   */
  updateContact(
    userId: string,
    contactId: string,
    oldContact: IContact,
    newContact: IContact
  ): void {
    this.removeContact(userId, contactId, oldContact);
    this.addContact(userId, newContact);
  }

  /**
   * Search contacts by query string.
   * Uses inverted index first, falls back to Fuse.js fuzzy search if results are sparse.
   */
  search(userId: string, query: string): string[] {
    const invertedIndex = this.invertedIndices.get(userId);
    const contactMap = this.contacts.get(userId);

    if (!invertedIndex || !contactMap) return [];

    const queryTokens = query
      .toLowerCase()
      .split(/[\s\-_.@+()]+/)
      .filter((t) => t.length > 0);

    if (queryTokens.length === 0) return [];

    // Intersect results from inverted index for each query token
    let resultSet: Set<string> | null = null;

    for (const token of queryTokens) {
      const matchingIds = new Set<string>();

      // Exact token match
      const exactMatch = invertedIndex.get(token);
      if (exactMatch) {
        for (const id of exactMatch) matchingIds.add(id);
      }

      // Prefix match for partial queries
      for (const [indexedToken, ids] of invertedIndex) {
        if (indexedToken.startsWith(token) && indexedToken !== token) {
          for (const id of ids) matchingIds.add(id);
        }
      }

      if (resultSet === null) {
        resultSet = matchingIds;
      } else {
        // Intersect
        const intersection = new Set<string>();
        for (const id of matchingIds) {
          if (resultSet.has(id)) intersection.add(id);
        }
        resultSet = intersection;
      }
    }

    const indexResults = resultSet ? Array.from(resultSet) : [];

    // If we have enough results, return them
    if (indexResults.length >= 5) {
      return indexResults;
    }

    // Fall back to Fuse.js fuzzy search
    const allContacts = Array.from(contactMap.values());
    const fuse = new Fuse(allContacts, {
      keys: ['name', 'email', 'company', 'phone'],
      threshold: 0.4,
      includeScore: true,
    });

    const fuseResults = fuse.search(query);
    const fuseIds = fuseResults.map((r) => r.item._id);

    // Merge: index results first, then fuse results (deduped)
    const merged = new Set<string>(indexResults);
    for (const id of fuseIds) {
      merged.add(id);
    }

    return Array.from(merged);
  }

  /**
   * Autocomplete contacts by prefix using the trie.
   * Returns up to 10 matching contact IDs.
   */
  autocomplete(userId: string, prefix: string): string[] {
    const trie = this.tries.get(userId);
    const contactMap = this.contacts.get(userId);
    if (!trie || !contactMap) return [];

    const normalizedPrefix = prefix.toLowerCase().trim();
    if (normalizedPrefix.length === 0) return [];

    // Walk trie to the prefix node
    let node: TrieNode | undefined = trie;
    for (const char of normalizedPrefix) {
      node = node.children.get(char);
      if (!node) return [];
    }

    // Collect contact IDs from this subtree
    const collected = this.collectFromTrie(node, 10);

    // Filter to only IDs that still exist in the contact map
    const validIds: string[] = [];
    for (const id of collected) {
      if (contactMap.has(id) && validIds.length < 10) {
        validIds.push(id);
      }
    }

    return validIds;
  }

  /**
   * Tokenize a contact into searchable lowercase tokens.
   */
  private tokenize(contact: Partial<IContact>): string[] {
    const parts: string[] = [];

    if (contact.name) parts.push(contact.name);
    if (contact.email) parts.push(contact.email);
    if (contact.company) parts.push(contact.company);
    if (contact.phone) parts.push(contact.phone);
    if (contact.tags) {
      for (const tag of contact.tags) {
        parts.push(tag);
      }
    }

    const tokens = new Set<string>();
    for (const part of parts) {
      const words = part.toLowerCase().split(/[\s\-_.@+()]+/);
      for (const word of words) {
        const trimmed = word.trim();
        if (trimmed.length > 0) {
          tokens.add(trimmed);
        }
      }
    }

    return Array.from(tokens);
  }

  /**
   * Insert a word into the trie with an associated contact ID.
   */
  private insertIntoTrie(trie: TrieNode, word: string, contactId: string): void {
    let node = trie;
    for (const char of word) {
      if (!node.children.has(char)) {
        node.children.set(char, new TrieNode());
      }
      node = node.children.get(char)!;
      node.contactIds.add(contactId);
    }
    node.isEnd = true;
  }

  /**
   * Collect contact IDs from a trie subtree using BFS, up to a limit.
   */
  private collectFromTrie(node: TrieNode, limit: number): Set<string> {
    const result = new Set<string>();
    const queue: TrieNode[] = [node];

    while (queue.length > 0 && result.size < limit) {
      const current = queue.shift()!;

      for (const id of current.contactIds) {
        result.add(id);
        if (result.size >= limit) break;
      }

      for (const child of current.children.values()) {
        queue.push(child);
      }
    }

    return result;
  }
}

export const searchIndexService = new SearchIndexService();
