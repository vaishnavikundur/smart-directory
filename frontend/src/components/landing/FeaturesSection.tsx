import { motion } from 'framer-motion';
import { Search, FolderTree, ShieldCheck, Zap, CopyX, Smartphone } from 'lucide-react';

export function FeaturesSection() {
  const features = [
    {
      icon: <Search className="w-6 h-6 text-blue-400" />,
      title: 'Fast Contact Search',
      description: 'Instantly find anyone in your network with our blazing-fast, intelligent search indexing system.',
    },
    {
      icon: <FolderTree className="w-6 h-6 text-purple-400" />,
      title: 'Smart Organization',
      description: 'Group, tag, and organize your contacts automatically. Keep your professional and personal networks distinct.',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-green-400" />,
      title: 'Secure Authentication',
      description: 'Enterprise-grade security with JWT sessions, encrypted data transmission, and strict privacy controls.',
    },
    {
      icon: <Zap className="w-6 h-6 text-yellow-400" />,
      title: 'Real-time Updates',
      description: 'Changes sync instantly across all your devices without needing to manually refresh your browser.',
    },
    {
      icon: <CopyX className="w-6 h-6 text-red-400" />,
      title: 'Duplicate Prevention',
      description: 'Our smart algorithms automatically detect and prevent you from adding the same contact twice.',
    },
    {
      icon: <Smartphone className="w-6 h-6 text-pink-400" />,
      title: 'Responsive Dashboard',
      description: 'A beautiful, App-like experience that works flawlessly on your desktop, tablet, and smartphone.',
    },
  ];

  return (
    <section id="features" className="py-24 bg-[#0a0c10] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Everything you need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">stay connected</span>
          </h2>
          <p className="text-[var(--text-secondary)] max-w-2xl mx-auto text-lg">
            Powerful features packed into an incredibly simple and elegant interface. Built for modern professionals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white/[0.02] border border-white/5 p-8 rounded-2xl hover:bg-white/[0.04] transition-colors group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative z-10">
                <div className="bg-white/5 w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                <p className="text-[var(--text-secondary)] leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
