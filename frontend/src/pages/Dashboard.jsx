import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { isAdminRole } from '../utils/auth';
import { motion } from 'framer-motion';
import { FiPackage, FiGift, FiAward, FiHeadphones, FiDownload } from 'react-icons/fi';
import SEO from '../components/common/SEO';
import api from '../api/axios';
import { downloadOrderInvoice, isOfflineOrder } from '../utils/generateInvoice';

const statusColors = {
  pending: 'text-yellow-400 bg-yellow-400/10',
  confirmed: 'text-blue-400 bg-blue-400/10',
  completed: 'text-green-400 bg-green-400/10',
  cancelled: 'text-red-400 bg-red-400/10',
  open: 'text-yellow-400 bg-yellow-400/10',
  resolved: 'text-green-400 bg-green-400/10',
};

export default function Dashboard() {
  const { user } = useSelector((state) => state.auth);
  const settings = useSelector((state) => state.settings.data);
  const currency = settings?.currency_symbol || '₹';
  const [orders, setOrders] = useState([]);
  const [referrals, setReferrals] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('orders');

  useEffect(() => {
    Promise.all([
      api.get('/orders/my').catch(() => ({ data: { orders: [] } })),
      api.get('/users/referrals').catch(() => ({ data: {} })),
      api.get('/support/my').catch(() => ({ data: { tickets: [] } })),
    ]).then(([ordersRes, refRes, ticketRes]) => {
      setOrders(ordersRes.data.orders || []);
      setReferrals(refRes.data);
      setTickets(ticketRes.data.tickets || []);
    }).finally(() => setLoading(false));
  }, []);

  const downloadInvoice = async (order) => {
    if (isOfflineOrder(order)) {
      downloadOrderInvoice(order, settings);
      return;
    }

    try {
      const { data } = await api.get(`/orders/${order._id}/invoice`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${order.orderId}.pdf`;
      link.click();
    } catch {
      downloadOrderInvoice(order, settings);
    }
  };

  const tabs = [
    { key: 'orders', label: 'Orders', icon: FiPackage },
    { key: 'referrals', label: 'Referrals', icon: FiGift },
    { key: 'loyalty', label: 'Loyalty', icon: FiAward },
    { key: 'support', label: 'Support', icon: FiHeadphones },
  ];

  return (
    <>
      <SEO title="Dashboard" noindex />
      <div className="container mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="section-title mb-2">Welcome, {user?.name || 'User'}</h1>
          <p className="text-gray-400 mb-8">Manage your orders, referrals, and support tickets.</p>

          {isAdminRole(user?.role) && (
            <div className="glass-card mb-8 border border-primary/30">
              <p className="text-gray-300">
                You are logged in as admin. Open the{' '}
                <Link to="/admin" className="text-primary-light hover:underline font-medium">Admin Panel</Link>
                {' '}to manage plans, orders, and settings.
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="glass-card text-center">
              <p className="text-2xl font-bold neon-text">{user?.totalOrders || 0}</p>
              <p className="text-gray-400 text-sm">Total Orders</p>
            </div>
            <div className="glass-card text-center">
              <p className="text-2xl font-bold neon-text">{currency}{user?.lifetimeSpending || 0}</p>
              <p className="text-gray-400 text-sm">Lifetime Spending</p>
            </div>
            <div className="glass-card text-center">
              <p className="text-2xl font-bold neon-text">{user?.loyaltyPoints || 0}</p>
              <p className="text-gray-400 text-sm">Loyalty Points</p>
            </div>
            <div className="glass-card text-center">
              <p className="text-2xl font-bold capitalize neon-text">{user?.loyaltyLevel || 'bronze'}</p>
              <p className="text-gray-400 text-sm">Loyalty Level</p>
            </div>
          </div>

          <div className="flex gap-2 mb-6 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.key ? 'bg-primary/20 text-primary-light border border-primary/30' : 'glass text-gray-400'
                }`}
              >
                <tab.icon className="w-4 h-4" /> {tab.label}
              </button>
            ))}
          </div>

          {loading ? (
            <p className="text-gray-400 text-center py-12">Loading...</p>
          ) : (
            <>
              {activeTab === 'orders' && (
                <div className="space-y-4">
                  {orders.length === 0 ? (
                    <p className="text-gray-400 text-center py-12">No orders yet.</p>
                  ) : orders.map((order) => (
                    <div key={order._id} className="glass-card flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-semibold">{order.planName}</h3>
                        <p className="text-sm text-gray-400">{order.orderId} • {order.durationLabel}</p>
                        <p className="text-sm text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold">{currency}{order.finalPrice}</span>
                        <span className={`text-xs px-2 py-1 rounded-full capitalize ${statusColors[order.orderStatus] || ''}`}>{order.orderStatus}</span>
                        <button type="button" onClick={() => downloadInvoice(order)} className="p-2 rounded-lg glass hover:border-primary/40" title="Download Invoice">
                          <FiDownload className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'referrals' && (
                <div className="glass-card">
                  <h3 className="font-semibold mb-4">Your Referral Code</h3>
                  <p className="text-2xl font-mono neon-text mb-4">{user?.referralCode || 'N/A'}</p>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-400 text-sm">Total Referrals</p>
                      <p className="text-xl font-bold">{referrals?.totalReferrals || 0}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">Earnings</p>
                      <p className="text-xl font-bold">{currency}{referrals?.totalEarnings || user?.referralEarnings || 0}</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'loyalty' && (
                <div className="glass-card">
                  <h3 className="font-semibold mb-4">Loyalty Program</h3>
                  <div className="space-y-3">
                    {['bronze', 'silver', 'gold', 'platinum'].map((level) => (
                      <div key={level} className={`flex items-center justify-between p-3 rounded-xl ${user?.loyaltyLevel === level ? 'bg-primary/10 border border-primary/30' : 'bg-white/5'}`}>
                        <span className="capitalize font-medium">{level}</span>
                        {user?.loyaltyLevel === level && <span className="text-xs text-primary-light">Current</span>}
                      </div>
                    ))}
                  </div>
                  <p className="text-gray-400 text-sm mt-4">Earn 1 point per ₹1 spent. Level up for exclusive discounts!</p>
                </div>
              )}

              {activeTab === 'support' && (
                <div className="space-y-4">
                  {tickets.length === 0 ? (
                    <p className="text-gray-400 text-center py-12">No support tickets.</p>
                  ) : tickets.map((ticket) => (
                    <div key={ticket._id} className="glass-card">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{ticket.subject}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full capitalize ${statusColors[ticket.status] || ''}`}>{ticket.status}</span>
                      </div>
                      <p className="text-sm text-gray-400">{ticket.message}</p>
                      <p className="text-xs text-gray-500 mt-2">{new Date(ticket.createdAt).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </>
  );
}