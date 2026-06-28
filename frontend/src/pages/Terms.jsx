import SEO from '../components/common/SEO';
import { useTranslation } from '../hooks/useTranslation';

export default function Terms() {
  const { t } = useTranslation();

  return (
    <>
      <SEO title={t('terms')} description="Terms of Service for SubDeals Pro." />
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="section-title mb-8">{t('terms')}</h1>
        <div className="glass-card space-y-6 text-gray-300">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Acceptance of Terms</h2>
            <p>By accessing and using SubDeals Pro, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Services</h2>
            <p>SubDeals Pro provides subscription reselling services for entertainment and AI platforms. We act as an intermediary between customers and authorized resellers.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. User Responsibilities</h2>
            <p>Users must provide accurate information during purchase, maintain confidentiality of credentials, and comply with the terms of the respective subscription providers.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Payment Terms</h2>
            <p>All prices are listed in Indian Rupees (₹). Payment must be completed before subscription delivery. We reserve the right to modify pricing at any time.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Limitation of Liability</h2>
            <p>SubDeals Pro is not liable for service interruptions caused by third-party providers. Our liability is limited to the amount paid for the specific order.</p>
          </section>
        </div>
      </div>
    </>
  );
}