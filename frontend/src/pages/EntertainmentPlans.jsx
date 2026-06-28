import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../components/common/SEO';
import PlanGrid from '../components/plans/PlanGrid';
import PurchaseModal from '../components/plans/PurchaseModal';
import { useTranslation } from '../hooks/useTranslation';

export default function EntertainmentPlans() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const initialSearch = searchParams.get('search') || '';

  return (
    <>
      <SEO title={t('entertainment')} description="Browse premium entertainment subscriptions - Netflix, Spotify, Disney+ and more at best prices." />
      <div className="container mx-auto px-4 py-12">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="section-title neon-text mb-3">{t('entertainment')}</h1>
          <p className="text-gray-400 max-w-xl mx-auto">Stream, listen, and watch with premium entertainment subscriptions at unbeatable prices.</p>
        </motion.div>
        <PlanGrid type="entertainment" onBuy={(p) => { setSelectedPlan(p); setModalOpen(true); }} initialSearch={initialSearch} />
      </div>
      <PurchaseModal plan={selectedPlan} isOpen={modalOpen} onClose={() => { setModalOpen(false); setSelectedPlan(null); }} />
    </>
  );
}