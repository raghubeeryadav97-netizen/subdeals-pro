import { useEffect, useState } from 'react';
import DataTable from '../../components/admin/DataTable';
import api from '../../api/axios';

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = () => {
    setLoading(true);
    api.get('/reviews/admin/all').then(({ data }) => setReviews(data.reviews || [])).finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const updateStatus = async (id, status) => {
    await api.put(`/reviews/${id}`, { status });
    fetch();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete review?')) return;
    await api.delete(`/reviews/${id}`);
    fetch();
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'planName', label: 'Plan' },
    { key: 'rating', label: 'Rating', render: (r) => `${r.rating}/5` },
    { key: 'comment', label: 'Comment', render: (r) => <span className="max-w-xs truncate block">{r.comment}</span> },
    {
      key: 'status', label: 'Status',
      render: (r) => (
        <select value={r.status} onChange={(e) => updateStatus(r._id, e.target.value)} className="input-field text-xs py-1 w-28">
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      ),
    },
    {
      key: 'actions', label: 'Actions',
      render: (r) => (
        <button type="button" onClick={() => handleDelete(r._id)} className="text-red-400 text-xs hover:underline">Delete</button>
      ),
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-display font-bold mb-6">Reviews</h2>
      <DataTable columns={columns} data={reviews} loading={loading} searchKeys={['name', 'planName']} />
    </div>
  );
}