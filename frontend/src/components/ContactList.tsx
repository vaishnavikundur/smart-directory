import { useState, useEffect } from 'react';
import { Virtuoso } from 'react-virtuoso';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, ChevronLeft, ChevronRight } from 'lucide-react';
import { ContactCard } from './ContactCard';
import { LoadingSkeleton } from './LoadingSkeleton';
import type { Contact } from '@/types';

interface ContactListProps {
  contacts: Contact[];
  isLoading: boolean;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function ContactList({
  contacts,
  isLoading,
  page,
  totalPages,
  onPageChange,
}: ContactListProps) {
  const [scrollParent, setScrollParent] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setScrollParent(document.getElementById('main-scroll-container'));
  }, []);

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (contacts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-32"
      >
        <div className="w-16 h-16 rounded-full bg-[var(--border-soft)] flex items-center justify-center mb-6 text-[var(--text-secondary)]">
          <Users size={32} />
        </div>
        <h3 className="text-[21px] font-semibold text-[var(--text-primary)] mb-2 tracking-apple-loose">No contacts found</h3>
        <p className="text-[14px] text-[var(--text-secondary)] text-center max-w-sm">
          Try adjusting your search or filters, or add a new contact to get started.
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      <AnimatePresence mode="popLayout">
        {scrollParent && (
          <Virtuoso
            customScrollParent={scrollParent}
            data={contacts}
            useWindowScroll={false}
            itemContent={(index, contact) => (
              <div className="pb-4" key={contact.id}>
                <ContactCard contact={contact} index={index} />
              </div>
            )}
          />
        )}
      </AnimatePresence>

      {/* Pagination */}
      {totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center gap-2 pt-6 pb-8"
        >
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--bg-card)] border border-[var(--border-hard)] text-[var(--text-primary)] hover:bg-[var(--border-soft)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={16} />
          </button>

          {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
            let pageNum: number;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (page <= 3) {
              pageNum = i + 1;
            } else if (page >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = page - 2 + i;
            }
            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`w-10 h-10 flex items-center justify-center rounded-full text-[14px] font-medium transition-colors ${
                  page === pageNum
                    ? 'bg-[var(--text-primary)] text-[var(--bg-page)]'
                    : 'bg-[var(--bg-card)] border border-[var(--border-hard)] text-[var(--text-primary)] hover:bg-[var(--border-soft)]'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--bg-card)] border border-[var(--border-hard)] text-[var(--text-primary)] hover:bg-[var(--border-soft)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </motion.div>
      )}
    </div>
  );
}
