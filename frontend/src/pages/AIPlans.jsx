import { useState } from 'react';
import { motion } from 'framer-motion';
import SEO from '../components/common/SEO';
import PlanGrid from '../components/plans/PlanGrid';
import PurchaseModal from '../components/plans/PurchaseModal';
import { useTranslation } from '../hooks/useTranslation';

export default function AIPlans() {
  const { t } = useTranslation();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <SEO title={t('ai')} description="Get ChatGPT Plus, Claude Pro, Midjourney and other AI subscriptions at the best prices in India." />
      <div className="container mx-auto px-4 py-12">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="section-title neon-text mb-3">{t('ai')}</h1>
          <p className="text-gray-400 max-w-xl mx-auto">Supercharge your productivity with premium AI tools and subscriptions.</p>
        </motion.div>
        <PlanGrid type="ai" onBuy={(p) => { setSelectedPlan(p); setModalOpen(true); }} />
      </div>
      <PurchaseModal plan={selectedPlan} isOpen={modalOpen} onClose={() => { setModalOpen(false); setSelectedPlan(null); }} />
    </>
  );
}