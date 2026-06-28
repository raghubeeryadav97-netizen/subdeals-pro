import { motion } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';
import { useSelector } from 'react-redux';

export default function FloatingWhatsApp() {
  const settings = useSelector((state) => state.settings.data);
  const number = settings?.whatsapp_number || '919080935476';
  const message = encodeURIComponent('Hi! I need help with SubDeals Pro subscriptions.');
  const url = `https://wa.me/${number.replace(/\D/g, '')}?text=${message}`;

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-green-500 rounded-full shadow-lg shadow-green-500/30 hover:bg-green-400 transition-colors"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      aria-label="Chat on WhatsApp"
    >
      <FaWhatsapp className="text-2xl text-white" />
      <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-20" />
    </motion.a>
  );
}