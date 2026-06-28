import { getSettings, updateSettings, updateSetting } from '../services/settingsService.js';

export const getPublicSettings = async (req, res) => {
  const settings = await getSettings();
  const publicKeys = ['site_name', 'site_logo', 'site_favicon', 'hero_banner', 'theme', 'whatsapp_number', 'support_email', 'currency', 'currency_symbol', 'payment_methods', 'upi_id', 'bank_details', 'qr_code_image', 'social_links', 'seo', 'maintenance_mode', 'company'];
  const publicSettings = {};
  publicKeys.forEach((k) => { if (settings[k] !== undefined) publicSettings[k] = settings[k]; });
  res.json({ success: true, settings: publicSettings });
};

export const getAllSettings = async (req, res) => {
  const settings = await getSettings();
  res.json({ success: true, settings });
};

export const updateSettingsHandler = async (req, res) => {
  await updateSettings(req.body);
  res.json({ success: true, message: 'Settings updated' });
};

export const updateSingleSetting = async (req, res) => {
  await updateSetting(req.params.key, req.body.value, req.body.group);
  res.json({ success: true, message: 'Setting updated' });
};