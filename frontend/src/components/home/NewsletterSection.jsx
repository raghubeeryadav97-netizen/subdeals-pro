import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiSend } from 'react-icons/fi';
import api from '../../api/axios';
import { useTranslation } from '../../hooks/useTranslation';

export default function NewsletterSection() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    try {
      await api.post('/newsletter/subscribe', { email });
      setStatus('success');
      setEmail('');
    } catch (err) {
      setStatus(err.response?.data?.message || 'Subscription failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          className="glass-card max-w-2xl mx-auto text-center relative overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10" />
          <div className="relative z-10">
            <div className="inline-flex p-3 rounded-2xl bg-primary/10 mb-4">
              <FiMail className="w-8 h-8 text-primary-light" />
            </div>
            <h2 className="section-title mb-3">{t('newsletter')}</h2>
            <p className="text-gray-400 mb-8">
              Subscribe to get exclusive deals, new plan launches, and special festival offers.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="input-field flex-1"
                required
              />
              <button type="submit" disabled={loading} className="btn-primary flex items-center justify-center gap-2">
                <FiSend className="w-4 h-4" />
                {loading ? '...' : t('subscribe')}
              </button>
            </form>

            {status === 'success' && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-green-400 text-sm mt-4">
                Successfully subscribed! Check your inbox for welcome deals.
              </motion.p>
            )}
            {status && status !== 'success' && (
              <p className="text-red-400 text-sm mt-4">{status}</p>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}