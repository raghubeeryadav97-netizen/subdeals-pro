import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiLayout, FiPackage, FiGrid, FiShoppingCart, FiUsers, FiStar,
  FiTag, FiFileText, FiSettings, FiHeadphones, FiBell, FiBarChart2,
  FiMail, FiMessageSquare, FiDatabase, FiMenu, FiX, FiLogOut, FiHome,
} from 'react-icons/fi';
import { logout } from '../../store/slices/authSlice';
import ThemeToggle from '../common/ThemeToggle';

const adminNav = [
  { to: '/admin', label: 'Dashboard', icon: FiLayout, end: true },
  { to: '/admin/plans', label: 'Plans', icon: FiPackage },
  { to: '/admin/categories', label: 'Categories', icon: FiGrid },
  { to: '/admin/orders', label: 'Orders', icon: FiShoppingCart },
  { to: '/admin/customers', label: 'Customers', icon: FiUsers },
  { to: '/admin/reviews', label: 'Reviews', icon: FiStar },
  { to: '/admin/coupons', label: 'Coupons', icon: FiTag },
  { to: '/admin/blogs', label: 'Blogs', icon: FiFileText },
  { to: '/admin/support', label: 'Support', icon: FiHeadphones },
  { to: '/admin/notifications', label: 'Notifications', icon: FiBell },
  { to: '/admin/analytics', label: 'Analytics', icon: FiBarChart2 },
  { to: '/admin/newsletter', label: 'Newsletter', icon: FiMail },
  { to: '/admin/contacts', label: 'Contacts', icon: FiMessageSquare },
  { to: '/admin/settings', label: 'Settings', icon: FiSettings },
  { to: '/admin/backup', label: 'Backup', icon: FiDatabase },
];

export default function AdminLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const settings = useSelector((state) => state.settings.data);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-white/10">
        <Link to="/admin" className="text-lg font-display font-bold neon-text">
          {settings?.site_name || 'SubDeals Pro'}
        </Link>
        <p className="text-xs text-gray-400 mt-1">Admin Panel</p>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-1">
        {adminNav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-primary/20 text-primary-light border border-primary/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`
            }
          >
            <item.icon className="w-4 h-4 shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-white/10 space-y-2">
        <Link to="/" className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/5">
          <FiHome className="w-4 h-4" /> View Site
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-red-400 hover:bg-red-400/10 w-full"
        >
          <FiLogOut className="w-4 h-4" /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-dark flex">
      <aside className="hidden lg:block w-64 shrink-0 glass border-r border-white/10 fixed h-full z-40">
        <Sidebar />
      </aside>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              className="lg:hidden fixed inset-0 bg-black/60 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              className="lg:hidden fixed left-0 top-0 h-full w-64 glass z-50"
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
            >
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10"
              >
                <FiX className="w-5 h-5" />
              </button>
              <Sidebar />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 lg:ml-64">
        <header className="sticky top-0 z-30 glass border-b border-white/10 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="lg:hidden p-2 rounded-lg glass"
              onClick={() => setSidebarOpen(true)}
            >
              <FiMenu className="w-5 h-5" />
            </button>
            <h1 className="font-display font-semibold text-lg hidden sm:block">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <span className="text-sm text-gray-400">{user?.name}</span>
            <span className="text-xs px-2 py-1 rounded-full bg-primary/20 text-primary-light capitalize">{user?.role}</span>
          </div>
        </header>

        <main className="p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}