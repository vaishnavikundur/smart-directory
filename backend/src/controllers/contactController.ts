import { Request, Response, NextFunction } from 'express';
import { format } from 'fast-csv';
import mongoose from 'mongoose';
import Contact, { IContact } from '../models/Contact.js';
import { createContactSchema, importContactsSchema } from '../validators/contact.js';
import { searchIndexService } from '../services/searchIndex.js';
import type { CreateContactInput, UpdateContactInput } from '../validators/contact.js';

export async function getContacts(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const userId = req.userId!;
    const {
      search,
      tag,
      favorite,
      sortBy = 'createdAt',
      order = 'desc',
      page = '1',
      limit = '20',
    } = req.query as Record<string, string | undefined>;

    const pageNum = Math.max(1, parseInt(page || '1', 10));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit || '20', 10)));
    const skip = (pageNum - 1) * limitNum;

    let contactIds: string[] | null = null;

    // If search query is present, use SearchIndexService first
    if (search && search.trim().length > 0) {
      contactIds = searchIndexService.search(userId, search.trim());
    }

    // Build MongoDB query
    const query: Record<string, unknown> = { userId: new mongoose.Types.ObjectId(userId) };

    if (contactIds !== null) {
      if (contactIds.length === 0) {
        res.json({ data: [], total: 0, page: pageNum, totalPages: 0 });
        return;
      }
      query['_id'] = { $in: contactIds.map((id) => new mongoose.Types.ObjectId(id)) };
    }

    if (tag) {
      query['tags'] = new RegExp('^' + tag + '$', 'i');
    }

    if (favorite !== undefined) {
      query['isFavorite'] = favorite === 'true';
    }

    // Build sort
    const sortField = ['name', 'createdAt', 'updatedAt', 'company'].includes(sortBy || '')
      ? sortBy!
      : 'createdAt';
    const sortOrder = order === 'asc' ? 1 : -1;

    const [contacts, total] = await Promise.all([
      Contact.find(query)
        .sort({ [sortField]: sortOrder })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      Contact.countDocuments(query),
    ]);

    res.json({
      data: contacts.map(c => ({
        ...c,
        id: c._id.toString()
      })),
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (error) {
    next(error);
  }
}

export async function getContact(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const contact = await Contact.findOne({
      _id: req.params['id'],
      userId: req.userId,
    }).lean();

    if (!contact) {
      res.status(404).json({ error: 'Contact not found.' });
      return;
    }

    res.json({ ...contact, id: contact._id.toString() });
  } catch (error) {
    next(error);
  }
}

export async function createContact(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = createContactSchema.parse(req.body) as CreateContactInput;
    const userId = req.userId!;

    // Check for duplicate name
    if (data.name) {
      const existingName = await Contact.findOne({
        userId,
        name: new RegExp('^' + data.name.trim() + '$', 'i'),
      }).lean();
      if (existingName) {
        res.status(400).json({ error: 'Contact with this name already exists.' });
        return;
      }
    }

    // Check for duplicate phone
    if (data.phone) {
      const existingPhone = await Contact.findOne({
        userId,
        phone: data.phone.trim(),
      }).lean();
      if (existingPhone) {
        res.status(400).json({ error: 'Contact with this mobile number already exists.' });
        return;
      }
    }

    const contact = await Contact.create({ ...data, userId });

    // Add to search index
    searchIndexService.addContact(userId, contact);

    res.status(201).json({ ...contact.toObject(), id: contact._id.toString() });
  } catch (error) {
    next(error);
  }
}

export async function updateContact(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.userId!;
    const contactId = req.params['id']!;

    // Find existing contact for search index update
    const existingContact = await Contact.findOne({ _id: contactId, userId });
    if (!existingContact) {
      res.status(404).json({ error: 'Contact not found.' });
      return;
    }

    // Store old contact data before update
    const oldContact = existingContact.toObject() as IContact;

    // Apply update
    const data = req.body as UpdateContactInput;
    
    // Check for duplicate name
    if (data.name) {
      const duplicateName = await Contact.findOne({
        userId,
        _id: { $ne: contactId },
        name: new RegExp('^' + data.name.trim() + '$', 'i'),
      }).lean();
      if (duplicateName) {
        res.status(400).json({ error: 'Contact with this name already exists.' });
        return;
      }
    }

    // Check for duplicate phone
    if (data.phone) {
      const duplicatePhone = await Contact.findOne({
        userId,
        _id: { $ne: contactId },
        phone: data.phone.trim(),
      }).lean();
      if (duplicatePhone) {
        res.status(400).json({ error: 'Contact with this mobile number already exists.' });
        return;
      }
    }

    Object.assign(existingContact, data);
    const updatedContact = await existingContact.save();

    // Update search index
    searchIndexService.updateContact(userId, contactId as string, oldContact, updatedContact);

    res.json({ ...updatedContact.toObject(), id: updatedContact._id.toString() });
  } catch (error) {
    next(error);
  }
}

export async function deleteContact(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.userId!;
    const contactId = req.params['id']!;

    const contact = await Contact.findOneAndDelete({ _id: contactId, userId });
    if (!contact) {
      res.status(404).json({ error: 'Contact not found.' });
      return;
    }

    // Remove from search index
    searchIndexService.removeContact(userId, contactId as string, contact);

    res.json({ message: 'Contact deleted successfully.' });
  } catch (error) {
    next(error);
  }
}

export async function checkDuplicate(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.userId!;
    const { email, phone, name } = req.query as { email?: string; phone?: string; name?: string };

    if (!email && !phone && !name) {
      res.status(400).json({ error: 'Provide name, email, or phone to check for duplicates.' });
      return;
    }

    const conditions: Record<string, unknown>[] = [];
    if (email) conditions.push({ email: email.toLowerCase() });
    if (phone) conditions.push({ phone: phone.trim() });
    if (name) conditions.push({ name: new RegExp('^' + name.trim() + '$', 'i') });

    const existingContact = await Contact.findOne({
      userId,
      $or: conditions,
    }).lean();

    if (existingContact) {
      res.json({ isDuplicate: true, existingContact });
    } else {
      res.json({ isDuplicate: false });
    }
  } catch (error) {
    next(error);
  }
}

export async function autocomplete(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.userId!;
    const prefix = (req.query['prefix'] as string) || '';

    if (prefix.trim().length === 0) {
      res.json({ contacts: [] });
      return;
    }

    const contactIds = searchIndexService.autocomplete(userId, prefix.trim());

    if (contactIds.length === 0) {
      res.json({ contacts: [] });
      return;
    }

    const contacts = await Contact.find({
      _id: { $in: contactIds.map((id) => new mongoose.Types.ObjectId(id)) },
      userId,
    })
      .limit(10)
      .lean();

    res.json({ contacts: contacts.map(c => ({ ...c, id: c._id.toString() })) });
  } catch (error) {
    next(error);
  }
}

export async function importContacts(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.userId!;
    let rawData: unknown[];

    // Handle file upload (JSON file) or raw body
    if (req.file) {
      const fileContent = req.file.buffer.toString('utf-8');
      rawData = JSON.parse(fileContent);
    } else if (Array.isArray(req.body)) {
      rawData = req.body;
    } else if (req.body && req.body.contacts && Array.isArray(req.body.contacts)) {
      rawData = req.body.contacts;
    } else {
      res.status(400).json({ error: 'Provide a JSON array of contacts.' });
      return;
    }

    // Validate each contact
    const validContacts: CreateContactInput[] = [];
    const failed: { row: number; error: string }[] = [];

    for (let i = 0; i < rawData.length; i++) {
      const result = createContactSchema.safeParse(rawData[i]);
      if (result.success) {
        validContacts.push(result.data);
      } else {
        const errorMsg = result.error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join('; ');
        failed.push({ row: i + 1, error: errorMsg });
      }
    }

    let importedCount = 0;

    if (validContacts.length > 0) {
      const contactDocs = validContacts.map((c) => ({ ...c, userId }));
      const result = await Contact.insertMany(contactDocs, { ordered: false });
      importedCount = result.length;

      // Rebuild search index for user
      await searchIndexService.buildForUser(userId);
    }

    res.status(201).json({
      imported: importedCount,
      failed,
    });
  } catch (error) {
    // Handle partial insert failures from ordered:false
    if (error && typeof error === 'object' && 'insertedDocs' in error) {
      const bulkError = error as { insertedDocs: unknown[] };
      await searchIndexService.buildForUser(req.userId!);
      res.status(201).json({
        imported: bulkError.insertedDocs.length,
        failed: [{ row: 0, error: 'Some contacts failed to import' }],
      });
      return;
    }
    next(error);
  }
}

export async function exportContacts(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.userId!;
    const formatType = ((req.query['format'] as string) || 'json').toLowerCase();

    const cursor = Contact.find({ userId }).lean().cursor();

    if (formatType === 'csv') {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="contacts.csv"');

      const csvStream = format({ headers: true });
      csvStream.pipe(res);

      for await (const contact of cursor) {
        const c = contact as unknown as IContact;
        csvStream.write({
          name: c.name || '',
          phone: c.phone || '',
          email: c.email || '',
          company: c.company || '',
          address: c.address || '',
          tags: (c.tags || []).join(', '),
          isFavorite: c.isFavorite ? 'true' : 'false',
          createdAt: c.createdAt ? new Date(c.createdAt).toISOString() : '',
        });
      }

      csvStream.end();
    } else {
      // JSON streaming
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', 'attachment; filename="contacts.json"');

      res.write('[');
      let first = true;

      for await (const contact of cursor) {
        if (!first) res.write(',');
        res.write(JSON.stringify(contact));
        first = false;
      }

      res.write(']');
      res.end();
    }
  } catch (error) {
    next(error);
  }
}
