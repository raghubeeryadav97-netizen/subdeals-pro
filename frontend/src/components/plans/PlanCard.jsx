import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiStar, FiTrendingUp, FiAward } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { useTranslation } from '../../hooks/useTranslation';

const badgeConfig = {
  featured: { label: 'featured', icon: FiAward, color: 'from-primary to-accent' },
  popular: { label: 'popular', icon: FiStar, color: 'from-yellow-500 to-orange-500' },
  trending: { label: 'trending', icon: FiTrendingUp, color: 'from-pink-500 to-purple-500' },
};

export default function PlanCard({ plan, onBuy, index = 0 }) {
  const { t } = useTranslation();
  const currency = useSelector((state) => state.settings.data?.currency_symbol) || '₹';
  const lowestPrice = plan.durationPricing?.reduce((min, d) =>
    d.isAvailable && d.offerPrice < min ? d.offerPrice : min, Infinity);
  const price = lowestPrice === Infinity ? 0 : lowestPrice;
  const badge = plan.isFeatured ? 'featured' : plan.isPopular ? 'popular' : plan.isTrending ? 'trending' : null;
  const BadgeIcon = badge ? badgeConfig[badge].icon : null;

  return (
    <motion.div
      className="glass-card group relative overflow-hidden"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
    >
      <div className="absolute inset-0 bg-card-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {badge && (
        <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${badgeConfig[badge].color} flex items-center gap-1`}>
          <BadgeIcon className="w-3 h-3" />
          {t(badgeConfig[badge].label)}
        </div>
      )}

      <div className="relative z-10 flex flex-col items-center text-center">
        <motion.div
          className="w-20 h-20 rounded-2xl overflow-hidden bg-dark-200 mb-4 flex items-center justify-center"
          whileHover={{ scale: 1.05, rotate: 2 }}
        >
          {plan.logo ? (
            <img src={plan.logo} alt={plan.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-3xl font-display font-bold neon-text">{plan.name?.[0]}</span>
          )}
        </motion.div>

        <h3 className="text-xl font-display font-bold mb-1 group-hover:neon-text transition-all">
          {plan.name}
        </h3>

        {plan.category?.name && (
          <span className="text-xs text-gray-400 mb-3">{plan.category.name}</span>
        )}

        <div className="mb-4">
          <span className="text-3xl font-bold neon-text">{currency}{price}</span>
          <span className="text-gray-400 text-sm ml-1">/mo</span>
        </div>

        {plan.averageRating > 0 && (
          <div className="flex items-center gap-1 text-sm text-yellow-400 mb-4">
            <FiStar className="fill-current" />
            {plan.averageRating.toFixed(1)} ({plan.reviewCount})
          </div>
        )}

        <div className="flex gap-2 w-full mt-auto">
          <Link to={`/plans/${plan.slug}`} className="btn-outline flex-1 text-center text-sm py-2.5">
            Details
          </Link>
          <button
            type="button"
            onClick={() => onBuy?.(plan)}
            className="btn-primary flex-1 text-sm py-2.5"
          >
            {t('buyNow')}
          </button>
        </div>
      </div>
    </motion.div>
  );
}