import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiZap } from 'react-icons/fi';
import { useTranslation } from '../../hooks/useTranslation';

export default function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden py-20 md:py-32">
      <div className="absolute inset-0 bg-hero-gradient opacity-80" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-[100px] animate-float" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/15 rounded-full blur-[120px] animate-float" style={{ animationDelay: '2s' }} />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm mb-6"
          >
            <FiZap className="text-accent" />
            <span className="text-gray-300">India&apos;s #1 Subscription Deals Platform</span>
          </motion.div>

          <motion.h1
            className="text-4xl md:text-6xl lg:text-7xl font-display font-bold leading-tight mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <span className="neon-text">{t('heroTitle')}</span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {t('heroSubtitle')}
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <Link to="/entertainment" className="btn-primary inline-flex items-center justify-center gap-2 text-lg">
              {t('getStarted')} <FiArrowRight />
            </Link>
            <Link to="/pricing" className="btn-outline inline-flex items-center justify-center gap-2 text-lg">
              {t('viewPlans')}
            </Link>
          </motion.div>

          <motion.div
            className="flex flex-wrap justify-center gap-8 mt-16 text-sm text-gray-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {['Netflix', 'Spotify', 'ChatGPT Plus', 'YouTube Premium', 'Disney+'].map((brand, i) => (
              <motion.span
                key={brand}
                className="px-4 py-2 glass rounded-lg"
                whileHover={{ scale: 1.05, borderColor: 'rgba(124,58,237,0.5)' }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + i * 0.1 }}
              >
                {brand}
              </motion.span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}