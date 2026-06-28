import { useEffect, useState } from 'react';
import { FiDownload } from 'react-icons/fi';
import DataTable from '../../components/admin/DataTable';
import { useSelector } from 'react-redux';
import { fetchAdminOrders, updateAdminOrderStatus } from '../../api/orders';
import { downloadOrderInvoice, isOfflineOrder } from '../../utils/generateInvoice';

const orderStatuses = ['pending', 'confirmed', 'completed', 'cancelled', 'refunded'];
const paymentStatuses = ['pending', 'uploaded', 'approved', 'rejected', 'refunded'];

export default function AdminOrders() {
  const settings = useSelector((state) => state.settings.data);
  const currency = settings?.currency_symbol || '₹';
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

  const downloadInvoice = async (order) => {
    if (isOfflineOrder(order)) {
      downloadOrderInvoice(order, settings);
      return;
    }

    try {
      const api = (await import('../../api/axios')).default;
      const { data } = await api.get(`/orders/${order._id}/invoice`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-${order.orderId}.pdf`;
      link.click();
    } catch {
      downloadOrderInvoice(order, settings);
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
        <button type="button" onClick={() => downloadInvoice(r)} className="p-1.5 rounded-lg hover:bg-white/10" title="Download Invoice">
          <FiDownload className="w-4 h-4" />
        </button>
      ),
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6 gap-4">
        <h2 className="text-2xl font-display font-bold">Orders</h2>
        <button type="button" onClick={fetch} className="btn-outline text-sm py-2 px-4">
          Refresh
        </button>
      </div>
      {usingOfflineData && (
        <div className="glass-card mb-6 border border-green-400/30 text-sm text-green-200">
          Orders Firebase cloud par synced hain — kisi bhi browser se admin login karke dekh sakte ho.
        </div>
      )}
      <DataTable columns={columns} data={orders} loading={loading} searchKeys={['orderId', 'customerName', 'planName']} pageSize={15} />
    </div>
  );
}