import { motion } from 'framer-motion';
import { Users, Activity, Lock } from 'lucide-react';

export function AboutStatsSection() {
  const stats = [
    {
      value: '99.9%',
      label: 'Uptime Reliability',
      icon: <Activity className="w-5 h-5 text-blue-400" />,
    },
    {
      value: '256-bit',
      label: 'AES Encryption',
      icon: <Lock className="w-5 h-5 text-purple-400" />,
    },
    {
      value: '10k+',
      label: 'Active Users',
      icon: <Users className="w-5 h-5 text-green-400" />,
    },
  ];

  return (
    <section id="about" className="py-24 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-[100px] -z-10" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Built for professionals who value their <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">time and privacy</span>.
            </h2>
            <div className="space-y-6 text-[var(--text-secondary)] text-lg">
              <p>
                In today's fast-paced world, your network is your net worth. But managing hundreds of contacts across different platforms can quickly become overwhelming.
              </p>
              <p>
                ContactFlow was built from the ground up to solve this exact problem. We've combined enterprise-grade security with an incredibly intuitive, distraction-free interface so you can focus on building relationships, not managing data.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center space-x-2">
                    {stat.icon}
                    <span className="text-3xl font-bold text-white">{stat.value}</span>
                  </div>
                  <p className="text-sm text-[var(--text-secondary)]">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 rounded-3xl transform rotate-3 scale-105 -z-10 blur-xl" />
            <div className="bg-[#13161c] border border-white/10 rounded-3xl p-8 shadow-2xl">
              <div className="space-y-6">
                <div className="flex items-center space-x-4 border-b border-white/5 pb-6">
                  <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <span className="text-blue-400 font-bold text-xl">1</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white">Create your account</h4>
                    <p className="text-sm text-[var(--text-secondary)]">Sign up in seconds. No credit card required.</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 border-b border-white/5 pb-6">
                  <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <span className="text-purple-400 font-bold text-xl">2</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white">Import your network</h4>
                    <p className="text-sm text-[var(--text-secondary)]">Easily add contacts with our streamlined form.</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                    <span className="text-green-400 font-bold text-xl">3</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white">Stay organized</h4>
                    <p className="text-sm text-[var(--text-secondary)]">Find anyone instantly with blazing-fast search.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
