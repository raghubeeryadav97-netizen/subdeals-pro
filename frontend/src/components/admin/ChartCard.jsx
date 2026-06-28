import { motion } from 'framer-motion';
import { ResponsiveContainer } from 'recharts';

export default function ChartCard({ title, subtitle, children, className = '', index = 0 }) {
  return (
    <motion.div
      className={`glass-card ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
    >
      <div className="mb-4">
        <h3 className="font-display font-semibold text-lg">{title}</h3>
        {subtitle && <p className="text-gray-400 text-sm">{subtitle}</p>}
      </div>
      <div className="h-64 md:h-72">
        <ResponsiveContainer width="100%" height="100%">
          {children}
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}