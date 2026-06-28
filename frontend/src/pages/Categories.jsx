import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../components/common/SEO';
import { PlanCardSkeleton } from '../components/common/Skeleton';
import { fetchPublicCategories } from '../api/plans';
import { useTranslation } from '../hooks/useTranslation';

export default function Categories() {
  const { t } = useTranslation();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPublicCategories()
      .then(({ categories: nextCategories }) => setCategories(nextCategories || []))
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <SEO title="Categories" description="Browse subscription plans by category." />
      <div className="container mx-auto px-4 py-12">
        <motion.h1 className="section-title text-center mb-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {t('plans')} <span className="neon-text">Categories</span>
        </motion.h1>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <PlanCardSkeleton key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, i) => (
              <motion.div key={cat._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                <Link to={`/categories/${cat.slug}`} className="glass-card block group hover:border-primary/40">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-2xl">
                      {cat.icon || cat.name?.[0]}
                    </div>
                    <div>
                      <h3 className="font-display font-semibold text-lg group-hover:neon-text transition-all">{cat.name}</h3>
                      <p className="text-gray-400 text-sm capitalize">{cat.type} • {cat.planCount || 0} plans</p>
                    </div>
                  </div>
                  {cat.description && <p className="text-gray-400 text-sm mt-3">{cat.description}</p>}
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}