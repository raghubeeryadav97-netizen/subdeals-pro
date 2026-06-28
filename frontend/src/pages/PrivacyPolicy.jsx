import SEO from '../components/common/SEO';
import { useTranslation } from '../hooks/useTranslation';

export default function PrivacyPolicy() {
  const { t } = useTranslation();

  return (
    <>
      <SEO title={t('privacy')} description="Privacy Policy for SubDeals Pro." />
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="section-title mb-8">{t('privacy')}</h1>
        <div className="glass-card space-y-6 text-gray-300">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Information We Collect</h2>
            <p>We collect name, email, WhatsApp number, payment details, and order history when you use our services. Account information is stored securely.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. How We Use Your Data</h2>
            <p>Your data is used to process orders, deliver subscriptions, send renewal reminders, provide customer support, and improve our services.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Data Sharing</h2>
            <p>We do not sell your personal data. Information is shared only with payment processors and service providers necessary to fulfill your orders.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Data Security</h2>
            <p>We implement industry-standard security measures including encrypted connections, secure token authentication, and regular security audits.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Your Rights</h2>
            <p>You may request access, correction, or deletion of your personal data by contacting our support team. You can unsubscribe from marketing emails at any time.</p>
          </section>
        </div>
      </div>
    </>
  );
}