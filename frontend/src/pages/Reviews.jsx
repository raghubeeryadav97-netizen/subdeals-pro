import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import SEO from '../components/common/SEO';
import ReviewCard from '../components/reviews/ReviewCard';
import ReviewForm from '../components/reviews/ReviewForm';
import { PlanCardSkeleton } from '../components/common/Skeleton';
import api from '../api/axios';
import { useTranslation } from '../hooks/useTranslation';

export default function Reviews() {
  const { t } = useTranslation();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = () => {
    setLoading(true);
    api.get('/reviews', { params: { status: 'approved' } })
      .then(({ data }) => setReviews(data.reviews || []))
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchReviews(); }, []);

  return (
    <>
      <SEO title={t('reviews')} description="Read customer reviews and share your experience with SubDeals Pro." />
      <div className="container mx-auto px-4 py-12">
        <motion.h1 className="section-title text-center mb-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {t('reviews')}
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="lg:col-span-2 space-y-4">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => <PlanCardSkeleton key={i} />)
            ) : reviews.length === 0 ? (
              <p className="text-gray-400 text-center py-12">No reviews yet. Be the first!</p>
            ) : (
              reviews.map((r, i) => <ReviewCard key={r._id} review={r} index={i} />)
            )}
          </div>
          <div>
            <ReviewForm onSuccess={fetchReviews} />
          </div>
        </div>
      </div>
    </>
  );
}