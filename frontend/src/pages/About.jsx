import { motion } from 'framer-motion';
import { FiShield, FiZap, FiHeart, FiUsers } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import SEO from '../components/common/SEO';

const values = [
  { icon: FiShield, title: 'Trust & Security', desc: 'Every subscription is verified and backed by our quality guarantee.' },
  { icon: FiZap, title: 'Instant Delivery', desc: 'Get your credentials within minutes of payment confirmation.' },
  { icon: FiHeart, title: 'Customer First', desc: '24/7 WhatsApp support and dedicated account managers for premium users.' },
  { icon: FiUsers, title: 'Community', desc: 'Join thousands of satisfied customers across India.' },
];

export default function About() {
  const settings = useSelector((state) => state.settings.data);
  const company = settings?.company || {};

  return (
    <>
      <SEO title="About Us" description="Learn about SubDeals Pro - India's trusted platform for premium subscriptions." />
      <div className="container mx-auto px-4 py-12">
        <motion.div className="text-center max-w-3xl mx-auto mb-16" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="section-title neon-text mb-6">About {settings?.site_name || 'SubDeals Pro'}</h1>
          <p className="text-gray-400 text-lg leading-relaxed">
            We are India&apos;s leading platform for premium entertainment and AI subscriptions.
            Founded with a mission to make premium digital services accessible to everyone at unbeatable prices,
            we have served thousands of happy customers with genuine, instant-delivered subscriptions.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {values.map((v, i) => (
            <motion.div key={v.title} className="glass-card text-center" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <div className="inline-flex p-3 rounded-xl bg-primary/10 mb-4">
                <v.icon className="w-6 h-6 text-primary-light" />
              </div>
              <h3 className="font-display font-semibold mb-2">{v.title}</h3>
              <p className="text-gray-400 text-sm">{v.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div className="glass-card max-w-2xl mx-auto text-center" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <h2 className="font-display font-bold text-xl mb-4">Contact Information</h2>
          <p className="text-gray-400">{company.name}</p>
          <p className="text-gray-400">{company.address}</p>
          {company.phone && <p className="text-gray-400 mt-2">{company.phone}</p>}
          {settings?.support_email && <p className="text-primary-light mt-2">{settings.support_email}</p>}
        </motion.div>
      </div>
    </>
  );
}