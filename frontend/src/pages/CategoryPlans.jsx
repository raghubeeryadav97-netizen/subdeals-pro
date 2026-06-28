import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../components/common/SEO';
import PlanGrid from '../components/plans/PlanGrid';
import PurchaseModal from '../components/plans/PurchaseModal';
import api from '../api/axios';

export default function CategoryPlans() {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchCategoryBySlug(slug)
      .then(setCategory)
      .catch(() => setCategory(null));
  }, [slug]);

  return (
    <>
      <SEO title={category?.name || 'Category'} description={category?.description} />
      <div className="container mx-auto px-4 py-12">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="section-title neon-text mb-3">{category?.name || 'Loading...'}</h1>
          {category?.description && <p className="text-gray-400">{category.description}</p>}
        </motion.div>
        {category && (
          <PlanGrid
            type={category.type}
            onBuy={(p) => { setSelectedPlan(p); setModalOpen(true); }}
          />
        )}
      </div>
      <PurchaseModal plan={selectedPlan} isOpen={modalOpen} onClose={() => { setModalOpen(false); setSelectedPlan(null); }} />
    </>
  );
}