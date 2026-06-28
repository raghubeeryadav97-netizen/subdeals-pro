import { useEffect, useState } from 'react';
import DataTable from '../../components/admin/DataTable';
import api from '../../api/axios';
import { useSelector } from 'react-redux';

export default function AdminCustomers() {
  const currency = useSelector((state) => state.settings.data?.currency_symbol) || '₹';
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api.get('/users/customers').then(({ data }) => setCustomers(data.customers || [])).finally(() => setLoading(false));
  }, []);

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'whatsapp', label: 'WhatsApp' },
    { key: 'totalOrders', label: 'Orders', render: (r) => r.totalOrders || 0 },
    { key: 'lifetimeSpending', label: 'Spent', render: (r) => `${currency}${r.lifetimeSpending || 0}` },
    { key: 'loyaltyLevel', label: 'Level', render: (r) => <span className="capitalize">{r.loyaltyLevel}</span> },
    { key: 'isActive', label: 'Status', render: (r) => r.isActive ? <span className="text-green-400">Active</span> : <span className="text-red-400">Inactive</span> },
  ];

  return (
    <div>
      <h2 className="text-2xl font-display font-bold mb-6">Customers</h2>
      <DataTable columns={columns} data={customers} loading={loading} searchKeys={['name', 'email']} onRowClick={setSelected} />

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70" onClick={() => setSelected(null)}>
          <div className="glass w-full max-w-lg p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold mb-4">{selected.name}</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <p>Email: {selected.email}</p>
              <p>WhatsApp: {selected.whatsapp || 'N/A'}</p>
              <p>Country: {selected.country}</p>
              <p>Orders: {selected.totalOrders} | Spent: {currency}{selected.lifetimeSpending}</p>
              <p>Loyalty: {selected.loyaltyLevel} ({selected.loyaltyPoints} pts)</p>
              <p>Referral Code: {selected.referralCode || 'N/A'}</p>
              <p>Joined: {new Date(selected.createdAt).toLocaleDateString()}</p>
            </div>
            <button type="button" onClick={() => setSelected(null)} className="btn-outline mt-4">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}