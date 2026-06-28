import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SEO from '../components/common/SEO';
import HeroSection from '../components/home/HeroSection';
import StatsSection from '../components/home/StatsSection';
import HowItWorks from '../components/home/HowItWorks';
import FAQSection from '../components/home/FAQSection';
import NewsletterSection from '../components/home/NewsletterSection';
import PlanGrid from '../components/plans/PlanGrid';
import PurchaseModal from '../components/plans/PurchaseModal';
import ReviewCard from '../components/reviews/ReviewCard';
import { useTranslation } from '../hooks/useTranslation';
import { useEffect } from 'react';
import { fetchPublicReviews } from '../api/reviews';

export default function Home() {
  const { t } = useTranslation();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchPublicReviews(4).then(({ reviews: nextReviews }) => setReviews(nextReviews || []));
  }, []);

  const handleBuy = (plan) => {
    setSelectedPlan(plan);
    setModalOpen(true);
  };

  return (
    <>
      <SEO />
      <HeroSection />

      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.h2 className="section-title text-center mb-12" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            {t('featured')}
          </motion.h2>
          <PlanGrid featured onBuy={handleBuy} showFilters={false} />
        </div>
      </section>

      <StatsSection />
      <HowItWorks />

      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.h2 className="section-title text-center mb-12" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            {t('trending')}
          </motion.h2>
          <PlanGrid trending onBuy={handleBuy} showFilters={false} />
        </div>
      </section>

      {reviews.length > 0 && (
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="section-title text-center mb-12">{t('reviews')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {reviews.map((r, i) => <ReviewCard key={r._id} review={r} index={i} />)}
            </div>
            <div className="text-center mt-8">
              <Link to="/reviews" className="btn-outline">View All Reviews</Link>
            </div>
          </div>
        </section>
      )}

      <FAQSection limit={4} />
      <NewsletterSection />

      <PurchaseModal
        plan={selectedPlan}
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setSelectedPlan(null); }}
      />
    </>
  );
}