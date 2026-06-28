import { useEffect, useState } from 'react';
import { FiShoppingCart, FiUsers, FiPackage, FiDollarSign, FiStar, FiHeadphones } from 'react-icons/fi';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from 'recharts';
import StatCard from '../../components/admin/StatCard';
import ChartCard from '../../components/admin/ChartCard';
import api from '../../api/axios';
import { useSelector } from 'react-redux';

export default function AdminDashboard() {
  const currency = useSelector((state) => state.settings.data?.currency_symbol) || '₹';
  const [stats, setStats] = useState(null);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    api.get('/dashboard/stats').then(({ data }) => setStats(data.stats)).catch(() => {});
    api.get('/dashboard/analytics', { params: { period: 'monthly' } }).then(({ data }) => setAnalytics(data.analytics)).catch(() => {});
  }, []);

  if (!stats) return <p className="text-gray-400">Loading dashboard...</p>;

  const revenueData = analytics?.revenue?.map((r) => ({ name: r._id, revenue: r.revenue })) || [];
  const ordersData = analytics?.orders?.map((o) => ({ name: o._id, orders: o.count })) || [];

  return (
    <div>
      <h2 className="text-2xl font-display font-bold mb-6">Dashboard Overview</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard title="Total Revenue" value={`${currency}${stats.totalRevenue?.toLocaleString()}`} icon={FiDollarSign} color="green" index={0} />
        <StatCard title="Total Orders" value={stats.totalOrders} subtitle={`${stats.pendingOrders} pending`} icon={FiShoppingCart} index={1} />
        <StatCard title="Customers" value={stats.totalCustomers} icon={FiUsers} color="accent" index={2} />
        <StatCard title="Active Plans" value={stats.totalPlans} icon={FiPackage} index={3} />
        <StatCard title="Monthly Revenue" value={`${currency}${stats.monthlyRevenue?.toLocaleString()}`} icon={FiDollarSign} color="primary" index={4} />
        <StatCard title="Daily Revenue" value={`${currency}${stats.dailyRevenue?.toLocaleString()}`} icon={FiDollarSign} index={5} />
        <StatCard title="Pending Reviews" value={stats.pendingReviews} icon={FiStar} color="yellow" index={6} />
        <StatCard title="Open Tickets" value={stats.openTickets} icon={FiHeadphones} color="red" index={7} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Revenue Trend" subtitle="Monthly revenue" index={0}>
          <AreaChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
            <YAxis stroke="#9ca3af" fontSize={12} />
            <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
            <Area type="monotone" dataKey="revenue" stroke="#7c3aed" fill="url(#colorRev)" />
            <defs>
              <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
              </linearGradient>
            </defs>
          </AreaChart>
        </ChartCard>

        <ChartCard title="Orders Trend" subtitle="Monthly orders" index={1}>
          <BarChart data={ordersData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
            <YAxis stroke="#9ca3af" fontSize={12} />
            <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
            <Bar dataKey="orders" fill="#06b6d4" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ChartCard>
      </div>
    </div>
  );
}