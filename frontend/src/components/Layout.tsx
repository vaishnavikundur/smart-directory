import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Users, PanelLeftClose } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useUiStore } from '@/stores/uiStore';
import { useContacts } from '@/hooks/useContacts';
import { authApi } from '@/api/auth';

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
      <nav className="flex-1 px-4 py-6 space-y-8">
        <div>
          <p className="text-[12px] font-semibold text-resend-mute uppercase tracking-wider mb-3">
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
              className={`w-full text-left px-3 py-1.5 rounded-resend-sm text-[14px] transition-colors ${
                !activeTag && !showFavoritesOnly
                  ? 'bg-resend-surface-card text-resend-ink border border-resend-hairline-strong'
                  : 'text-resend-mute hover:text-resend-ink hover:bg-resend-surface-elevated border border-transparent'
              }`}
            >
              All Contacts
            </button>
            <button
              onClick={() => handleClick(toggleFavoritesOnly)}
              className={`w-full text-left px-3 py-1.5 rounded-resend-sm text-[14px] transition-colors ${
                showFavoritesOnly
                  ? 'bg-resend-surface-card text-resend-ink border border-resend-hairline-strong'
                  : 'text-resend-mute hover:text-resend-ink hover:bg-resend-surface-elevated border border-transparent'
              }`}
            >
              Favorites
            </button>
          </div>
        </div>

        <div>
          <p className="text-[12px] font-semibold text-resend-mute uppercase tracking-wider mb-3">
            Tags
          </p>
          <div className="space-y-1">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() =>
                  handleClick(() => setActiveTag(activeTag === tag ? null : tag))
                }
                className={`w-full text-left px-3 py-1.5 rounded-resend-sm text-[14px] transition-colors ${
                  activeTag === tag
                    ? 'bg-resend-surface-card text-resend-ink border border-resend-hairline-strong'
                    : 'text-resend-mute hover:text-resend-ink hover:bg-resend-surface-elevated border border-transparent'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className="p-4 space-y-2 border-t border-resend-hairline bg-resend-canvas">
        <button
          onClick={() => handleClick(() => openModal('import'))}
          className="w-full text-left px-3 py-2 text-[14px] text-resend-link hover:text-resend-ink hover:bg-resend-surface-elevated rounded-resend-sm transition-colors"
        >
          Import Contacts
        </button>
        <button
          onClick={() => handleClick(() => openModal('export'))}
          className="w-full text-left px-3 py-2 text-[14px] text-resend-link hover:text-resend-ink hover:bg-resend-surface-elevated rounded-resend-sm transition-colors"
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
    navigate('/', { replace: true });
  };

  const initials = user?.name
    ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  useEffect(() => {
    window.history.pushState(null, '', window.location.href);
    const handlePopState = () => {
      window.history.pushState(null, '', window.location.href);
    };
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-resend-canvas text-resend-ink">
      {/* Global Nav */}
      <header className="nav-bar relative z-50">
        <div className="flex items-center gap-4">
          <button onClick={toggleSidebar} className="lg:hidden text-resend-mute hover:text-resend-ink transition-colors">
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
          <div className="flex items-center gap-2">
            <Users size={16} />
            <span className="font-semibold hidden sm:block">SMART DIRECTORY</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="w-[32px] h-[32px] rounded-resend-full bg-resend-surface-elevated border border-resend-hairline-strong flex items-center justify-center text-[12px] font-bold text-resend-ink hover:bg-resend-surface-card transition-colors"
            >
              {initials}
            </button>
            <AnimatePresence>
              {userMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  className="absolute right-0 top-full mt-2 w-48 bg-resend-surface-card rounded-resend-lg shadow-2xl py-1 z-50 border border-resend-hairline-strong text-resend-ink"
                >
                  <div className="px-4 py-2 border-b border-resend-hairline-strong mb-1">
                    <p className="text-[14px] font-medium">{user?.name}</p>
                    <p className="text-[12px] text-resend-mute font-mono mt-1">{user?.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-[14px] hover:bg-resend-surface-elevated transition-colors"
                  >
                    Sign out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Sub-Nav / Header */}
      <div className="flex items-center justify-between px-4 lg:px-8 py-5 border-b border-resend-hairline bg-resend-canvas">
        <h2 className="text-[32px] font-normal tracking-resend-tight font-display">Contacts</h2>
        <div className="flex items-center gap-6">
          <span className="text-[13px] text-resend-mute hidden sm:block font-mono">
            {contactsData?.total ?? 0} TOTAL
          </span>
          <button className="button-primary" onClick={() => openModal('addContact')}>
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
               className="fixed inset-0 bg-resend-canvas/80 backdrop-blur-sm z-20 lg:hidden"
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
            className="h-full bg-resend-canvas border-r border-resend-hairline flex flex-col overflow-hidden"
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
              className="absolute -right-3 top-6 z-30 w-6 h-6 rounded-resend-full bg-resend-surface-elevated border border-resend-hairline-strong flex items-center justify-center text-resend-mute hover:text-resend-ink hover:bg-resend-surface-card transition-colors shadow-sm"
              title="Collapse sidebar"
            >
              <PanelLeftClose size={12} />
            </button>
          ) : (
            <button
              onClick={toggleSidebar}
              className="ml-4 mt-6 z-30 w-8 h-8 rounded-resend-md bg-resend-surface-elevated border border-resend-hairline-strong flex items-center justify-center text-resend-mute hover:text-resend-ink hover:bg-resend-surface-card transition-colors shadow-sm"
              title="Expand sidebar"
            >
              <Menu size={16} />
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
              className="absolute z-20 w-[260px] h-full bg-resend-canvas border-r border-resend-hairline flex flex-col overflow-y-auto lg:hidden"
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
        <main id="main-scroll-container" className="flex-1 overflow-y-auto bg-resend-canvas relative z-10 p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
