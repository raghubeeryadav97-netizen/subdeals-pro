import { useEffect, useState } from 'react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import DataTable from '../../components/admin/DataTable';
import api from '../../api/axios';
import { useSelector } from 'react-redux';

const empty = { code: '', type: 'percentage', value: 10, minOrderAmount: 0, maxDiscount: 0, usageLimit: 100, isActive: true, expiresAt: '' };

export default function AdminCoupons() {
  const currency = useSelector((state) => state.settings.data?.currency_symbol) || '₹';
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(empty);

  const fetch = () => {
    setLoading(true);
    api.get('/coupons/admin/all').then(({ data }) => setCoupons(data.coupons || [])).finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const handleSave = async () => {
    try {
      await api.post('/coupons', form);
      setModal(false);
      setForm(empty);
      fetch();
    } catch (err) {
      alert(err.response?.data?.message || 'Save failed');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete coupon?')) return;
    await api.delete(`/coupons/${id}`);
    fetch();
  };

  const columns = [
    { key: 'code', label: 'Code', render: (r) => <span className="font-mono text-primary-light">{r.code}</span> },
    { key: 'type', label: 'Type', render: (r) => <span className="capitalize">{r.type}</span> },
    { key: 'value', label: 'Value', render: (r) => r.type === 'percentage' ? `${r.value}%` : `${currency}${r.value}` },
    { key: 'usedCount', label: 'Used', render: (r) => `${r.usedCount || 0}/${r.usageLimit || '∞'}` },
    { key: 'isActive', label: 'Active', render: (r) => r.isActive ? <span className="text-green-400">Yes</span> : <span className="text-red-400">No</span> },
    {
      key: 'actions', label: 'Actions',
      render: (r) => (
        <button type="button" onClick={() => handleDelete(r._id)} className="p-1.5 rounded-lg hover:bg-red-400/10 text-red-400"><FiTrash2 className="w-4 h-4" /></button>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-display font-bold">Coupons</h2>
        <button type="button" onClick={() => setModal(true)} className="btn-primary flex items-center gap-2 text-sm"><FiPlus /> Add Coupon</button>
      </div>
      <DataTable columns={columns} data={coupons} loading={loading} searchKeys={['code']} />

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="glass w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4">Create Coupon</h3>
            <div className="space-y-4">
              <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="Coupon Code" className="input-field" />
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="input-field">
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed Amount</option>
              </select>
              <input type="number" value={form.value} onChange={(e) => setForm({ ...form, value: Number(e.target.value) })} placeholder="Value" className="input-field" />
              <input type="number" value={form.usageLimit} onChange={(e) => setForm({ ...form, usageLimit: Number(e.target.value) })} placeholder="Usage Limit" className="input-field" />
              <input type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} className="input-field" />
            </div>
            <div className="flex gap-3 mt-6">
              <button type="button" onClick={handleSave} className="btn-primary">Save</button>
              <button type="button" onClick={() => setModal(false)} className="btn-outline">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}