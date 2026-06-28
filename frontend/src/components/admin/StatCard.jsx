import { motion } from 'framer-motion';

export default function StatCard({ title, value, subtitle, icon: Icon, color = 'primary', index = 0 }) {
  const colorMap = {
    primary: 'from-primary/20 to-primary/5 text-primary-light',
    accent: 'from-accent/20 to-accent/5 text-accent-light',
    green: 'from-green-500/20 to-green-500/5 text-green-400',
    yellow: 'from-yellow-500/20 to-yellow-500/5 text-yellow-400',
    red: 'from-red-500/20 to-red-500/5 text-red-400',
  };

  return (
    <motion.div
      className="glass-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -3 }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-400 text-sm mb-1">{title}</p>
          <p className="text-2xl md:text-3xl font-bold">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        {Icon && (
          <div className={`p-3 rounded-xl bg-gradient-to-br ${colorMap[color]}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
    </motion.div>
  );
}