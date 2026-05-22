import React, { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

export const TagInput: React.FC<TagInputProps> = ({
  value = [],
  onChange,
  placeholder = 'Add tag...',
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const trimmed = inputValue.trim().replace(/,/g, '');
    if (trimmed && !value.includes(trimmed)) {
      const newTags = [...value, trimmed];
      onChange(newTags);
      setInputValue('');
    }
  };

  const removeTag = (indexToRemove: number) => {
    const newTags = value.filter((_, idx) => idx !== indexToRemove);
    onChange(newTags);
  };

  return (
    <div className="space-y-2">
      {/* Pills Container */}
      <div className="flex flex-wrap gap-2 min-h-[44px] p-2 input-field focus-within:border-resend-ink transition-colors">
        {value.map((tag, idx) => (
          <span
            key={tag}
            className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono text-resend-ink bg-resend-surface-card border border-resend-hairline-strong rounded-resend-sm transition-colors"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(idx)}
              className="text-resend-ash hover:text-red-500 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </span>
        ))}

        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addTag}
          placeholder={value.length === 0 ? placeholder : ''}
          className="flex-grow bg-transparent border-0 p-1 text-[13px] text-resend-ink placeholder-resend-ash focus:outline-none focus:ring-0 min-w-[120px]"
        />
      </div>
      <p className="text-[12px] text-resend-charcoal font-mono">Press Enter or comma to add a tag</p>
    </div>
  );
};
