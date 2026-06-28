import { useEffect, useState } from 'react';
import { FiSave } from 'react-icons/fi';
import api from '../../api/axios';
import { useDispatch } from 'react-redux';
import { fetchSettings } from '../../store/slices/settingsSlice';

export default function AdminSettings() {
  const dispatch = useDispatch();
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeGroup, setActiveGroup] = useState('general');

  useEffect(() => {
    api.get('/settings').then(({ data }) => {
      setSettings(data.settings || {});
    }).finally(() => setLoading(false));
  }, []);

  const updateField = (key, value) => setSettings((prev) => ({ ...prev, [key]: value }));

  const updateNested = (parent, key, value) => {
    setSettings((prev) => ({ ...prev, [parent]: { ...prev[parent], [key]: value } }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.put('/settings', settings);
      dispatch(fetchSettings());
      alert('Settings saved successfully');
    } catch (err) {
      alert(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const groups = [
    { key: 'general', label: 'General' },
    { key: 'payment', label: 'Payment' },
    { key: 'social', label: 'Social' },
    { key: 'seo', label: 'SEO' },
    { key: 'company', label: 'Company' },
  ];

  if (loading) return <p className="text-gray-400">Loading settings...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-display font-bold">Settings</h2>
        <button type="button" onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2 text-sm">
          <FiSave /> {saving ? 'Saving...' : 'Save All'}
        </button>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto">
        {groups.map((g) => (
          <button
            key={g.key}
            type="button"
            onClick={() => setActiveGroup(g.key)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap ${
              activeGroup === g.key ? 'bg-primary/20 text-primary-light border border-primary/30' : 'glass text-gray-400'
            }`}
          >
            {g.label}
          </button>
        ))}
      </div>

      <div className="glass-card space-y-4">
        {activeGroup === 'general' && (
          <>
            <input value={settings.site_name || ''} onChange={(e) => updateField('site_name', e.target.value)} placeholder="Site Name" className="input-field" />
            <input value={settings.whatsapp_number || ''} onChange={(e) => updateField('whatsapp_number', e.target.value)} placeholder="WhatsApp Number" className="input-field" />
            <input value={settings.support_email || ''} onChange={(e) => updateField('support_email', e.target.value)} placeholder="Support Email" className="input-field" />
            <input value={settings.currency_symbol || '₹'} onChange={(e) => updateField('currency_symbol', e.target.value)} placeholder="Currency Symbol" className="input-field" />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={settings.maintenance_mode || false} onChange={(e) => updateField('maintenance_mode', e.target.checked)} />
              Maintenance Mode
            </label>
          </>
        )}

        {activeGroup === 'payment' && (
          <>
            <input value={settings.upi_id || ''} onChange={(e) => updateField('upi_id', e.target.value)} placeholder="UPI ID" className="input-field" />
            <input value={settings.qr_code_image || ''} onChange={(e) => updateField('qr_code_image', e.target.value)} placeholder="QR Code Image URL" className="input-field" />
            <input value={settings.bank_details?.accountName || ''} onChange={(e) => updateNested('bank_details', 'accountName', e.target.value)} placeholder="Account Name" className="input-field" />
            <input value={settings.bank_details?.accountNumber || ''} onChange={(e) => updateNested('bank_details', 'accountNumber', e.target.value)} placeholder="Account Number" className="input-field" />
            <input value={settings.bank_details?.ifsc || ''} onChange={(e) => updateNested('bank_details', 'ifsc', e.target.value)} placeholder="IFSC Code" className="input-field" />
            <input value={settings.bank_details?.bankName || ''} onChange={(e) => updateNested('bank_details', 'bankName', e.target.value)} placeholder="Bank Name" className="input-field" />
          </>
        )}

        {activeGroup === 'social' && (
          <>
            {['facebook', 'twitter', 'instagram', 'youtube', 'linkedin'].map((platform) => (
              <input
                key={platform}
                value={settings.social_links?.[platform] || ''}
                onChange={(e) => updateNested('social_links', platform, e.target.value)}
                placeholder={`${platform} URL`}
                className="input-field capitalize"
              />
            ))}
          </>
        )}

        {activeGroup === 'seo' && (
          <>
            <input value={settings.seo?.title || ''} onChange={(e) => updateNested('seo', 'title', e.target.value)} placeholder="SEO Title" className="input-field" />
            <textarea value={settings.seo?.description || ''} onChange={(e) => updateNested('seo', 'description', e.target.value)} placeholder="SEO Description" rows={3} className="input-field resize-none" />
            <input value={settings.seo?.keywords || ''} onChange={(e) => updateNested('seo', 'keywords', e.target.value)} placeholder="SEO Keywords" className="input-field" />
          </>
        )}

        {activeGroup === 'company' && (
          <>
            <input value={settings.company?.name || ''} onChange={(e) => updateNested('company', 'name', e.target.value)} placeholder="Company Name" className="input-field" />
            <input value={settings.company?.address || ''} onChange={(e) => updateNested('company', 'address', e.target.value)} placeholder="Address" className="input-field" />
            <input value={settings.company?.phone || ''} onChange={(e) => updateNested('company', 'phone', e.target.value)} placeholder="Phone" className="input-field" />
            <input value={settings.company?.gst || ''} onChange={(e) => updateNested('company', 'gst', e.target.value)} placeholder="GST Number" className="input-field" />
          </>
        )}
      </div>
    </div>
  );
}