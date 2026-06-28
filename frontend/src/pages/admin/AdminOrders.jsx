import { useEffect, useState } from 'react';
import { FiDownload } from 'react-icons/fi';
import DataTable from '../../components/admin/DataTable';
import { useSelector } from 'react-redux';
import { fetchAdminOrders, updateAdminOrderStatus } from '../../api/orders';

const orderStatuses = ['pending', 'confirmed', 'completed', 'cancelled', 'refunded'];
const paymentStatuses = ['pending', 'uploaded', 'approved', 'rejected', 'refunded'];

export default function AdminOrders() {
  const currency = useSelector((state) => state.settings.data?.currency_symbol) || '₹';
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usingOfflineData, setUsingOfflineData] = useState(false);

  const fetch = async () => {
    setLoading(true);
    const { orders: nextOrders, offline } = await fetchAdminOrders();
    setOrders(nextOrders || []);
    setUsingOfflineData(offline);
    setLoading(false);
  };

  useEffect(() => { fetch(); }, []);

  const updateStatus = async (id, field, value) => {
    const body = field === 'orderStatus' ? { orderStatus: value } : { paymentStatus: value };
    await updateAdminOrderStatus(id, body);
    fetch();
  };

  const downloadInvoice = async (id, orderId) => {
    if (String(id).startsWith('SDP-') || String(id).startsWith('offline-')) {
      alert('Offline order invoice — Render API connect hone ke baad PDF download hoga.');
      return;
    }

    try {
      const api = (await import('../../api/axios')).default;
      const { data } = await api.get(`/orders/${id}/invoice`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${orderId}.pdf`;
      link.click();
    } catch {
      alert('Invoice download failed');
    }
  };

  const columns = [
    { key: 'orderId', label: 'Order ID' },
    { key: 'customerName', label: 'Customer' },
    { key: 'planName', label: 'Plan' },
    { key: 'finalPrice', label: 'Amount', render: (r) => `${currency}${r.finalPrice}` },
    {
      key: 'orderStatus', label: 'Order Status',
      render: (r) => (
        <select value={r.orderStatus} onChange={(e) => updateStatus(r._id, 'orderStatus', e.target.value)} className="input-field text-xs py-1 w-28">
          {orderStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      ),
    },
    {
      key: 'paymentStatus', label: 'Payment',
      render: (r) => (
        <select value={r.paymentStatus} onChange={(e) => updateStatus(r._id, 'paymentStatus', e.target.value)} className="input-field text-xs py-1 w-28">
          {paymentStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      ),
    },
    {
      key: 'actions', label: 'Invoice',
      render: (r) => (
        <button type="button" onClick={() => downloadInvoice(r._id, r.orderId)} className="p-1.5 rounded-lg hover:bg-white/10" title="Download Invoice">
          <FiDownload className="w-4 h-4" />
        </button>
      ),
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-display font-bold mb-6">Orders</h2>
      {usingOfflineData && (
        <div className="glass-card mb-6 border border-green-400/30 text-sm text-green-200">
          Orders Firebase cloud par synced hain — kisi bhi browser se admin login karke dekh sakte ho.
        </div>
      )}
      <DataTable columns={columns} data={orders} loading={loading} searchKeys={['orderId', 'customerName', 'planName']} pageSize={15} />
    </div>
  );
}