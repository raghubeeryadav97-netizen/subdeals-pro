import { motion } from 'framer-motion';
import { useTranslation } from '../../hooks/useTranslation';

const languages = [
  { code: 'en', label: 'EN', flag: '🇬🇧' },
  { code: 'hi', label: 'हि', flag: '🇮🇳' },
];

export default function LanguageSwitcher({ className = '' }) {
  const { lang, changeLang } = useTranslation();

  return (
    <div className={`flex items-center gap-1 p-1 rounded-xl glass ${className}`}>
      {languages.map((l) => (
        <motion.button
          key={l.code}
          type="button"
          onClick={() => changeLang(l.code)}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
            lang === l.code
              ? 'bg-primary/20 text-primary-light border border-primary/30'
              : 'text-gray-400 hover:text-white'
          }`}
          whileTap={{ scale: 0.95 }}
        >
          <span className="mr-1">{l.flag}</span>
          {l.label}
        </motion.button>
      ))}
    </div>
  );
}