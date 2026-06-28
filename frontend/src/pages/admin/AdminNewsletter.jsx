import { useEffect, useState } from 'react';
import { FiDownload } from 'react-icons/fi';
import DataTable from '../../components/admin/DataTable';
import api from '../../api/axios';

export default function AdminNewsletter() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/newsletter').then(({ data }) => setSubscribers(data.subscribers || [])).finally(() => setLoading(false));
  }, []);

  const exportCsv = async () => {
    try {
      const { data } = await api.get('/newsletter/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = 'newsletter-subscribers.csv';
      link.click();
    } catch {
      alert('Export failed');
    }
  };

  const columns = [
    { key: 'email', label: 'Email' },
    { key: 'isActive', label: 'Active', render: (r) => r.isActive !== false ? <span className="text-green-400">Yes</span> : <span className="text-red-400">No</span> },
    { key: 'createdAt', label: 'Subscribed', render: (r) => new Date(r.createdAt).toLocaleDateString() },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-display font-bold">Newsletter Subscribers</h2>
        <button type="button" onClick={exportCsv} className="btn-primary flex items-center gap-2 text-sm">
          <FiDownload /> Export CSV
        </button>
      </div>
      <DataTable columns={columns} data={subscribers} loading={loading} searchKeys={['email']} />
    </div>
  );
}