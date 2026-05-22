import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Zap, Search } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-resend-canvas">
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
      </div>
    </section>
  );
}
