import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiUser, FiLogOut, FiLayout, FiSearch } from 'react-icons/fi';
import ThemeToggle from '../common/ThemeToggle';
import LanguageSwitcher from '../common/LanguageSwitcher';
import SearchBar from '../plans/SearchBar';
import { useTranslation } from '../../hooks/useTranslation';
import { logout } from '../../store/slices/authSlice';

const navLinks = [
  { to: '/', label: 'home' },
  { to: '/entertainment', label: 'entertainment' },
  { to: '/ai-plans', label: 'ai' },
  { to: '/pricing', label: 'pricing' },
  { to: '/reviews', label: 'reviews' },
  { to: '/blog', label: 'blog' },
  { to: '/contact', label: 'contact' },
];

export default function Navbar() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const settings = useSelector((state) => state.settings.data);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const isAdmin = user && ['admin', 'manager', 'staff'].includes(user.role);

  const handleSearch = (q) => {
    if (q.trim()) {
      navigate(`/entertainment?search=${encodeURIComponent(q)}`);
      setSearchOpen(false);
      setMobileOpen(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 glass border-b border-white/10 backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-18">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            {settings?.site_logo ? (
              <img src={settings.site_logo} alt={settings.site_name} className="h-8 w-auto" />
            ) : (
              <span className="text-xl font-display font-bold neon-text">SubDeals Pro</span>
            )}
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive ? 'text-primary-light bg-primary/10' : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                {t(link.label)}
              </NavLink>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            {searchOpen ? (
              <SearchBar onSearch={handleSearch} className="w-48 lg:w-64" />
            ) : (
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="p-2.5 rounded-xl glass hover:border-primary/40 text-gray-400 hover:text-white"
              >
                <FiSearch className="w-5 h-5" />
              </button>
            )}
            <LanguageSwitcher />
            <ThemeToggle />

            {user ? (
              <div className="flex items-center gap-2">
                {isAdmin && (
                  <Link to="/admin" className="p-2.5 rounded-xl glass hover:border-primary/40 text-primary-light" title="Admin Panel">
                    <FiLayout className="w-5 h-5" />
                  </Link>
                )}
                <Link to="/dashboard" className="flex items-center gap-2 px-3 py-2 rounded-xl glass hover:border-primary/40">
                  <FiUser className="w-4 h-4" />
                  <span className="text-sm hidden xl:inline">{user.name?.split(' ')[0]}</span>
                </Link>
                <button type="button" onClick={handleLogout} className="p-2.5 rounded-xl glass hover:border-red-400/40 text-gray-400 hover:text-red-400">
                  <FiLogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-outline text-sm py-2 px-4">{t('login')}</Link>
                <Link to="/register" className="btn-primary text-sm py-2 px-4">{t('register')}</Link>
              </div>
            )}
          </div>

          <button
            type="button"
            className="md:hidden p-2 rounded-lg glass"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="md:hidden border-t border-white/10 glass"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <div className="container mx-auto px-4 py-4 space-y-3">
              <SearchBar onSearch={handleSearch} />
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `block px-4 py-2 rounded-lg ${isActive ? 'bg-primary/10 text-primary-light' : 'text-gray-300'}`
                  }
                >
                  {t(link.label)}
                </NavLink>
              ))}
              <div className="flex items-center gap-3 pt-2">
                <LanguageSwitcher />
                <ThemeToggle />
              </div>
              {user ? (
                <div className="space-y-2 pt-2 border-t border-white/10">
                  <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="block px-4 py-2 rounded-lg text-gray-300">{t('dashboard')}</Link>
                  {isAdmin && <Link to="/admin" onClick={() => setMobileOpen(false)} className="block px-4 py-2 rounded-lg text-primary-light">Admin Panel</Link>}
                  <button type="button" onClick={handleLogout} className="block w-full text-left px-4 py-2 rounded-lg text-red-400">Logout</button>
                </div>
              ) : (
                <div className="flex gap-2 pt-2">
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-outline flex-1 text-center text-sm">{t('login')}</Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)} className="btn-primary flex-1 text-center text-sm">{t('register')}</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}