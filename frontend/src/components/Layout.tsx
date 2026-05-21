import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Users, Star, Tag, Upload, Download, LogOut, ChevronDown, Search, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useUiStore } from '@/stores/uiStore';
import { useContacts } from '@/hooks/useContacts';
import { authApi } from '@/api/auth';
import { ThemeToggle } from './ThemeToggle';

interface LayoutProps {
  children: React.ReactNode;
}

interface SidebarContentProps {
  activeTag: string | null;
  setActiveTag: (tag: string | null) => void;
  showFavoritesOnly: boolean;
  toggleFavoritesOnly: () => void;
  openModal: (type: 'addContact' | 'editContact' | 'import' | 'export', contactId?: string) => void;
  allTags: string[];
  onNavigate?: () => void;
}

function SidebarContent({
  activeTag,
  setActiveTag,
  showFavoritesOnly,
  toggleFavoritesOnly,
  openModal,
  allTags,
  onNavigate,
}: SidebarContentProps) {
  const handleClick = (fn: () => void) => {
    fn();
    onNavigate?.();
  };

  return (
    <>
      <nav className="flex-1 px-4 py-6 space-y-6">
        <div>
          <p className="text-[12px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">
            Filters
          </p>
          <div className="space-y-1">
            <button
              onClick={() =>
                handleClick(() => {
                  setActiveTag(null);
                  if (showFavoritesOnly) toggleFavoritesOnly();
                })
              }
              className={`w-full text-left px-3 py-1.5 rounded-apple-sm text-[14px] transition-colors ${
                !activeTag && !showFavoritesOnly
                  ? 'bg-[var(--text-primary)] text-[var(--bg-page)]'
                  : 'text-[var(--link-color)] hover:bg-[var(--border-soft)]'
              }`}
            >
              All Contacts
            </button>
            <button
              onClick={() => handleClick(toggleFavoritesOnly)}
              className={`w-full text-left px-3 py-1.5 rounded-apple-sm text-[14px] transition-colors ${
                showFavoritesOnly
                  ? 'bg-[var(--text-primary)] text-[var(--bg-page)]'
                  : 'text-[var(--link-color)] hover:bg-[var(--border-soft)]'
              }`}
            >
              Favorites
            </button>
          </div>
        </div>

        <div>
          <p className="text-[12px] font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-2">
            Tags
          </p>
          <div className="space-y-1">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() =>
                  handleClick(() => setActiveTag(activeTag === tag ? null : tag))
                }
                className={`w-full text-left px-3 py-1.5 rounded-apple-sm text-[14px] transition-colors ${
                  activeTag === tag
                    ? 'bg-[var(--text-primary)] text-[var(--bg-page)]'
                    : 'text-[var(--link-color)] hover:bg-[var(--border-soft)]'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className="p-4 space-y-2 border-t border-[var(--border-hard)]">
        <button
          onClick={() => handleClick(() => openModal('import'))}
          className="w-full text-left px-3 py-2 text-[14px] text-[var(--link-color)] hover:bg-[var(--border-soft)] rounded-apple-sm transition-colors"
        >
          Import Contacts
        </button>
        <button
          onClick={() => handleClick(() => openModal('export'))}
          className="w-full text-left px-3 py-2 text-[14px] text-[var(--link-color)] hover:bg-[var(--border-soft)] rounded-apple-sm transition-colors"
        >
          Export Contacts
        </button>
      </div>
    </>
  );
}

export function Layout({ children }: LayoutProps) {
  const { user, logout: logoutStore } = useAuthStore();
  const {
    sidebarOpen,
    toggleSidebar,
    activeTag,
    setActiveTag,
    showFavoritesOnly,
    toggleFavoritesOnly,
    openModal,
  } = useUiStore();

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { data: contactsData } = useContacts({ limit: 1 });

  const allTags = ['Family', 'Work', 'Friends', 'VIP', 'Business', 'Personal'];

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {
      // Continue even if API fails
    }
    logoutStore();
    navigate('/login', { replace: true });
  };

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[var(--bg-page)] text-[var(--text-primary)]">
      {/* Global Nav */}
      <header className="global-nav flex items-center justify-between h-[44px] bg-apple-surface-black text-apple-body-on-dark px-4 lg:px-6 relative z-50">
        <div className="flex items-center gap-4">
          <button onClick={toggleSidebar} className="lg:hidden text-apple-body-muted hover:text-white transition-colors">
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          <div className="flex items-center gap-2">
            {/* Apple-like minimalist logo */}
            <Users size={16} />
            <span className="text-[12px] font-normal tracking-apple-tight hidden sm:block">ContactFlow</span>
          </div>
        </div>


        <div className="flex items-center gap-4">

          <ThemeToggle />
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="w-6 h-6 rounded-full bg-apple-surface-chip flex items-center justify-center text-[10px] font-bold text-white hover:opacity-80 transition-opacity"
            >
              {initials}
            </button>
            <AnimatePresence>
              {userMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="absolute right-0 top-full mt-2 w-48 bg-apple-surface-tile-2 rounded-apple-md shadow-apple-product py-1 z-50 border border-apple-hairline-dark text-white"
                >
                  <div className="px-4 py-2 border-b border-apple-hairline-dark mb-1">
                    <p className="text-[14px] font-medium">{user?.name}</p>
                    <p className="text-[12px] text-apple-body-muted">{user?.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-[14px] hover:bg-apple-primary hover:text-white transition-colors"
                  >
                    Sign out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Sub-Nav Frosted */}
      <div className="sub-nav-frosted border-b border-[var(--border-hard)]">
        <h2 className="text-[21px] font-semibold tracking-apple-loose">Contacts</h2>
        <div className="flex items-center gap-4">
          <span className="text-[14px] text-[var(--text-primary)] hidden sm:block tracking-apple-tighter">
            {contactsData?.total ?? 0} total
          </span>
          <button className="btn-primary" onClick={() => openModal('addContact')}>
            Add Contact
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar overlay on mobile only */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-20 lg:hidden"
              onClick={toggleSidebar}
            />
          )}
        </AnimatePresence>

        {/* Desktop Sidebar — collapsible on lg+ */}
        <div className="hidden lg:flex h-full relative">
          <motion.aside
            initial={false}
            animate={{ width: sidebarOpen ? 260 : 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="h-full bg-[var(--bg-page)] border-r border-[var(--border-hard)] flex flex-col overflow-hidden"
          >
            <div className="w-[260px] h-full flex flex-col overflow-y-auto">
              <SidebarContent
                activeTag={activeTag}
                setActiveTag={setActiveTag}
                showFavoritesOnly={showFavoritesOnly}
                toggleFavoritesOnly={toggleFavoritesOnly}
                openModal={openModal}
                allTags={allTags}
              />
            </div>
          </motion.aside>

          {/* Toggle button */}
          {sidebarOpen ? (
            <button
              onClick={toggleSidebar}
              className="absolute -right-3 top-4 z-30 w-6 h-6 rounded-full bg-[var(--bg-card)] border border-[var(--border-hard)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-secondary)] transition-all duration-200 shadow-sm"
              title="Collapse sidebar"
            >
              <PanelLeftClose size={12} />
            </button>
          ) : (
            <button
              onClick={toggleSidebar}
              className="ml-2 mt-3 z-30 w-9 h-9 rounded-apple-sm bg-[var(--bg-card)] border border-[var(--border-hard)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--border-soft)] transition-all duration-200 shadow-sm"
              title="Expand sidebar"
            >
              <Menu size={18} />
            </button>
          )}
        </div>

        {/* Mobile Sidebar — animated slide-in */}
        <AnimatePresence>
          {sidebarOpen && (
            <motion.aside
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="absolute z-20 w-[260px] h-full bg-[var(--bg-page)] border-r border-[var(--border-hard)] flex flex-col overflow-y-auto lg:hidden"
            >
              <SidebarContent
                activeTag={activeTag}
                setActiveTag={setActiveTag}
                showFavoritesOnly={showFavoritesOnly}
                toggleFavoritesOnly={toggleFavoritesOnly}
                openModal={openModal}
                allTags={allTags}
                onNavigate={toggleSidebar}
              />
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main content */}
        <main id="main-scroll-container" className="flex-1 overflow-y-auto bg-[var(--bg-page)] relative z-10">
          {children}
        </main>
      </div>
    </div>
  );
}
