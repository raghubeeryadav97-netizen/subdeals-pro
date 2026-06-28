import Settings from '../models/Settings.js';

const defaultSettings = {
  site_name: 'SubDeals Pro',
  site_logo: '',
  site_favicon: '',
  hero_banner: '',
  theme: 'dark',
  whatsapp_number: process.env.ADMIN_WHATSAPP || '916381492284',
  support_email: process.env.ADMIN_EMAIL || 'support@subdealspro.com',
  currency: 'INR',
  currency_symbol: '₹',
  timezone: 'Asia/Kolkata',
  maintenance_mode: false,
  payment_methods: ['upi', 'qr', 'bank_transfer', 'razorpay', 'stripe', 'manual'],
  upi_id: '',
  bank_details: { accountName: '', accountNumber: '', ifsc: '', bankName: '' },
  qr_code_image: '',
  social_links: { facebook: '', twitter: '', instagram: '', youtube: '', linkedin: '' },
  seo: { title: 'SubDeals Pro - Premium Subscriptions', description: 'Get premium entertainment and AI subscriptions at best prices', keywords: 'netflix, spotify, chatgpt, subscriptions' },
  smtp: { host: '', port: 587, user: '', pass: '', from: '' },
  whatsapp_enabled: false,
  whatsapp_templates: {
    welcome: 'Hello {{customerName}}, welcome to SubDeals Pro!',
    order_received: 'Hi {{customerName}}, we received your order for {{planName}} ({{duration}}). Order ID: {{orderId}}',
    payment_pending: 'Hi {{customerName}}, your payment for {{planName}} is pending. Amount: {{price}}',
    payment_approved: 'Hi {{customerName}}, payment approved! Your {{planName}} subscription is being processed.',
    payment_rejected: 'Hi {{customerName}}, your payment was rejected. Please contact support.',
    order_completed: 'Hi {{customerName}}, your {{planName}} ({{duration}}) is now active! Expires: {{expiryDate}}',
    renewal_reminder: 'Hi {{customerName}}, your {{planName}} expires on {{expiryDate}}. Renew now: {{renewalLink}}',
    subscription_expiring: 'Hi {{customerName}}, {{planName}} expiring in {{daysRemaining}} days.',
    subscription_expired: 'Hi {{customerName}}, your {{planName}} has expired. Renew: {{renewalLink}}',
    coupon_offer: 'Hi {{customerName}}, use code {{coupon}} for {{discount}} off!',
    festival_offer: 'Hi {{customerName}}, special festival offer on {{planName}}!',
    support_reply: 'Hi {{customerName}}, regarding your support ticket: {{message}}',
  },
  reminder_days: [30, 15, 7, 3, 1, 0, -1, -3, -7],
  loyalty: { bronze: 0, silver: 1000, gold: 5000, platinum: 10000, pointsPerRupee: 1 },
  referral_reward: 50,
  company: {
    name: process.env.COMPANY_NAME || 'SubDeals Pro',
    address: process.env.COMPANY_ADDRESS || 'Mumbai, India',
    gst: process.env.COMPANY_GST || '',
    phone: process.env.COMPANY_PHONE || '',
  },
};

let cache = null;
let cacheTime = 0;
const CACHE_TTL = 60000;

export const getSettings = async () => {
  const now = Date.now();
  if (cache && now - cacheTime < CACHE_TTL) return cache;

  const docs = await Settings.find();
  const settings = { ...defaultSettings };
  docs.forEach((doc) => {
    settings[doc.key] = doc.value;
  });
  cache = settings;
  cacheTime = now;
  return settings;
};

export const getSetting = async (key) => {
  const settings = await getSettings();
  return settings[key];
};

export const updateSetting = async (key, value, group = 'general') => {
  await Settings.findOneAndUpdate(
    { key },
    { key, value, group },
    { upsert: true, new: true }
  );
  cache = null;
};

export const updateSettings = async (updates) => {
  const ops = Object.entries(updates).map(([key, value]) =>
    Settings.findOneAndUpdate({ key }, { key, value }, { upsert: true, new: true })
  );
  await Promise.all(ops);
  cache = null;
};

export const initDefaultSettings = async () => {
  for (const [key, value] of Object.entries(defaultSettings)) {
    const exists = await Settings.findOne({ key });
    if (!exists) await Settings.create({ key, value });
  }
};