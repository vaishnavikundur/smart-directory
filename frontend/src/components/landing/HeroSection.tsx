import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Zap, Search } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-apple-primary/5 blur-[100px] -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <h1 className="text-[40px] leading-tight lg:text-[64px] font-semibold tracking-apple-tight mb-8">
            <span className="block text-[var(--text-primary)]">Smart, Fast & Secure</span>
            <span className="block mt-2 text-[var(--link-color)]">
              Contact Management
            </span>
          </h1>
          <p className="text-[17px] lg:text-[21px] text-[var(--text-secondary)] mb-10 leading-relaxed tracking-apple-loose">
            Experience the next generation of personal CRM. Organize your connections with intelligent search, robust security, and seamless sync across all your devices.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="btn-primary w-full sm:w-auto flex items-center justify-center group !py-3 !px-6 !text-[17px]"
            >
              Get Started Free
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/login"
              className="btn-secondary w-full sm:w-auto flex items-center justify-center !py-3 !px-6 !text-[17px]"
            >
              Log In
            </Link>
          </div>
        </motion.div>

        {/* Abstract UI Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-20 relative max-w-5xl mx-auto"
        >
          <div className="relative rounded-xl bg-[var(--bg-page)] shadow-apple-product border border-[var(--border-hard)] p-2 sm:p-4 overflow-hidden">
            
            {/* Mock Toolbar */}
            <div className="flex items-center space-x-2 mb-4 px-2">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
            </div>

            {/* Mock App Interface */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[300px]">
              {/* Sidebar */}
              <div className="hidden md:block col-span-1 border-r border-[var(--border-hard)] pr-4 space-y-4">
                <div className="h-8 bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-apple-sm w-full" />
                <div className="h-8 bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-apple-sm w-full flex items-center px-3 gap-3">
                  <Shield className="w-4 h-4 text-[var(--text-secondary)]" />
                  <div className="h-2 w-16 bg-[var(--border-hard)] rounded" />
                </div>
                <div className="h-8 bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-apple-sm w-full flex items-center px-3 gap-3">
                  <Zap className="w-4 h-4 text-[var(--link-color)]" />
                  <div className="h-2 w-20 bg-[var(--border-hard)] rounded" />
                </div>
              </div>
              {/* Main Content */}
              <div className="col-span-1 md:col-span-3 space-y-4">
                <div className="h-10 bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-apple-md w-full flex items-center px-4 gap-3">
                  <Search className="w-4 h-4 text-[var(--text-secondary)]" />
                  <div className="h-2 w-32 bg-[var(--border-hard)] rounded" />
                </div>
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-14 bg-[var(--bg-card)] border border-[var(--border-soft)] rounded-apple-md w-full flex items-center justify-between px-4">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-[var(--border-hard)] flex items-center justify-center text-[10px] text-[var(--text-secondary)]">U</div>
                        <div className="space-y-2">
                          <div className="h-2.5 w-24 bg-[var(--text-primary)] opacity-50 rounded" />
                          <div className="h-2 w-32 bg-[var(--text-secondary)] opacity-30 rounded" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
