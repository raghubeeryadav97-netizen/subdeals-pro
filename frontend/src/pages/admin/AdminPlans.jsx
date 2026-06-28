import { useEffect, useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiCopy } from 'react-icons/fi';
import DataTable from '../../components/admin/DataTable';
import {
  fetchAdminPlans,
  fetchAdminCategories,
  saveAdminPlan,
  deleteAdminPlan,
  duplicateAdminPlan,
} from '../../api/plans';

const emptyPlan = {
  name: '', description: '', type: 'entertainment', category: '', features: '', logo: '', banner: '',
  deliveryTime: 'Instant', status: 'active', isFeatured: false, isPopular: false, isTrending: false,
  durationPricing: [{ months: 1, label: '1 Month', originalPrice: 0, offerPrice: 0, discount: 0, stock: 100, isAvailable: true }],
};

export default function AdminPlans() {
  const [plans, setPlans] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingOfflineData, setUsingOfflineData] = useState(false);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(emptyPlan);
  const [saving, setSaving] = useState(false);

  const fetch = async () => {
    setLoading(true);
    const [plansRes, categoriesRes] = await Promise.all([
      fetchAdminPlans(),
      fetchAdminCategories(),
    ]);
    setPlans(plansRes.plans || []);
    setCategories(categoriesRes.categories || []);
    setUsingOfflineData(plansRes.offline || categoriesRes.offline);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const openCreate = () => { setForm(emptyPlan); setModal('create'); };
  const openEdit = (plan) => {
    setForm({
      ...plan,
      category: plan.category?._id || plan.category || '',
      features: (plan.features || []).join('\n'),
      durationPricing: plan.durationPricing?.length ? plan.durationPricing : emptyPlan.durationPricing,
    });
    setModal('edit');
  };

  const handleSave = async () => {
    if (!form.name?.trim()) {
      alert('Plan name required');
      return;
    }
    setSaving(true);
    try {
      await saveAdminPlan(form, modal);
      setModal(null);
      fetch();
    } catch (err) {
      alert(err.message || err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this plan?')) return;
    await deleteAdminPlan(id);
    fetch();
  };

  const handleDuplicate = async (id) => {
    await duplicateAdminPlan(id);
    fetch();
  };

  const updatePricing = (index, field, value) => {
    const updated = [...form.durationPricing];
    updated[index] = {
      ...updated[index],
      [field]: ['months', 'originalPrice', 'offerPrice', 'discount', 'stock'].includes(field) ? Number(value) : value,
    };
    setForm({ ...form, durationPricing: updated });
  };

  const addPricing = () => {
    setForm({
      ...form,
      durationPricing: [...form.durationPricing, { months: 3, label: '3 Months', originalPrice: 0, offerPrice: 0, discount: 0, stock: 100, isAvailable: true }],
    });
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'type', label: 'Type', render: (r) => <span className="capitalize">{r.type}</span> },
    {
      key: 'price',
      label: '1M Price',
      render: (r) => {
        const oneMonth = r.durationPricing?.find((d) => d.months === 1) || r.durationPricing?.[0];
        return oneMonth ? `₹${oneMonth.offerPrice}` : '-';
      },
    },
    { key: 'status', label: 'Status', render: (r) => <span className="capitalize">{r.status}</span> },
    {
      key: 'actions', label: 'Actions',
      render: (r) => (
        <div className="flex gap-2">
          <button type="button" onClick={() => openEdit(r)} className="p-1.5 rounded-lg hover:bg-white/10" title="Edit price"><FiEdit2 className="w-4 h-4" /></button>
          <button type="button" onClick={() => handleDuplicate(r._id)} className="p-1.5 rounded-lg hover:bg-white/10"><FiCopy className="w-4 h-4" /></button>
          <button type="button" onClick={() => handleDelete(r._id)} className="p-1.5 rounded-lg hover:bg-red-400/10 text-red-400"><FiTrash2 className="w-4 h-4" /></button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-display font-bold">Plans</h2>
        <div className="flex gap-2">
          <button type="button" onClick={fetch} className="btn-outline text-sm py-2 px-4">Refresh</button>
          <button type="button" onClick={openCreate} className="btn-primary flex items-center gap-2 text-sm"><FiPlus /> Add Plan</button>
        </div>
      </div>

      {usingOfflineData && (
        <div className="glass-card mb-6 border border-green-400/30 text-sm text-green-200">
          Plans Firebase cloud par save hain. Price change karo → Save → site par turant update hoga (sab browsers par).
        </div>
      )}

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
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="input-field">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <textarea value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} placeholder="Features (one per line)" rows={3} className="input-field resize-none" />

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="font-medium">Duration Pricing (Price yahan change karo)</label>
                  <button type="button" onClick={addPricing} className="text-sm text-primary-light">+ Add</button>
                </div>
                {form.durationPricing.map((dp, i) => (
                  <div key={i} className="grid grid-cols-3 md:grid-cols-6 gap-2 mb-2">
                    <input value={dp.label} onChange={(e) => updatePricing(i, 'label', e.target.value)} placeholder="Label" className="input-field text-sm py-2" />
                    <input type="number" value={dp.months} onChange={(e) => updatePricing(i, 'months', e.target.value)} placeholder="Months" className="input-field text-sm py-2" />
                    <input type="number" value={dp.originalPrice} onChange={(e) => updatePricing(i, 'originalPrice', e.target.value)} placeholder="Original ₹" className="input-field text-sm py-2" />
                    <input type="number" value={dp.offerPrice} onChange={(e) => updatePricing(i, 'offerPrice', e.target.value)} placeholder="Offer ₹" className="input-field text-sm py-2" />
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