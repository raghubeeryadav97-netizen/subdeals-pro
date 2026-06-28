import { useEffect, useState } from 'react';
import { FiDownload } from 'react-icons/fi';
import DataTable from '../../components/admin/DataTable';
import api from '../../api/axios';
import { useSelector } from 'react-redux';

const orderStatuses = ['pending', 'confirmed', 'completed', 'cancelled', 'refunded'];
const paymentStatuses = ['pending', 'uploaded', 'approved', 'rejected', 'refunded'];

export default function AdminOrders() {
  const currency = useSelector((state) => state.settings.data?.currency_symbol) || '₹';
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch = () => {
    setLoading(true);
    api.get('/orders/admin/all').then(({ data }) => setOrders(data.orders || [])).finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const updateStatus = async (id, field, value) => {
    const body = field === 'orderStatus' ? { orderStatus: value } : { paymentStatus: value };
    await api.put(`/orders/${id}/status`, body);
    fetch();
  };

  const downloadInvoice = async (id, orderId) => {
    try {
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
      <DataTable columns={columns} data={orders} loading={loading} searchKeys={['orderId', 'customerName', 'planName']} pageSize={15} />
    </div>
  );
}