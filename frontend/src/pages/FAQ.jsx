import SEO from '../components/common/SEO';
import FAQSection from '../components/home/FAQSection';
import { useTranslation } from '../hooks/useTranslation';

export default function FAQ() {
  const { t } = useTranslation();

  return (
    <>
      <SEO title={t('faq')} description="Frequently asked questions about SubDeals Pro subscriptions, payments, and delivery." />
      <div className="container mx-auto px-4 py-12">
        <h1 className="section-title text-center mb-4">{t('faq')}</h1>
        <p className="text-gray-400 text-center mb-8 max-w-xl mx-auto">
          Find answers to common questions about our subscription services.
        </p>
      </div>
      <FAQSection />
    </>
  );
}