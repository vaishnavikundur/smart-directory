import { useState, useEffect } from 'react';
import { useUiStore } from '@/stores/uiStore';
import { useContacts } from '@/hooks/useContacts';
import { SearchBar } from '@/components/SearchBar';
import { ContactList } from '@/components/ContactList';
import { ContactModal } from '@/components/ContactModal';
import { ImportExportModal } from '@/components/ImportExportModal';
import { ArrowUpDown, Filter, ChevronDown } from 'lucide-react';

export default function DashboardPage() {
  const {
    searchQuery,
    activeTag,
    showFavoritesOnly,
    sortBy,
    sortOrder,
    setSortBy,
    setSortOrder,
  } = useUiStore();

  const [page, setPage] = useState(1);
  const limit = 20;

  // Reset page to 1 on filter changes to avoid empty pages
  useEffect(() => {
    setPage(1);
  }, [searchQuery, activeTag, showFavoritesOnly, sortBy, sortOrder]);

  const { data, isLoading } = useContacts({
    search: searchQuery || undefined,
    tag: activeTag || undefined,
    favorite: showFavoritesOnly || undefined,
    sortBy,
    order: sortOrder,
    page,
    limit,
  });

  return (
    <div className="max-w-[1200px] mx-auto space-y-6">
      {/* Search Bar & Action row */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between w-full pt-4">
        <div className="w-full md:max-w-md">
          <SearchBar />
        </div>
        
        {/* Sorting & Filter Details Bar */}
        <div className="flex items-center gap-4 bg-resend-surface-elevated rounded-resend-sm px-4 py-2 border border-resend-hairline-strong shadow-sm font-mono">
          <div className="flex items-center gap-2 text-[13px] text-resend-ash">
            <Filter size={14} />
            <span className="text-resend-ink font-medium">
              {showFavoritesOnly ? 'Favorites' : activeTag ? `Tag: ${activeTag}` : 'All'}
            </span>
          </div>
          
          <div className="h-4 w-[1px] bg-resend-hairline-strong"></div>

          <div className="flex items-center gap-2">
            <ArrowUpDown size={14} className="text-resend-ash" />
            <div className="relative flex items-center">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="appearance-none bg-transparent text-[13px] text-resend-ink font-medium cursor-pointer focus:outline-none pr-4"
              >
                <option value="name">Name</option>
                <option value="createdAt">Date Created</option>
                <option value="company">Company</option>
              </select>
              <ChevronDown size={12} className="absolute right-0 pointer-events-none text-resend-ash" />
            </div>

            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="text-[12px] font-bold text-resend-ink hover:text-resend-ash transition-colors ml-2"
              title={sortOrder === 'asc' ? 'Sort Ascending' : 'Sort Descending'}
            >
              {sortOrder === 'asc' ? 'ASC' : 'DESC'}
            </button>
          </div>
        </div>
      </div>

      {searchQuery && (
        <div className="text-[13px] text-resend-ash font-mono">
          Showing results for <span className="font-semibold text-resend-ink">"{searchQuery}"</span>
        </div>
      )}

      {/* Virtualized List View */}
      <div className="min-h-[400px]">
        <ContactList
          contacts={data?.data || []}
          isLoading={isLoading}
          page={page}
          totalPages={data?.totalPages || 0}
          onPageChange={setPage}
        />
      </div>

      {/* Global Modal Overlay Controllers */}
      <ContactModal />
      <ImportExportModal />
    </div>
  );
}
