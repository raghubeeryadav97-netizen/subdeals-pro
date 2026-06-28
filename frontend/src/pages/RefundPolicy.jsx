import SEO from '../components/common/SEO';
import { useTranslation } from '../hooks/useTranslation';

export default function RefundPolicy() {
  const { t } = useTranslation();

  return (
    <>
      <SEO title={t('refundPolicy')} description="SubDeals Pro refund policy and terms." />
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="section-title mb-8">{t('refundPolicy')}</h1>
        <div className="glass-card prose prose-invert max-w-none space-y-6 text-gray-300">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Eligibility</h2>
            <p>Refunds are available within 24 hours of purchase if the subscription credentials have not been delivered or if the delivered credentials are invalid and cannot be activated.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Non-Refundable Cases</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Successfully delivered and activated subscriptions</li>
              <li>Change of mind after credentials have been shared</li>
              <li>Account bans due to violation of service provider terms by the customer</li>
              <li>Partial usage of subscription period</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Refund Process</h2>
            <p>Contact our support team via WhatsApp or email with your Order ID. Refunds are processed within 5-7 business days to the original payment method.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Replacement Policy</h2>
            <p>In case of credential issues, we offer free replacement before processing a refund. Most issues are resolved within 2 hours.</p>
          </section>
        </div>
      </div>
    </>
  );
}