import { useEffect, useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiCopy } from 'react-icons/fi';
import DataTable from '../../components/admin/DataTable';
import api from '../../api/axios';

const emptyPlan = {
  name: '', description: '', type: 'entertainment', category: '', features: '', logo: '', banner: '',
  deliveryTime: 'Instant', status: 'active', isFeatured: false, isPopular: false, isTrending: false,
  durationPricing: [{ months: 1, label: '1 Month', originalPrice: 0, offerPrice: 0, discount: 0, stock: 100, isAvailable: true }],
};

export default function AdminPlans() {
  const [plans, setPlans] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(emptyPlan);
  const [saving, setSaving] = useState(false);

  const fetch = () => {
    setLoading(true);
    Promise.all([
      api.get('/plans/admin/all'),
      api.get('/categories/admin/all'),
    ]).then(([pRes, cRes]) => {
      setPlans(pRes.data.plans || []);
      setCategories(cRes.data.categories || []);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const openCreate = () => { setForm(emptyPlan); setModal('create'); };
  const openEdit = (plan) => {
    setForm({
      ...plan,
      category: plan.category?._id || plan.category,
      features: (plan.features || []).join('\n'),
      durationPricing: plan.durationPricing || emptyPlan.durationPricing,
    });
    setModal('edit');
  };

  const handleSave = async () => {
    setSaving(true);
    const payload = {
      ...form,
      features: form.features.split('\n').filter(Boolean),
    };
    try {
      if (modal === 'edit') {
        await api.put(`/plans/${form._id}`, payload);
      } else {
        await api.post('/plans', payload);
      }
      setModal(null);
      fetch();
    } catch (err) {
      alert(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this plan?')) return;
    await api.delete(`/plans/${id}`);
    fetch();
  };

  const handleDuplicate = async (id) => {
    await api.post(`/plans/${id}/duplicate`);
    fetch();
  };

  const updatePricing = (index, field, value) => {
    const updated = [...form.durationPricing];
    updated[index] = { ...updated[index], [field]: field === 'months' || field === 'originalPrice' || field === 'offerPrice' || field === 'discount' || field === 'stock' ? Number(value) : field === 'isAvailable' ? value : value };
    setForm({ ...form, durationPricing: updated });
  };

  const addPricing = () => {
    setForm({ ...form, durationPricing: [...form.durationPricing, { months: 3, label: '3 Months', originalPrice: 0, offerPrice: 0, discount: 0, stock: 100, isAvailable: true }] });
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'type', label: 'Type', render: (r) => <span className="capitalize">{r.type}</span> },
    { key: 'category', label: 'Category', render: (r) => r.category?.name || '-' },
    { key: 'status', label: 'Status', render: (r) => <span className="capitalize">{r.status}</span> },
    { key: 'sales', label: 'Sales', render: (r) => r.totalSales || 0 },
    {
      key: 'actions', label: 'Actions',
      render: (r) => (
        <div className="flex gap-2">
          <button type="button" onClick={() => openEdit(r)} className="p-1.5 rounded-lg hover:bg-white/10"><FiEdit2 className="w-4 h-4" /></button>
          <button type="button" onClick={() => handleDuplicate(r._id)} className="p-1.5 rounded-lg hover:bg-white/10"><FiCopy className="w-4 h-4" /></button>
          <button type="button" onClick={() => handleDelete(r._id)} className="p-1.5 rounded-lg hover:bg-red-400/10 text-red-400"><FiTrash2 className="w-4 h-4" /></button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-display font-bold">Plans</h2>
        <button type="button" onClick={openCreate} className="btn-primary flex items-center gap-2 text-sm"><FiPlus /> Add Plan</button>
      </div>

      <DataTable columns={columns} data={plans} loading={loading} searchKeys={['name', 'type']} />

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="glass w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <h3 className="text-xl font-bold mb-4">{modal === 'edit' ? 'Edit Plan' : 'Create Plan'}</h3>
            <div className="space-y-4">
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Plan Name" className="input-field" />
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" rows={3} className="input-field resize-none" />
              <div className="grid grid-cols-2 gap-4">
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="input-field">
                  <option value="entertainment">Entertainment</option>
                  <option value="ai">AI</option>
                </select>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field">
                  <option value="">Select Category</option>
                  {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
              <input value={form.logo} onChange={(e) => setForm({ ...form, logo: e.target.value })} placeholder="Logo URL" className="input-field" />
              <textarea value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} placeholder="Features (one per line)" rows={3} className="input-field resize-none" />

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="font-medium">Duration Pricing</label>
                  <button type="button" onClick={addPricing} className="text-sm text-primary-light">+ Add</button>
                </div>
                {form.durationPricing.map((dp, i) => (
                  <div key={i} className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-2">
                    <input value={dp.label} onChange={(e) => updatePricing(i, 'label', e.target.value)} placeholder="Label" className="input-field text-sm py-2" />
                    <input type="number" value={dp.months} onChange={(e) => updatePricing(i, 'months', e.target.value)} placeholder="Months" className="input-field text-sm py-2" />
                    <input type="number" value={dp.originalPrice} onChange={(e) => updatePricing(i, 'originalPrice', e.target.value)} placeholder="Original" className="input-field text-sm py-2" />
                    <input type="number" value={dp.offerPrice} onChange={(e) => updatePricing(i, 'offerPrice', e.target.value)} placeholder="Offer" className="input-field text-sm py-2" />
                    <input type="number" value={dp.stock} onChange={(e) => updatePricing(i, 'stock', e.target.value)} placeholder="Stock" className="input-field text-sm py-2" />
                    <label className="flex items-center gap-1 text-sm">
                      <input type="checkbox" checked={dp.isAvailable} onChange={(e) => updatePricing(i, 'isAvailable', e.target.checked)} /> Available
                    </label>
                  </div>
                ))}
              </div>

              <div className="flex gap-4 flex-wrap">
                {['isFeatured', 'isPopular', 'isTrending'].map((flag) => (
                  <label key={flag} className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={form[flag]} onChange={(e) => setForm({ ...form, [flag]: e.target.checked })} />
                    {flag.replace('is', '')}
                  </label>
                ))}
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button type="button" onClick={handleSave} disabled={saving} className="btn-primary">{saving ? 'Saving...' : 'Save'}</button>
              <button type="button" onClick={() => setModal(null)} className="btn-outline">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}