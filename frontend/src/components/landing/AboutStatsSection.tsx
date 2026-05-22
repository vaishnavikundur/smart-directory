import { motion } from 'framer-motion';
import { Users, Activity, Lock } from 'lucide-react';

export function AboutStatsSection() {
  const stats = [
    {
      value: '99.9%',
      label: 'Uptime Reliability',
      icon: <Activity className="w-5 h-5 text-resend-mute" />,
    },
    {
      value: '256-bit',
      label: 'AES Encryption',
      icon: <Lock className="w-5 h-5 text-resend-mute" />,
    },
    {
      value: '10k+',
      label: 'Active Users',
      icon: <Users className="w-5 h-5 text-resend-mute" />,
    },
  ];

  return (
    <section id="about" className="py-24 relative overflow-hidden bg-resend-canvas border-t border-resend-hairline">
      {/* Background decorations */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-resend-accent-orange-glow via-resend-canvas to-resend-canvas rounded-full blur-[80px] -z-10 opacity-60 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-[32px] md:text-[40px] font-normal tracking-resend-tight mb-6 text-resend-ink font-display">
              Built for professionals who value their <span className="text-resend-charcoal">time and privacy</span>.
            </h2>
            <div className="space-y-6 text-resend-body text-[18px] leading-relaxed">
              <p>
                In today's fast-paced world, your network is your net worth. But managing hundreds of contacts across different platforms can quickly become overwhelming.
              </p>
              <p>
                SMART DIRECTORY was built from the ground up to solve this exact problem. We've combined enterprise-grade security with an incredibly intuitive, distraction-free interface so you can focus on building relationships, not managing data.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-2 sm:grid-cols-3 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center space-x-2">
                    {stat.icon}
                    <span className="text-3xl font-normal text-resend-ink tracking-resend-tight font-display">{stat.value}</span>
                  </div>
                  <p className="text-[14px] text-resend-mute font-mono">{stat.label}</p>
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
            <div className="surface-card p-8 shadow-2xl relative z-10 bg-resend-surface-card">
              <div className="space-y-6">
                <div className="flex items-center space-x-4 border-b border-resend-hairline pb-6">
                  <div className="w-12 h-12 rounded-resend-full bg-resend-surface-elevated border border-resend-hairline-strong flex items-center justify-center shadow-sm">
                    <span className="text-resend-mute font-mono text-[14px]">01</span>
                  </div>
                  <div>
                    <h4 className="text-[16px] font-medium text-resend-ink tracking-resend-tight">Create your account</h4>
                    <p className="text-[14px] text-resend-mute mt-1">Sign up in seconds. No credit card required.</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 border-b border-resend-hairline pb-6">
                  <div className="w-12 h-12 rounded-resend-full bg-resend-surface-elevated border border-resend-hairline-strong flex items-center justify-center shadow-sm">
                    <span className="text-resend-mute font-mono text-[14px]">02</span>
                  </div>
                  <div>
                    <h4 className="text-[16px] font-medium text-resend-ink tracking-resend-tight">Import your network</h4>
                    <p className="text-[14px] text-resend-mute mt-1">Easily add contacts with our streamlined form.</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-resend-full bg-resend-surface-elevated border border-resend-hairline-strong flex items-center justify-center shadow-sm">
                    <span className="text-resend-mute font-mono text-[14px]">03</span>
                  </div>
                  <div>
                    <h4 className="text-[16px] font-medium text-resend-ink tracking-resend-tight">Stay organized</h4>
                    <p className="text-[14px] text-resend-mute mt-1">Find anyone instantly with blazing-fast search.</p>
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
