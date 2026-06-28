import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line } from 'recharts';
import ChartCard from '../../components/admin/ChartCard';
import StatCard from '../../components/admin/StatCard';
import api from '../../api/axios';
import { useSelector } from 'react-redux';

const COLORS = ['#7c3aed', '#06b6d4', '#f472b6', '#22c55e', '#eab308'];

export default function AdminAnalytics() {
  const currency = useSelector((state) => state.settings.data?.currency_symbol) || '₹';
  const [analytics, setAnalytics] = useState(null);
  const [period, setPeriod] = useState('monthly');

  useEffect(() => {
    api.get('/dashboard/analytics', { params: { period } }).then(({ data }) => setAnalytics(data.analytics)).catch(() => {});
  }, [period]);

  if (!analytics) return <p className="text-gray-400">Loading analytics...</p>;

  const typeData = [
    { name: 'AI', value: analytics.aiSales?.total || 0 },
    { name: 'Entertainment', value: analytics.entertainmentSales?.total || 0 },
  ];

  const topPlans = analytics.topPlans?.map((p) => ({ name: p._id?.slice(0, 15), sales: p.sales })) || [];
  const revenueData = analytics.revenue?.map((r) => ({ name: r._id, revenue: r.revenue })) || [];
  const growthData = analytics.customerGrowth?.map((g) => ({ name: g._id, customers: g.count })) || [];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-display font-bold">Analytics</h2>
        <select value={period} onChange={(e) => setPeriod(e.target.value)} className="input-field w-40 py-2 text-sm">
          <option value="daily">Daily</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard title="Avg Order Value" value={`${currency}${analytics.averageOrderValue}`} index={0} />
        <StatCard title="Renewal Rate" value={`${analytics.renewalRate}%`} color="accent" index={1} />
        <StatCard title="AI Sales" value={`${currency}${(analytics.aiSales?.total || 0).toLocaleString()}`} index={2} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Revenue" index={0}>
          <LineChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="name" stroke="#9ca3af" fontSize={11} />
            <YAxis stroke="#9ca3af" fontSize={11} />
            <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
            <Line type="monotone" dataKey="revenue" stroke="#7c3aed" strokeWidth={2} dot={false} />
          </LineChart>
        </ChartCard>

        <ChartCard title="Sales by Type" index={1}>
          <PieChart>
            <Pie data={typeData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
              {typeData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
          </PieChart>
        </ChartCard>

        <ChartCard title="Top Plans" index={2}>
          <BarChart data={topPlans} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis type="number" stroke="#9ca3af" fontSize={11} />
            <YAxis dataKey="name" type="category" stroke="#9ca3af" fontSize={11} width={100} />
            <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
            <Bar dataKey="sales" fill="#06b6d4" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ChartCard>

        <ChartCard title="Customer Growth" index={3}>
          <BarChart data={growthData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="name" stroke="#9ca3af" fontSize={11} />
            <YAxis stroke="#9ca3af" fontSize={11} />
            <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
            <Bar dataKey="customers" fill="#f472b6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ChartCard>
      </div>
    </div>
  );
}