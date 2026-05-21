import { motion } from 'framer-motion';
import { Star, Mail, Phone, Building2, MapPin, MoreHorizontal, Trash, Edit } from 'lucide-react';
import { useUiStore } from '@/stores/uiStore';
import { useToggleFavorite, useDeleteContact } from '@/hooks/useContacts';
import { useState } from 'react';
import type { Contact } from '@/types';

interface ContactCardProps {
  contact: Contact;
  index: number;
}

const avatarColors = [
  'bg-blue-500', 'bg-indigo-500', 'bg-purple-500', 'bg-pink-500',
  'bg-rose-500', 'bg-orange-500', 'bg-emerald-500', 'bg-teal-500'
];

function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return avatarColors[Math.abs(hash) % avatarColors.length];
}

function getInitials(name: string): string {
  return name.split(' ').filter(Boolean).map((n) => n[0]).join('').toUpperCase().slice(0, 2);
}

export function ContactCard({ contact, index }: ContactCardProps) {
  const { openModal } = useUiStore();
  const toggleFavorite = useToggleFavorite();
  const deleteContact = useDeleteContact();
  
  const [showOptions, setShowOptions] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite.mutate({ id: contact.id, isFavorite: !contact.isFavorite });
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    openModal('editContact', contact.id);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (showDeleteConfirm) {
      deleteContact.mutate(contact.id);
    } else {
      setShowDeleteConfirm(true);
      setTimeout(() => setShowDeleteConfirm(false), 3000);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, delay: Math.min(index * 0.05, 0.5) }}
      onClick={() => openModal('editContact', contact.id)}
      className="store-utility-card group relative cursor-pointer hover:shadow-apple-product"
    >
      <div className="flex flex-col gap-4">
        {/* Header: Avatar + Name + Actions */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-[48px] h-[48px] rounded-full ${getAvatarColor(contact.name)} flex items-center justify-center text-white text-[16px] font-semibold tracking-tight shadow-sm`}>
              {getInitials(contact.name)}
            </div>
            <div>
              <h3 className="text-[17px] font-semibold text-[var(--text-primary)] leading-tight tracking-apple-tight">
                {contact.name}
              </h3>
              {contact.company && (
                <p className="text-[14px] text-[var(--text-secondary)] mt-0.5 tracking-apple-tight">{contact.company}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={handleFavoriteClick}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--border-soft)] transition-colors"
            >
              <Star
                size={18}
                className={contact.isFavorite ? 'text-amber-400 fill-amber-400' : 'text-[var(--text-secondary)]'}
              />
            </button>
            <div className="relative">
              <button
                onClick={(e) => { e.stopPropagation(); setShowOptions(!showOptions); }}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[var(--border-soft)] text-[var(--text-secondary)] transition-opacity opacity-60 sm:opacity-0 group-hover:opacity-100"
              >
                <MoreHorizontal size={18} />
              </button>
              
              {showOptions && (
                <>
                  {/* Invisible backdrop to detect clicks outside the dropdown */}
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      setShowOptions(false); 
                      setShowDeleteConfirm(false); 
                    }} 
                  />
                  
                  {/* Dropdown Menu */}
                  <div className="absolute top-full right-0 mt-1 w-32 bg-[var(--bg-card)] border border-[var(--border-hard)] shadow-apple-product rounded-apple-sm overflow-hidden z-20">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowOptions(false);
                        handleEditClick(e);
                      }} 
                      className="w-full text-left px-4 py-2 text-[14px] text-[var(--text-primary)] hover:bg-[var(--border-soft)] flex items-center gap-2"
                    >
                      <Edit size={14} /> Edit
                    </button>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(e);
                      }} 
                      className="w-full text-left px-4 py-2 text-[14px] text-red-500 hover:bg-red-500/10 flex items-center gap-2"
                    >
                      <Trash size={14} /> {showDeleteConfirm ? 'Confirm?' : 'Delete'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Contact Details */}
        <div className="space-y-2 mt-2">
          {contact.email && (
            <div className="flex items-center gap-3 text-[14px] text-[var(--text-secondary)]">
              <Mail size={16} className="text-[var(--text-secondary)]/70" />
              <span className="truncate">{contact.email}</span>
            </div>
          )}
          {contact.phone && (
            <div className="flex items-center gap-3 text-[14px] text-[var(--text-secondary)]">
              <Phone size={16} className="text-[var(--text-secondary)]/70" />
              <span>{contact.phone}</span>
            </div>
          )}
          {contact.address && (
            <div className="flex items-center gap-3 text-[14px] text-[var(--text-secondary)]">
              <MapPin size={16} className="text-[var(--text-secondary)]/70" />
              <span className="truncate">{contact.address}</span>
            </div>
          )}
        </div>

        {/* Tags */}
        {contact.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {contact.tags.map((tag) => (
              <span
                key={tag}
                onClick={(e) => {
                  e.stopPropagation();
                  useUiStore.getState().setActiveTag(tag);
                }}
                className="px-2.5 py-1 text-[12px] font-medium rounded-full bg-[var(--border-soft)] text-[var(--text-primary)] hover:bg-[var(--border-hard)] transition-colors"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
