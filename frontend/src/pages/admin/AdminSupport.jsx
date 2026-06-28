import { useEffect, useState } from 'react';
import DataTable from '../../components/admin/DataTable';
import api from '../../api/axios';

export default function AdminSupport() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [reply, setReply] = useState('');

  const fetch = () => {
    setLoading(true);
    api.get('/support/admin/all').then(({ data }) => setTickets(data.tickets || [])).finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const updateStatus = async (id, status) => {
    await api.put(`/support/${id}`, { status });
    fetch();
  };

  const sendReply = async () => {
    if (!reply.trim() || !selected) return;
    await api.post(`/support/${selected._id}/reply`, { message: reply });
    setReply('');
    setSelected(null);
    fetch();
  };

  const columns = [
    { key: 'ticketId', label: 'Ticket ID' },
    { key: 'subject', label: 'Subject' },
    { key: 'customerName', label: 'Customer', render: (r) => r.customerName || r.user?.name || 'Guest' },
    { key: 'priority', label: 'Priority', render: (r) => <span className="capitalize">{r.priority}</span> },
    {
      key: 'status', label: 'Status',
      render: (r) => (
        <select value={r.status} onChange={(e) => updateStatus(r._id, e.target.value)} className="input-field text-xs py-1 w-28">
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>
      ),
    },
    {
      key: 'actions', label: 'View',
      render: (r) => (
        <button type="button" onClick={() => setSelected(r)} className="text-primary-light text-xs hover:underline">View</button>
      ),
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-display font-bold mb-6">Support Tickets</h2>
      <DataTable columns={columns} data={tickets} loading={loading} searchKeys={['ticketId', 'subject', 'customerName']} />

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70" onClick={() => setSelected(null)}>
          <div className="glass w-full max-w-lg p-6 max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold mb-2">{selected.subject}</h3>
            <p className="text-sm text-gray-400 mb-4">{selected.ticketId} • {selected.customerName}</p>
            <p className="text-gray-300 mb-4">{selected.message}</p>

            {selected.replies?.length > 0 && (
              <div className="space-y-2 mb-4 border-t border-white/10 pt-4">
                {selected.replies.map((r, i) => (
                  <div key={i} className="bg-white/5 p-3 rounded-lg text-sm">
                    <p className="text-gray-300">{r.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{new Date(r.createdAt).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}

            <textarea value={reply} onChange={(e) => setReply(e.target.value)} placeholder="Type your reply..." rows={3} className="input-field resize-none mb-3" />
            <div className="flex gap-3">
              <button type="button" onClick={sendReply} className="btn-primary text-sm">Send Reply</button>
              <button type="button" onClick={() => setSelected(null)} className="btn-outline text-sm">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}