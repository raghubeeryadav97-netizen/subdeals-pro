import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FiSun, FiMoon } from 'react-icons/fi';
import { toggleTheme } from '../../store/slices/themeSlice';

export default function ThemeToggle({ className = '' }) {
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.theme.mode);
  const isDark = mode === 'dark';

  return (
    <motion.button
      type="button"
      onClick={() => dispatch(toggleTheme())}
      className={`p-2.5 rounded-xl glass hover:border-primary/40 transition-all ${className}`}
      whileTap={{ scale: 0.9 }}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      <motion.div
        key={mode}
        initial={{ rotate: -90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {isDark ? (
          <FiSun className="w-5 h-5 text-yellow-400" />
        ) : (
          <FiMoon className="w-5 h-5 text-primary" />
        )}
      </motion.div>
    </motion.button>
  );
}