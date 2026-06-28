import { motion } from 'framer-motion';
import { FiSearch, FiShoppingCart, FiCreditCard, FiCheckCircle } from 'react-icons/fi';
import { useTranslation } from '../../hooks/useTranslation';

const steps = [
  { icon: FiSearch, title: 'Browse Plans', desc: 'Explore our curated collection of premium entertainment and AI subscriptions.' },
  { icon: FiShoppingCart, title: 'Choose & Order', desc: 'Select your plan, duration, and fill in your details to place an order.' },
  { icon: FiCreditCard, title: 'Make Payment', desc: 'Pay via UPI, QR, bank transfer, or online payment methods.' },
  { icon: FiCheckCircle, title: 'Get Activated', desc: 'Receive your subscription credentials instantly via WhatsApp & email.' },
];

export default function HowItWorks() {
  const { t } = useTranslation();

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.h2
          className="section-title text-center mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {t('howItWorks')}
        </motion.h2>
        <motion.p
          className="text-gray-400 text-center max-w-xl mx-auto mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Get your favorite subscriptions in 4 simple steps
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          <div className="hidden lg:block absolute top-16 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0" />

          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              className="glass-card text-center relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-sm font-bold">
                {i + 1}
              </div>
              <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 mb-4 mt-2">
                <step.icon className="w-8 h-8 text-primary-light" />
              </div>
              <h3 className="font-display font-semibold text-lg mb-2">{step.title}</h3>
              <p className="text-gray-400 text-sm">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}