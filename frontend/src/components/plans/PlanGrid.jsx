import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { fetchPlans as loadPlans } from '../../api/plans';
import PlanCard from './PlanCard';
import SearchBar from './SearchBar';
import { PlanCardSkeleton } from '../common/Skeleton';
import { useTranslation } from '../../hooks/useTranslation';

export default function PlanGrid({
  type,
  categoryId,
  featured,
  popular,
  trending,
  onBuy,
  showFilters = true,
  initialSearch = '',
}) {
  const { t } = useTranslation();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(initialSearch);
  const [duration, setDuration] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const fetchPlans = useCallback(async () => {
    setLoading(true);
    try {
      const params = { limit: 50 };
      if (type) params.type = type;
      if (categoryId) params.category = categoryId;
      if (featured) params.featured = 'true';
      if (popular) params.popular = 'true';
      if (trending) params.trending = 'true';
      if (search) params.search = search;
      if (duration) params.duration = duration;

      let result = await loadPlans(params);

      if (sortBy === 'price-low') {
        result = [...result].sort((a, b) => {
          const pa = Math.min(...(a.durationPricing?.map((d) => d.offerPrice) || [0]));
          const pb = Math.min(...(b.durationPricing?.map((d) => d.offerPrice) || [0]));
          return pa - pb;
        });
      } else if (sortBy === 'price-high') {
        result = [...result].sort((a, b) => {
          const pa = Math.min(...(a.durationPricing?.map((d) => d.offerPrice) || [0]));
          const pb = Math.min(...(b.durationPricing?.map((d) => d.offerPrice) || [0]));
          return pb - pa;
        });
      } else if (sortBy === 'rating') {
        result = [...result].sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
      }

      setPlans(result);
    } catch {
      setPlans([]);
    } finally {
      setLoading(false);
    }
  }, [type, categoryId, featured, popular, trending, search, duration, sortBy]);

  useEffect(() => { fetchPlans(); }, [fetchPlans]);

  const handleSearch = useCallback((q) => setSearch(q), []);

  return (
    <div>
      {showFilters && (
        <motion.div
          className="flex flex-col md:flex-row gap-4 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <SearchBar onSearch={handleSearch} className="flex-1" />
          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="input-field w-full md:w-40"
          >
            <option value="">All Durations</option>
            <option value="1">1 Month</option>
            <option value="3">3 Months</option>
            <option value="6">6 Months</option>
            <option value="12">12 Months</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input-field w-full md:w-44"
          >
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </motion.div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => <PlanCardSkeleton key={i} />)}
        </div>
      ) : plans.length === 0 ? (
        <motion.div className="text-center py-20 glass-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <p className="text-gray-400 text-lg">{t('noResults')}</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {plans.map((plan, i) => (
            <PlanCard key={plan._id} plan={plan} onBuy={onBuy} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}