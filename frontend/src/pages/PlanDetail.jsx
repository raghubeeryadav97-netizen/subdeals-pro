import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiStar, FiCheck, FiClock } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import SEO from '../components/common/SEO';
import PurchaseModal from '../components/plans/PurchaseModal';
import { PageSkeleton } from '../components/common/Skeleton';
import { fetchPlan } from '../api/plans';
import { useTranslation } from '../hooks/useTranslation';

export default function PlanDetail() {
  const { slug } = useParams();
  const { t } = useTranslation();
  const currency = useSelector((state) => state.settings.data?.currency_symbol) || '₹';
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDuration, setSelectedDuration] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchPlan(slug)
      .then((data) => {
        if (!data) { setPlan(null); return; }
        setPlan(data);
        const avail = data.durationPricing?.find((d) => d.isAvailable);
        setSelectedDuration(avail || data.durationPricing?.[0]);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <PageSkeleton />;
  if (!plan) return (
    <div className="container mx-auto px-4 py-20 text-center">
      <h1 className="text-2xl font-bold mb-4">Plan Not Found</h1>
      <Link to="/entertainment" className="btn-primary">Browse Plans</Link>
    </div>
  );

  return (
    <>
      <SEO title={plan.seoTitle || plan.name} description={plan.seoDescription || plan.description} image={plan.logo} />
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="glass-card">
              {plan.banner ? (
                <img src={plan.banner} alt={plan.name} className="w-full h-48 object-cover rounded-xl mb-6" />
              ) : (
                <div className="w-24 h-24 rounded-2xl bg-dark-200 flex items-center justify-center mb-6 mx-auto">
                  {plan.logo ? <img src={plan.logo} alt={plan.name} className="w-full h-full object-cover rounded-2xl" /> : <span className="text-4xl font-bold neon-text">{plan.name[0]}</span>}
                </div>
              )}
              <h1 className="text-3xl font-display font-bold mb-2">{plan.name}</h1>
              {plan.category && <Link to={`/categories/${plan.category.slug}`} className="text-primary-light text-sm">{plan.category.name}</Link>}
              <p className="text-gray-400 mt-4 leading-relaxed">{plan.description}</p>

              {plan.averageRating > 0 && (
                <div className="flex items-center gap-2 mt-4 text-yellow-400">
                  <FiStar className="fill-current" />
                  <span>{plan.averageRating.toFixed(1)}</span>
                  <span className="text-gray-400 text-sm">({plan.reviewCount} reviews)</span>
                </div>
              )}

              <div className="flex items-center gap-2 mt-4 text-sm text-gray-400">
                <FiClock className="text-accent" />
                Delivery: {plan.deliveryTime || 'Instant'}
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="glass-card sticky top-24">
              <h2 className="font-display font-semibold text-xl mb-4">Select {t('duration')}</h2>
              <div className="space-y-3 mb-6">
                {plan.durationPricing?.filter((d) => d.isAvailable).map((d) => (
                  <button
                    key={d.months}
                    type="button"
                    onClick={() => setSelectedDuration(d)}
                    className={`w-full p-4 rounded-xl border text-left flex justify-between items-center transition-all ${
                      selectedDuration?.months === d.months ? 'border-primary bg-primary/10' : 'border-white/10 hover:border-primary/30'
                    }`}
                  >
                    <div>
                      <span className="font-semibold">{d.label}</span>
                      {d.discount > 0 && <span className="ml-2 text-xs text-green-400">{d.discount}% off</span>}
                    </div>
                    <div className="text-right">
                      <span className="text-gray-500 line-through text-sm mr-2">{currency}{d.originalPrice}</span>
                      <span className="text-xl font-bold neon-text">{currency}{d.offerPrice}</span>
                    </div>
                  </button>
                ))}
              </div>

              {plan.features?.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">{t('features')}</h3>
                  <ul className="space-y-2">
                    {plan.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-gray-300">
                        <FiCheck className="text-green-400 shrink-0" /> {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <button type="button" onClick={() => setModalOpen(true)} className="btn-primary w-full text-lg">
                {t('buyNow')} — {currency}{selectedDuration?.offerPrice || 0}
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      <PurchaseModal plan={plan} isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}