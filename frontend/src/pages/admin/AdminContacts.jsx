import { useEffect, useState } from 'react';
import DataTable from '../../components/admin/DataTable';
import api from '../../api/axios';

export default function AdminContacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const fetch = () => {
    setLoading(true);
    api.get('/contact').then(({ data }) => setContacts(data.contacts || [])).finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const updateStatus = async (id, status) => {
    await api.put(`/contact/${id}`, { status });
    fetch();
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'subject', label: 'Subject', render: (r) => r.subject || '-' },
    {
      key: 'status', label: 'Status',
      render: (r) => (
        <select value={r.status || 'new'} onChange={(e) => updateStatus(r._id, e.target.value)} className="input-field text-xs py-1 w-28">
          <option value="new">New</option>
          <option value="read">Read</option>
          <option value="replied">Replied</option>
          <option value="archived">Archived</option>
        </select>
      ),
    },
    { key: 'createdAt', label: 'Date', render: (r) => new Date(r.createdAt).toLocaleDateString() },
    {
      key: 'actions', label: 'View',
      render: (r) => (
        <button type="button" onClick={() => setSelected(r)} className="text-primary-light text-xs hover:underline">View</button>
      ),
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-display font-bold mb-6">Contact Messages</h2>
      <DataTable columns={columns} data={contacts} loading={loading} searchKeys={['name', 'email', 'subject']} />

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70" onClick={() => setSelected(null)}>
          <div className="glass w-full max-w-lg p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold mb-2">{selected.name}</h3>
            <p className="text-sm text-gray-400 mb-4">{selected.email} • {selected.subject}</p>
            <p className="text-gray-300 whitespace-pre-wrap">{selected.message}</p>
            <button type="button" onClick={() => setSelected(null)} className="btn-outline mt-4">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}