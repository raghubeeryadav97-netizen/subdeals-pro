import { Link } from 'react-router-dom';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube, FaLinkedin } from 'react-icons/fa';
import { FiMail, FiSend } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import api from '../../api/axios';
import { useTranslation } from '../../hooks/useTranslation';

const footerLinks = {
  plans: [
    { to: '/entertainment', label: 'entertainment' },
    { to: '/ai-plans', label: 'ai' },
    { to: '/pricing', label: 'pricing' },
    { to: '/categories', label: 'plans' },
  ],
  company: [
    { to: '/about', label: 'about' },
    { to: '/blog', label: 'blog' },
    { to: '/reviews', label: 'reviews' },
    { to: '/contact', label: 'contact' },
  ],
  legal: [
    { to: '/refund-policy', label: 'refundPolicy' },
    { to: '/terms', label: 'terms' },
    { to: '/privacy', label: 'privacy' },
    { to: '/faq', label: 'faq' },
  ],
};

const socialIcons = {
  facebook: FaFacebook,
  twitter: FaTwitter,
  instagram: FaInstagram,
  youtube: FaYoutube,
  linkedin: FaLinkedin,
};

export default function Footer() {
  const { t } = useTranslation();
  const settings = useSelector((state) => state.settings.data);
  const social = settings?.social_links || {};
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await api.post('/newsletter/subscribe', { email });
      setSubscribed(true);
      setEmail('');
    } catch {
      setSubscribed(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="border-t border-white/10 bg-dark-100/50 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <Link to="/" className="text-2xl font-display font-bold neon-text">
              {settings?.site_name || 'SubDeals Pro'}
            </Link>
            <p className="text-gray-400 mt-3 text-sm leading-relaxed max-w-sm">
              Premium entertainment and AI subscriptions at unbeatable prices. Trusted by thousands across India.
            </p>
            <div className="flex gap-3 mt-4">
              {Object.entries(social).map(([key, url]) => {
                if (!url) return null;
                const Icon = socialIcons[key];
                if (!Icon) return null;
                return (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl glass hover:border-primary/40 text-gray-400 hover:text-primary-light transition-all"
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-4">Plans</h4>
            <ul className="space-y-2">
              {footerLinks.plans.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-gray-400 hover:text-primary-light text-sm transition-colors">
                    {t(link.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-gray-400 hover:text-primary-light text-sm transition-colors">
                    {t(link.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-4">{t('newsletter')}</h4>
            <p className="text-gray-400 text-sm mb-3">Get deals & updates in your inbox.</p>
            {subscribed ? (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-green-400 text-sm">
                Thanks for subscribing!
              </motion.p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <div className="relative flex-1">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="input-field pl-10 py-2 text-sm"
                    required
                  />
                </div>
                <button type="submit" disabled={loading} className="btn-primary px-3 py-2">
                  <FiSend className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} {settings?.site_name || 'SubDeals Pro'}. All rights reserved.
          </p>
          <div className="flex gap-4">
            {footerLinks.legal.map((link) => (
              <Link key={link.to} to={link.to} className="text-gray-500 hover:text-gray-300 text-xs">
                {t(link.label)}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}