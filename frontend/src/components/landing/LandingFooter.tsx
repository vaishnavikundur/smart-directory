import { Link } from 'react-router-dom';
import { Users, Github, Linkedin, Globe } from 'lucide-react';

export function LandingFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          {/* Brand & Description */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-6 group">
              <Users size={18} className="text-resend-ink group-hover:text-resend-mute transition-colors" />
              <span className="text-[16px] font-semibold tracking-resend-tight text-resend-ink">
                SMART DIRECTORY
              </span>
            </Link>
            <p className="text-resend-charcoal text-[14px] max-w-sm leading-relaxed">
              A modern, fast, and secure contact management system designed for professionals. Keep your network organized and your data private.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-resend-ink font-medium text-[14px] mb-6">Product</h4>
            <ul className="space-y-4 text-[14px] text-resend-charcoal">
              <li>
                <a href="#features" className="hover:text-resend-ink transition-colors">Features</a>
              </li>
              <li>
                <a href="#about" className="hover:text-resend-ink transition-colors">About Us</a>
              </li>
              <li>
                <Link to="/login" className="hover:text-resend-ink transition-colors">Log In</Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-resend-ink transition-colors">Get Started</Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-resend-ink font-medium text-[14px] mb-6">Connect</h4>
            <div className="flex space-x-4">
              <a 
                href="https://github.com/pramodhadapad" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-resend-full bg-resend-surface-card border border-resend-hairline flex items-center justify-center hover:bg-resend-surface-elevated hover:text-resend-ink hover:border-resend-hairline-strong text-resend-charcoal transition-all shadow-sm"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a 
                href="https://www.linkedin.com/in/pramod-hadapad-287627224" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-resend-full bg-resend-surface-card border border-resend-hairline flex items-center justify-center hover:bg-resend-surface-elevated hover:text-resend-ink hover:border-resend-hairline-strong text-resend-charcoal transition-all shadow-sm"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a 
                href="https://pramod-hadapad.vercel.app/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-resend-full bg-resend-surface-card border border-resend-hairline flex items-center justify-center hover:bg-resend-surface-elevated hover:text-resend-ink hover:border-resend-hairline-strong text-resend-charcoal transition-all shadow-sm"
                aria-label="Portfolio"
              >
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 border-t border-resend-divider-soft">
          <p className="text-resend-ash text-[13px] font-mono">
            &copy; {currentYear} SMART DIRECTORY. All rights reserved.
          </p>
          <div className="flex space-x-6 text-[13px] text-resend-ash font-mono">
            <span className="hover:text-resend-ink cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-resend-ink cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
