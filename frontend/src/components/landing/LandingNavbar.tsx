import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Menu, X, Users } from 'lucide-react';

export function LandingNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'About', href: '#about' },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 nav-bar bg-resend-canvas border-b border-resend-hairline">
      <div className="max-w-7xl mx-auto w-full">
        <div className="flex justify-between items-center h-full">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Users size={18} className="text-resend-ink" />
              <span className="text-[14px] font-semibold tracking-resend-tight text-resend-ink">
                SMART DIRECTORY
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-resend-mute hover:text-resend-ink transition-colors text-[14px] font-medium font-sans"
              >
                {link.name}
              </a>
            ))}
            
            <div className="flex items-center space-x-3">
              <Link
                to="/login"
                className="text-[14px] font-medium text-resend-mute hover:text-resend-ink transition-colors px-3 font-sans"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="button-primary"
              >
                Get Started
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-resend-mute hover:text-resend-ink p-2"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-resend-surface-card border-b border-resend-hairline absolute top-[64px] left-0 w-full shadow-2xl"
          >
            <div className="px-4 pt-2 pb-6 space-y-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block text-resend-ink text-[14px] font-medium py-3 border-b border-resend-hairline-strong"
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-4 flex flex-col space-y-3">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="button-ghost w-full justify-center"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="button-primary w-full justify-center"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
