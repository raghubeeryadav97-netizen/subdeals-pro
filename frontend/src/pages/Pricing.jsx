import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCheck } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import SEO from '../components/common/SEO';
import { fetchPlans } from '../api/plans';
import { useTranslation } from '../hooks/useTranslation';

export default function Pricing() {
  const { t } = useTranslation();
  const currency = useSelector((state) => state.settings.data?.currency_symbol) || '₹';
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    fetchPlans({ limit: 50 }).then(setPlans);
  }, []);

  const sortByPriority = (a, b) => {
    const score = (p) => (p.isFeatured ? 4 : 0) + (p.isPopular ? 2 : 0) + (p.isTrending ? 1 : 0);
    return score(b) - score(a) || a.name.localeCompare(b.name);
  };

  const entertainment = plans.filter((p) => p.type === 'entertainment').sort(sortByPriority).slice(0, 6);
  const ai = plans.filter((p) => p.type === 'ai').sort(sortByPriority).slice(0, 6);

  const PlanRow = ({ plan }) => {
    const price = Math.min(...(plan.durationPricing?.map((d) => d.offerPrice) || [0]));
    return (
      <div className="flex items-center justify-between py-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          {plan.logo && <img src={plan.logo} alt="" className="w-8 h-8 rounded-lg" />}
          <Link to={`/plans/${plan.slug}`} className="font-medium hover:text-primary-light">{plan.name}</Link>
        </div>
        <span className="font-bold neon-text">{currency}{price}<span className="text-gray-400 text-sm font-normal">/mo</span></span>
      </div>
    );
  };

  return (
    <>
      <SEO title={t('pricing')} description="Compare subscription plan prices. Best deals on entertainment and AI plans." />
      <div className="container mx-auto px-4 py-12">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="section-title neon-text mb-3">{t('pricing')}</h1>
          <p className="text-gray-400">Transparent pricing with no hidden fees. All plans include instant delivery.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <motion.div className="glass-card" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="font-display font-bold text-xl mb-6">{t('entertainment')}</h2>
            {entertainment.map((p) => <PlanRow key={p._id} plan={p} />)}
            <Link to="/entertainment" className="btn-outline w-full mt-6 text-center block">View All</Link>
          </motion.div>

          <motion.div className="glass-card" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <h2 className="font-display font-bold text-xl mb-6">{t('ai')}</h2>
            {ai.map((p) => <PlanRow key={p._id} plan={p} />)}
            <Link to="/ai-plans" className="btn-outline w-full mt-6 text-center block">View All</Link>
          </motion.div>
        </div>

        <motion.div className="glass-card max-w-3xl mx-auto mt-12 text-center" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h3 className="font-display font-bold text-lg mb-4">Why Choose SubDeals Pro?</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-300">
            {['Instant Delivery', '100% Genuine', '24/7 Support'].map((item) => (
              <div key={item} className="flex items-center justify-center gap-2">
                <FiCheck className="text-green-400" /> {item}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </>
  );
}