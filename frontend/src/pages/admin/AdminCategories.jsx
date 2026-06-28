import { useEffect, useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import DataTable from '../../components/admin/DataTable';
import api from '../../api/axios';

const empty = { name: '', description: '', type: 'entertainment', icon: '', status: 'active' };

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(empty);

  const fetch = () => {
    setLoading(true);
    api.get('/categories/admin/all').then(({ data }) => setCategories(data.categories || [])).finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const handleSave = async () => {
    try {
      if (modal === 'edit') await api.put(`/categories/${form._id}`, form);
      else await api.post('/categories', form);
      setModal(null);
      fetch();
    } catch (err) {
      alert(err.response?.data?.message || 'Save failed');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete category?')) return;
    await api.delete(`/categories/${id}`);
    fetch();
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'slug', label: 'Slug' },
    { key: 'type', label: 'Type', render: (r) => <span className="capitalize">{r.type}</span> },
    { key: 'planCount', label: 'Plans', render: (r) => r.planCount || 0 },
    {
      key: 'actions', label: 'Actions',
      render: (r) => (
        <div className="flex gap-2">
          <button type="button" onClick={() => { setForm(r); setModal('edit'); }} className="p-1.5 rounded-lg hover:bg-white/10"><FiEdit2 className="w-4 h-4" /></button>
          <button type="button" onClick={() => handleDelete(r._id)} className="p-1.5 rounded-lg hover:bg-red-400/10 text-red-400"><FiTrash2 className="w-4 h-4" /></button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-display font-bold">Categories</h2>
        <button type="button" onClick={() => { setForm(empty); setModal('create'); }} className="btn-primary flex items-center gap-2 text-sm"><FiPlus /> Add Category</button>
      </div>
      <DataTable columns={columns} data={categories} loading={loading} searchKeys={['name']} />

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
          <div className="glass w-full max-w-md p-6">
            <h3 className="text-xl font-bold mb-4">{modal === 'edit' ? 'Edit' : 'Create'} Category</h3>
            <div className="space-y-4">
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name" className="input-field" />
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" rows={3} className="input-field resize-none" />
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="input-field">
                <option value="entertainment">Entertainment</option>
                <option value="ai">AI</option>
              </select>
              <input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="Icon (emoji or URL)" className="input-field" />
            </div>
            <div className="flex gap-3 mt-6">
              <button type="button" onClick={handleSave} className="btn-primary">Save</button>
              <button type="button" onClick={() => setModal(null)} className="btn-outline">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}