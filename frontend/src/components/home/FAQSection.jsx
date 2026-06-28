import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronDown } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const faqs = [
  { q: 'How do I receive my subscription after payment?', a: 'Once your payment is verified, you will receive your subscription credentials via WhatsApp and email within minutes. Most plans are delivered instantly.' },
  { q: 'What payment methods do you accept?', a: 'We accept UPI, QR code payments, bank transfers, Razorpay, Stripe, and manual payment verification. Choose your preferred method during checkout.' },
  { q: 'Are these subscriptions genuine and legal?', a: 'Yes, all our subscriptions are 100% genuine. We source directly from authorized resellers and provide full warranty on every purchase.' },
  { q: 'What is your refund policy?', a: 'We offer refunds within 24 hours if the subscription is not delivered. Please check our Refund Policy page for complete details.' },
  { q: 'Can I renew my subscription?', a: 'Absolutely! You can renew before expiry through your dashboard or by contacting us on WhatsApp. We also send automatic renewal reminders.' },
  { q: 'Do you offer discounts or coupons?', a: 'Yes! We regularly offer coupon codes and festival discounts. Subscribe to our newsletter and follow us on social media for the latest deals.' },
];

function FAQItem({ faq, isOpen, onToggle }) {
  return (
    <div className="glass-card overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between text-left p-1"
      >
        <span className="font-medium pr-4">{faq.q}</span>
        <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <FiChevronDown className="w-5 h-5 text-primary-light shrink-0" />
        </motion.span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-gray-400 text-sm pt-3 pb-1 leading-relaxed">{faq.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FAQSection({ limit }) {
  const [openIndex, setOpenIndex] = useState(0);
  const displayFaqs = limit ? faqs.slice(0, limit) : faqs;

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.h2
          className="section-title text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Frequently Asked Questions
        </motion.h2>

        <div className="space-y-4">
          {displayFaqs.map((faq, i) => (
            <motion.div
              key={faq.q}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <FAQItem
                faq={faq}
                isOpen={openIndex === i}
                onToggle={() => setOpenIndex(openIndex === i ? -1 : i)}
              />
            </motion.div>
          ))}
        </div>

        {limit && (
          <div className="text-center mt-8">
            <Link to="/faq" className="btn-outline">View All FAQs</Link>
          </div>
        )}
      </div>
    </section>
  );
}