import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiShoppingBag, FiPackage, FiHeart } from 'react-icons/fi';
import AnimatedCounter from '../common/AnimatedCounter';
import { useTranslation } from '../../hooks/useTranslation';
import api from '../../api/axios';

const defaultStats = [
  { key: 'customers', value: 5000, icon: FiUsers, suffix: '+' },
  { key: 'orders', value: 12000, icon: FiShoppingBag, suffix: '+' },
  { key: 'plans_count', value: 50, icon: FiPackage, suffix: '+' },
  { key: 'satisfaction', value: 99, icon: FiHeart, suffix: '%' },
];

export default function StatsSection() {
  const { t } = useTranslation();
  const [stats, setStats] = useState(defaultStats);

  useEffect(() => {
    api.get('/dashboard/stats').then(({ data }) => {
      if (data.stats) {
        setStats([
          { key: 'customers', value: data.stats.totalCustomers || 5000, icon: FiUsers, suffix: '+' },
          { key: 'orders', value: data.stats.totalOrders || 12000, icon: FiShoppingBag, suffix: '+' },
          { key: 'plans_count', value: data.stats.totalPlans || 50, icon: FiPackage, suffix: '+' },
          { key: 'satisfaction', value: 99, icon: FiHeart, suffix: '%' },
        ]);
      }
    }).catch(() => {});
  }, []);

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.h2
          className="section-title text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {t('statistics')}
        </motion.h2>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.key}
              className="glass-card text-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="inline-flex p-3 rounded-xl bg-primary/10 mb-4">
                <stat.icon className="w-6 h-6 text-primary-light" />
              </div>
              <div className="text-3xl md:text-4xl font-bold neon-text mb-2">
                <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-gray-400 text-sm">{t(stat.key)}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}