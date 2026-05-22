import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Loader2, User, Building2, Clock } from 'lucide-react';
import { useUiStore } from '@/stores/uiStore';
import { useDebounce } from '@/hooks/useDebounce';
import { useAutocomplete, useRecentContacts } from '@/hooks/useContacts';
import type { Contact } from '@/types';

export function SearchBar() {
  const { searchQuery, setSearchQuery } = useUiStore();
  const [inputValue, setInputValue] = useState(searchQuery);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const debouncedInput = useDebounce(inputValue, 250);
  const { data: autocompleteResults, isLoading: isAutoLoading } = useAutocomplete(debouncedInput);
  const { data: recentContacts } = useRecentContacts();

  const showRecent = isFocused && inputValue.length < 2 && recentContacts && recentContacts.length > 0;
  const showAutocomplete = isFocused && inputValue.length >= 2;
  const displayResults = showAutocomplete ? autocompleteResults || [] : showRecent ? recentContacts || [] : [];
  const showDropdown = isFocused && (showRecent || (showAutocomplete && (isAutoLoading || displayResults.length > 0)));

  useEffect(() => {
    setSearchQuery(debouncedInput);
  }, [debouncedInput, setSearchQuery]);

  useEffect(() => {
    setSelectedIndex(-1);
  }, [displayResults]);

  const handleSelect = useCallback(
    (contact: Contact) => {
      setInputValue(contact.name);
      setSearchQuery(contact.name);
      setIsFocused(false);
      inputRef.current?.blur();
    },
    [setSearchQuery]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, displayResults.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && displayResults[selectedIndex]) {
          handleSelect(displayResults[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsFocused(false);
        inputRef.current?.blur();
        break;
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        !inputRef.current?.contains(e.target as Node)
      ) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="relative flex items-center">
        <div className="absolute left-4 text-resend-ash pointer-events-none">
          <Search size={16} />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search contacts..."
          className="search-input pl-11 pr-10"
        />
        {isAutoLoading && inputValue.length >= 2 && (
          <div className="absolute right-4">
            <Loader2 size={16} className="text-resend-charcoal animate-spin" />
          </div>
        )}
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -4, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 bg-resend-surface-elevated border border-resend-hairline-strong shadow-2xl rounded-resend-md overflow-hidden z-50 max-h-80 overflow-y-auto"
          >
            {showRecent && (
              <div className="px-4 py-3 border-b border-resend-hairline">
                <p className="text-[12px] font-medium text-resend-ash uppercase tracking-widest flex items-center gap-1.5 font-mono">
                  <Clock size={14} />
                  Recent Contacts
                </p>
              </div>
            )}

            {isAutoLoading && displayResults.length === 0 ? (
              <div className="px-4 py-8 text-center text-resend-charcoal text-[13px] font-mono">
                <Loader2 size={20} className="animate-spin mx-auto mb-2 text-resend-ash" />
                Searching...
              </div>
            ) : displayResults.length === 0 && inputValue.length >= 2 ? (
              <div className="px-4 py-8 text-center text-resend-charcoal text-[13px] font-mono">
                No contacts found for "{inputValue}"
              </div>
            ) : (
              <div className="py-2">
                {displayResults.map((contact, index) => (
                  <button
                    key={contact.id}
                    onClick={() => handleSelect(contact)}
                    className={`w-full flex items-center gap-4 px-4 py-3 text-left transition-colors ${
                      index === selectedIndex
                        ? 'bg-resend-surface-card'
                        : 'hover:bg-resend-surface-card'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-resend-full bg-resend-surface-card border border-resend-hairline-strong flex items-center justify-center text-[13px] font-medium text-resend-ink flex-shrink-0">
                      {contact.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-medium text-resend-ink truncate tracking-resend-tight">{contact.name}</p>
                      <div className="flex items-center gap-3 mt-1">
                        {contact.email && (
                          <span className="text-[12px] text-resend-ash flex items-center gap-1.5 truncate font-mono">
                            <User size={12} />
                            {contact.email}
                          </span>
                        )}
                        {contact.company && (
                          <span className="text-[12px] text-resend-ash flex items-center gap-1.5 truncate font-mono">
                            <Building2 size={12} />
                            {contact.company}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
