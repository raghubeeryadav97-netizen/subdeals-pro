import { useEffect, useState } from 'react';
import { FiCheck, FiTrash2 } from 'react-icons/fi';
import DataTable from '../../components/admin/DataTable';
import api from '../../api/axios';

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = () => {
    setLoading(true);
    api.get('/notifications').then(({ data }) => setNotifications(data.notifications || [])).finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const markRead = async (id) => {
    await api.put(`/notifications/${id}/read`);
    fetch();
  };

  const markAllRead = async () => {
    await api.put('/notifications/read-all');
    fetch();
  };

  const handleDelete = async (id) => {
    await api.delete(`/notifications/${id}`);
    fetch();
  };

  const columns = [
    { key: 'title', label: 'Title' },
    { key: 'message', label: 'Message', render: (r) => <span className="max-w-xs truncate block">{r.message}</span> },
    { key: 'type', label: 'Type', render: (r) => <span className="capitalize">{r.type}</span> },
    { key: 'isRead', label: 'Read', render: (r) => r.isRead ? <span className="text-green-400">Yes</span> : <span className="text-yellow-400">No</span> },
    { key: 'createdAt', label: 'Date', render: (r) => new Date(r.createdAt).toLocaleString() },
    {
      key: 'actions', label: 'Actions',
      render: (r) => (
        <div className="flex gap-2">
          {!r.isRead && (
            <button type="button" onClick={() => markRead(r._id)} className="p-1.5 rounded-lg hover:bg-white/10" title="Mark read">
              <FiCheck className="w-4 h-4" />
            </button>
          )}
          <button type="button" onClick={() => handleDelete(r._id)} className="p-1.5 rounded-lg hover:bg-red-400/10 text-red-400">
            <FiTrash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-display font-bold">Notifications</h2>
        <button type="button" onClick={markAllRead} className="btn-outline text-sm">Mark All Read</button>
      </div>
      <DataTable columns={columns} data={notifications} loading={loading} searchKeys={['title', 'message']} />
    </div>
  );
}