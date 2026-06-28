import { useEffect, useState } from 'react';
import { FiDatabase, FiDownload, FiRefreshCw } from 'react-icons/fi';
import DataTable from '../../components/admin/DataTable';
import api from '../../api/axios';

export default function AdminBackup() {
  const [backups, setBackups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  const fetch = () => {
    setLoading(true);
    api.get('/backup').then(({ data }) => setBackups(data.backups || [])).finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, []);

  const createBackup = async () => {
    setCreating(true);
    try {
      await api.post('/backup');
      fetch();
      alert('Backup created successfully');
    } catch (err) {
      alert(err.response?.data?.message || 'Backup failed');
    } finally {
      setCreating(false);
    }
  };

  const restoreBackup = async (filename) => {
    if (!confirm(`Restore from ${filename}? This will overwrite current data.`)) return;
    try {
      await api.post('/backup/restore', { filename });
      alert('Restore initiated successfully');
    } catch (err) {
      alert(err.response?.data?.message || 'Restore failed');
    }
  };

  const columns = [
    { key: 'filename', label: 'Filename' },
    { key: 'size', label: 'Size', render: (r) => r.size ? `${(r.size / 1024 / 1024).toFixed(2)} MB` : '-' },
    { key: 'createdAt', label: 'Created', render: (r) => new Date(r.createdAt).toLocaleString() },
    {
      key: 'actions', label: 'Actions',
      render: (r) => (
        <button type="button" onClick={() => restoreBackup(r.filename)} className="text-primary-light text-xs hover:underline flex items-center gap-1">
          <FiRefreshCw className="w-3 h-3" /> Restore
        </button>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-display font-bold">Database Backup</h2>
        <button type="button" onClick={createBackup} disabled={creating} className="btn-primary flex items-center gap-2 text-sm">
          <FiDatabase /> {creating ? 'Creating...' : 'Create Backup'}
        </button>
      </div>

      <div className="glass-card mb-6 p-4 text-sm text-gray-400">
        <FiDownload className="inline mr-2" />
        Backups are stored securely. Create regular backups before major changes. Restore will overwrite current database.
      </div>

      <DataTable columns={columns} data={backups} loading={loading} searchable={false} />
    </div>
  );
}