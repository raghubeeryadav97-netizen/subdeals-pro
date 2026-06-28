import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiSearch, FiX } from 'react-icons/fi';
import { useTranslation } from '../../hooks/useTranslation';

export default function SearchBar({ onSearch, debounceMs = 400, navigateOnSubmit = false, className = '' }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [debounced, setDebounced] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(query), debounceMs);
    return () => clearTimeout(timer);
  }, [query, debounceMs]);

  useEffect(() => {
    onSearch?.(debounced);
  }, [debounced, onSearch]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (navigateOnSubmit && query.trim()) {
      navigate(`/plans?search=${encodeURIComponent(query.trim())}`);
    }
  }, [navigate, navigateOnSubmit, query]);

  return (
    <motion.form
      onSubmit={handleSubmit}
      className={`relative ${className}`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={t('search')}
        className="input-field pl-12 pr-10 py-2.5 text-sm"
      />
      {query && (
        <button
          type="button"
          onClick={() => setQuery('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
        >
          <FiX className="w-4 h-4" />
        </button>
      )}
    </motion.form>
  );
}