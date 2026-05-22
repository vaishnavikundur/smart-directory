import { Link } from 'react-router-dom';
import { Users, Github, Linkedin, Globe } from 'lucide-react';

export function LandingFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[var(--bg-card)] border-t border-[var(--border-hard)] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand & Description */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-6 group">
              <Users size={20} className="text-[var(--text-primary)] group-hover:text-[var(--link-color)] transition-colors" />
              <span className="text-[19px] font-semibold tracking-apple-tight text-[var(--text-primary)]">
                ContactFlow
              </span>
            </Link>
            <p className="text-[var(--text-secondary)] text-[14px] max-w-sm leading-relaxed">
              A modern, fast, and secure contact management system designed for professionals. Keep your network organized and your data private.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[var(--text-primary)] font-semibold tracking-apple-tight mb-6">Product</h4>
            <ul className="space-y-4 text-[14px] text-[var(--text-secondary)]">
              <li>
                <a href="#features" className="hover:text-[var(--text-primary)] transition-colors">Features</a>
              </li>
              <li>
                <a href="#about" className="hover:text-[var(--text-primary)] transition-colors">About Us</a>
              </li>
              <li>
                <Link to="/login" className="hover:text-[var(--text-primary)] transition-colors">Log In</Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-[var(--text-primary)] transition-colors">Get Started</Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-[var(--text-primary)] font-semibold tracking-apple-tight mb-6">Connect</h4>
            <div className="flex space-x-4">
              <a 
                href="https://github.com/pramodhadapad" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-apple-full bg-[var(--bg-page)] border border-[var(--border-hard)] flex items-center justify-center hover:bg-[var(--border-soft)] hover:text-[var(--text-primary)] hover:border-[var(--text-secondary)] text-[var(--text-secondary)] transition-all shadow-sm"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a 
                href="https://www.linkedin.com/in/pramod-hadapad-287627224" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-apple-full bg-[var(--bg-page)] border border-[var(--border-hard)] flex items-center justify-center hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2] text-[var(--text-secondary)] transition-all shadow-sm"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href="https://pramod-hadapad.vercel.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-apple-full bg-[var(--bg-page)] border border-[var(--border-hard)] flex items-center justify-center hover:bg-[var(--link-color)] hover:text-white hover:border-[var(--link-color)] text-[var(--text-secondary)] transition-all shadow-sm"
                aria-label="Portfolio"
              >
                <Globe className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-[var(--border-hard)] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[var(--text-secondary)] text-[12px]">
            &copy; {currentYear} ContactFlow. All rights reserved.
          </p>
          <div className="flex space-x-6 text-[12px] text-[var(--text-secondary)]">
            <span className="hover:text-[var(--text-primary)] cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-[var(--text-primary)] cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
