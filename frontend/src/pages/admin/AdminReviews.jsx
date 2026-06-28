import { useEffect, useState } from 'react';
import DataTable from '../../components/admin/DataTable';
import { fetchAdminReviews, updateAdminReview, deleteAdminReview } from '../../api/reviews';

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingOfflineData, setUsingOfflineData] = useState(false);

  const fetch = async () => {
    setLoading(true);
    const { reviews: nextReviews, offline } = await fetchAdminReviews();
    setReviews(nextReviews || []);
    setUsingOfflineData(offline);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const updateStatus = async (id, status) => {
    await updateAdminReview(id, { status });
    fetch();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete review?')) return;
    await deleteAdminReview(id);
    fetch();
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'planName', label: 'Plan' },
    { key: 'rating', label: 'Rating', render: (r) => `${r.rating}/5` },
    { key: 'comment', label: 'Comment', render: (r) => <span className="max-w-xs truncate block">{r.comment || r.review}</span> },
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
      <div className="flex items-center justify-between mb-6 gap-4">
        <h2 className="text-2xl font-display font-bold">Reviews</h2>
        <button type="button" onClick={fetch} className="btn-outline text-sm py-2 px-4">Refresh</button>
      </div>
      {usingOfflineData && (
        <div className="glass-card mb-6 border border-green-400/30 text-sm text-green-200">
          Reviews Firebase cloud par synced hain. Approve karo to site par dikhenge.
        </div>
      )}
      <DataTable columns={columns} data={reviews} loading={loading} searchKeys={['name', 'planName']} />
    </div>
  );
}