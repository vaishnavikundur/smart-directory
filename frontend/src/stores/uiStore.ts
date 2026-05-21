import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ModalType = null | 'addContact' | 'editContact' | 'import' | 'export';

interface UiState {
  theme: 'dark' | 'light';
  sidebarOpen: boolean;
  activeModal: ModalType;
  editingContactId: string | null;
  searchQuery: string;
  activeTag: string | null;
  showFavoritesOnly: boolean;
  sortBy: 'name' | 'createdAt' | 'company';
  sortOrder: 'asc' | 'desc';

  toggleTheme: () => void;
  toggleSidebar: () => void;
  openModal: (type: NonNullable<ModalType>, contactId?: string) => void;
  closeModal: () => void;
  setSearchQuery: (q: string) => void;
  setActiveTag: (tag: string | null) => void;
  toggleFavoritesOnly: () => void;
  setSortBy: (field: 'name' | 'createdAt' | 'company') => void;
  setSortOrder: (order: 'asc' | 'desc') => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      theme: 'dark',
      sidebarOpen: true,
      activeModal: null,
      editingContactId: null,
      searchQuery: '',
      activeTag: null,
      showFavoritesOnly: false,
      sortBy: 'createdAt',
      sortOrder: 'desc',

      toggleTheme: () =>
        set((state) => {
          const newTheme = state.theme === 'dark' ? 'light' : 'dark';
          if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
          return { theme: newTheme };
        }),

      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      openModal: (type, contactId) =>
        set({
          activeModal: type,
          editingContactId: contactId ?? null,
        }),

      closeModal: () => set({ activeModal: null, editingContactId: null }),

      setSearchQuery: (searchQuery) => set({ searchQuery }),

      setActiveTag: (activeTag) => set({ activeTag }),

      toggleFavoritesOnly: () =>
        set((state) => ({ showFavoritesOnly: !state.showFavoritesOnly })),

      setSortBy: (sortBy) => set({ sortBy }),

      setSortOrder: (sortOrder) => set({ sortOrder }),
    }),
    {
      name: 'contactflow-ui',
      partialize: (state) => ({ theme: state.theme }),
      onRehydrateStorage: () => (state) => {
        if (state?.theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },
    }
  )
);
