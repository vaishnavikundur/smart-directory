import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Zap, Search } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-resend-canvas">
      {/* Background Gradients - Atmospheric Glow */}
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-resend-accent-blue-glow via-resend-canvas to-resend-canvas blur-[80px] opacity-60 -z-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <h1 className="text-[56px] lg:text-[96px] font-normal tracking-resend-tight leading-[1.0] font-display mb-8">
            <span className="block text-resend-ink">Smart, Fast & Secure</span>
            <span className="block mt-2 text-resend-charcoal">
              Contact Management
            </span>
          </h1>
          <p className="text-[18px] lg:text-[20px] text-resend-body mb-10 leading-relaxed font-sans max-w-2xl mx-auto">
            Experience the next generation of personal CRM. Organize your connections with intelligent search, robust security, and seamless sync across all your devices.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="button-primary w-full sm:w-auto px-6 h-[40px] text-[14px]"
            >
              Get Started Free
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
            <Link
              to="/login"
              className="button-ghost w-full sm:w-auto px-6 h-[40px] text-[14px]"
            >
              Log In
            </Link>
          </div>
        </motion.div>

        {/* Abstract UI Mockup - Resend Code Window Style */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-24 relative max-w-5xl mx-auto"
        >
          <div className="relative rounded-resend-lg bg-resend-surface-deep border border-resend-hairline-strong p-4 overflow-hidden shadow-2xl">
            
            {/* Mock Toolbar Traffic Lights */}
            <div className="flex items-center space-x-2 mb-6 px-2">
              <div className="w-[8px] h-[8px] rounded-full bg-resend-accent-red" />
              <div className="w-[8px] h-[8px] rounded-full bg-resend-accent-yellow" />
              <div className="w-[8px] h-[8px] rounded-full bg-resend-accent-green" />
            </div>

            {/* Mock App Interface */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[300px]">
              {/* Sidebar */}
              <div className="hidden md:block col-span-1 border-r border-resend-hairline pr-4 space-y-4">
                <div className="h-8 bg-resend-surface-card border border-resend-hairline-strong rounded-resend-sm w-full" />
                <div className="h-8 bg-resend-surface-card border border-resend-hairline-strong rounded-resend-sm w-full flex items-center px-3 gap-3">
                  <Shield className="w-4 h-4 text-resend-mute" />
                  <div className="h-2 w-16 bg-resend-charcoal rounded" />
                </div>
                <div className="h-8 bg-resend-surface-card border border-resend-hairline-strong rounded-resend-sm w-full flex items-center px-3 gap-3">
                  <Zap className="w-4 h-4 text-resend-link" />
                  <div className="h-2 w-20 bg-resend-charcoal rounded" />
                </div>
              </div>
              {/* Main Content */}
              <div className="col-span-1 md:col-span-3 space-y-4">
                <div className="h-10 bg-resend-surface-card border border-resend-hairline-strong rounded-resend-md w-full flex items-center px-4 gap-3">
                  <Search className="w-4 h-4 text-resend-mute" />
                  <div className="h-2 w-32 bg-resend-charcoal rounded" />
                </div>
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-14 bg-resend-surface-card border border-resend-hairline-strong rounded-resend-md w-full flex items-center justify-between px-4">
                      <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-resend-surface-elevated border border-resend-hairline-strong flex items-center justify-center text-[10px] text-resend-mute font-mono">U</div>
                        <div className="space-y-2">
                          <div className="h-2.5 w-24 bg-resend-ink rounded" />
                          <div className="h-2 w-32 bg-resend-mute rounded" />
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
