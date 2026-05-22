import { motion } from 'framer-motion';
import { Search, FolderTree, ShieldCheck, Zap, CopyX, Smartphone } from 'lucide-react';

export function FeaturesSection() {
  const features = [
    {
      icon: <Search className="w-5 h-5 text-blue-500" />,
      title: 'Fast Contact Search',
      description: 'Instantly find anyone in your network with our blazing-fast, intelligent search indexing system.',
    },
    {
      icon: <FolderTree className="w-5 h-5 text-purple-500" />,
      title: 'Smart Organization',
      description: 'Group, tag, and organize your contacts automatically. Keep your professional and personal networks distinct.',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-green-500" />,
      title: 'Secure Authentication',
      description: 'Enterprise-grade security with JWT sessions, encrypted data transmission, and strict privacy controls.',
    },
    {
      icon: <Zap className="w-5 h-5 text-yellow-500" />,
      title: 'Real-time Updates',
      description: 'Changes sync instantly across all your devices without needing to manually refresh your browser.',
    },
    {
      icon: <CopyX className="w-5 h-5 text-red-500" />,
      title: 'Duplicate Prevention',
      description: 'Our smart algorithms automatically detect and prevent you from adding the same contact twice.',
    },
    {
      icon: <Smartphone className="w-5 h-5 text-pink-500" />,
      title: 'Responsive Dashboard',
      description: 'A beautiful, App-like experience that works flawlessly on your desktop, tablet, and smartphone.',
    },
  ];

  return (
    <section id="features" className="py-24 bg-[var(--bg-page)] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-[32px] md:text-[40px] font-semibold tracking-apple-tight mb-4">
            Everything you need to <span className="text-[var(--link-color)]">stay connected</span>
          </h2>
          <p className="text-[var(--text-secondary)] max-w-2xl mx-auto text-[17px] tracking-apple-loose">
            Powerful features packed into an incredibly simple and elegant interface. Built for modern professionals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-[var(--bg-card)] border border-[var(--border-hard)] p-6 rounded-apple-lg hover:border-[var(--text-secondary)] transition-colors group relative overflow-hidden shadow-sm"
            >
              <div className="relative z-10">
                <div className="bg-[var(--bg-page)] border border-[var(--border-soft)] w-10 h-10 rounded-apple-md flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-[17px] font-semibold tracking-apple-tight mb-2 text-[var(--text-primary)]">{feature.title}</h3>
                <p className="text-[var(--text-secondary)] text-[14px] leading-relaxed">
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
