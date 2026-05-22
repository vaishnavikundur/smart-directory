import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Zap, Search } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-gradient-to-b from-blue-500/20 to-transparent blur-[100px] -z-10" />
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-8">
            <span className="block text-white">Smart, Fast & Secure</span>
            <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 animate-gradient-x">
              Contact Management
            </span>
          </h1>
          <p className="text-lg lg:text-xl text-[var(--text-secondary)] mb-10 leading-relaxed">
            Experience the next generation of personal CRM. Organize your connections with intelligent search, robust security, and seamless sync across all your devices.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold text-lg hover:from-blue-600 hover:to-purple-600 transition-all transform hover:scale-105 shadow-xl shadow-blue-500/25 flex items-center justify-center group"
            >
              Get Started Free
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/5 hover:bg-white/10 text-white font-semibold text-lg backdrop-blur-sm border border-white/10 transition-all"
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
          <div className="relative rounded-2xl bg-[#13161c]/80 backdrop-blur-xl border border-white/10 shadow-2xl p-2 sm:p-4 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 opacity-50" />
            
            {/* Mock Toolbar */}
            <div className="flex items-center space-x-2 mb-4 px-2">
              <div className="w-3 h-3 rounded-full bg-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
              <div className="w-3 h-3 rounded-full bg-green-500/50" />
            </div>

            {/* Mock App Interface */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="hidden md:block col-span-1 border-r border-white/5 pr-4 space-y-4">
                <div className="h-8 bg-white/5 rounded-lg w-full" />
                <div className="h-10 bg-white/5 rounded-lg w-full flex items-center px-3 gap-3">
                  <Shield className="w-4 h-4 text-purple-400" />
                  <div className="h-2 w-20 bg-white/10 rounded" />
                </div>
                <div className="h-10 bg-white/5 rounded-lg w-full flex items-center px-3 gap-3">
                  <Zap className="w-4 h-4 text-blue-400" />
                  <div className="h-2 w-24 bg-white/10 rounded" />
                </div>
              </div>
              <div className="col-span-1 md:col-span-2 space-y-4">
                <div className="h-12 bg-white/5 rounded-xl w-full flex items-center px-4 gap-3">
                  <Search className="w-5 h-5 text-gray-500" />
                  <div className="h-3 w-48 bg-white/10 rounded" />
                </div>
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-16 bg-white/5 rounded-xl w-full flex items-center justify-between px-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/50 to-purple-500/50" />
                        <div className="space-y-2">
                          <div className="h-3 w-32 bg-white/20 rounded" />
                          <div className="h-2 w-24 bg-white/10 rounded" />
                        </div>
                      </div>
                      <div className="hidden sm:block h-2 w-16 bg-white/10 rounded" />
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
