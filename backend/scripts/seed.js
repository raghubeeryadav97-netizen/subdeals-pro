import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Plan from '../models/Plan.js';
import Coupon from '../models/Coupon.js';
import Blog from '../models/Blog.js';
import Review from '../models/Review.js';
import { initDefaultSettings } from '../services/settingsService.js';
import { slugify } from '../utils/slugify.js';
import { generateReferralCode } from '../utils/generateToken.js';

dotenv.config();

const durationPricing = (prices) => [
  { months: 1, label: '1 Month', originalPrice: prices[0] + 30, offerPrice: prices[0], discount: Math.round((30 / (prices[0] + 30)) * 100), stock: 100 },
  { months: 3, label: '3 Months', originalPrice: prices[1] + 50, offerPrice: prices[1], discount: 10, stock: 80 },
  { months: 6, label: '6 Months', originalPrice: prices[2] + 80, offerPrice: prices[2], discount: 15, stock: 60 },
  { months: 12, label: '12 Months', originalPrice: prices[3] + 150, offerPrice: prices[3], discount: 20, stock: 40 },
];

export const seedDatabase = async ({ disconnect = true } = {}) => {
  if (mongoose.connection.readyState === 0) await connectDB();
  await initDefaultSettings();

  await Promise.all([User.deleteMany(), Category.deleteMany(), Plan.deleteMany(), Coupon.deleteMany(), Blog.deleteMany(), Review.deleteMany()]);

  const admin = await User.create({
    name: 'Admin',
    email: 'admin@subdealspro.com',
    password: 'Admin@123',
    role: 'admin',
    isVerified: true,
    referralCode: generateReferralCode('Admin'),
  });

  const categories = await Category.insertMany([
    { name: 'Streaming', slug: 'streaming', type: 'entertainment', icon: '🎬', sortOrder: 1, description: 'Premium streaming services' },
    { name: 'Music', slug: 'music', type: 'entertainment', icon: '🎵', sortOrder: 2, description: 'Music streaming platforms' },
    { name: 'AI Tools', slug: 'ai-tools', type: 'ai', icon: '🤖', sortOrder: 3, description: 'AI powered tools' },
    { name: 'Design', slug: 'design', type: 'ai', icon: '🎨', sortOrder: 4, description: 'Design and creative tools' },
  ]);

  const entertainmentPlans = [
    { name: 'Netflix', prices: [169, 489, 969, 1699], cat: 0, featured: true, popular: true, trending: true },
    { name: 'Prime Video', prices: [149, 429, 849, 1499], cat: 0, popular: true },
    { name: 'Disney+ Hotstar', prices: [149, 399, 799, 1399], cat: 0, trending: true },
    { name: 'Sony LIV', prices: [99, 299, 599, 999], cat: 0 },
    { name: 'Zee5', prices: [99, 279, 549, 949], cat: 0 },
    { name: 'Spotify Premium', prices: [119, 349, 649, 1149], cat: 1, featured: true, popular: true },
    { name: 'YouTube Premium', prices: [129, 379, 699, 1199], cat: 1, trending: true },
    { name: 'Apple Music', prices: [99, 289, 549, 949], cat: 1 },
    { name: 'Crunchyroll', prices: [79, 229, 449, 799], cat: 0 },
  ];

  const aiPlans = [
    { name: 'ChatGPT Plus', prices: [1999, 5499, 9999, 17999], cat: 2, featured: true, popular: true, trending: true },
    { name: 'Gemini Advanced', prices: [1899, 5199, 9499, 16999], cat: 2, trending: true },
    { name: 'Claude Pro', prices: [1999, 5499, 9999, 17999], cat: 2, popular: true },
    { name: 'Perplexity Pro', prices: [1499, 4199, 7499, 13499], cat: 2 },
    { name: 'Midjourney', prices: [999, 2799, 4999, 8999], cat: 2, featured: true },
    { name: 'Canva Pro', prices: [499, 1399, 2499, 4499], cat: 3, popular: true },
    { name: 'Cursor Pro', prices: [1999, 5499, 9999, 17999], cat: 2, trending: true },
    { name: 'GitHub Copilot', prices: [999, 2799, 4999, 8999], cat: 2 },
    { name: 'ElevenLabs', prices: [799, 2199, 3999, 6999], cat: 2 },
  ];

  const plans = [];
  for (const p of entertainmentPlans) {
    plans.push({
      name: p.name, slug: slugify(p.name), type: 'entertainment', category: categories[p.cat]._id,
      description: `Get ${p.name} premium subscription at the best price in India. Instant delivery via WhatsApp.`,
      features: ['Instant Delivery', 'Full Warranty', '24/7 Support', 'Secure Payment', 'Renewal Reminder'],
      durationPricing: durationPricing(p.prices),
      isFeatured: p.featured || false, isPopular: p.popular || false, isTrending: p.trending || false,
      isRecommended: p.featured || false, deliveryTime: '5-30 minutes',
    });
  }
  for (const p of aiPlans) {
    plans.push({
      name: p.name, slug: slugify(p.name), type: 'ai', category: categories[p.cat]._id,
      description: `Premium ${p.name} subscription with full access. Best prices guaranteed.`,
      features: ['Full Access', 'Instant Activation', 'Premium Support', 'Money Back Guarantee'],
      durationPricing: durationPricing(p.prices),
      isFeatured: p.featured || false, isPopular: p.popular || false, isTrending: p.trending || false,
      isRecommended: p.featured || false, deliveryTime: 'Instant',
    });
  }
  const createdPlans = await Plan.insertMany(plans);

  await Coupon.insertMany([
    { code: 'WELCOME10', discountType: 'percentage', discountValue: 10, maxDiscount: 200, usageLimit: 100, description: '10% off for new customers' },
    { code: 'FLAT50', discountType: 'flat', discountValue: 50, minPurchase: 200, usageLimit: 50, description: 'Flat ₹50 off' },
    { code: 'AI20', discountType: 'percentage', discountValue: 20, maxDiscount: 500, categories: [categories[2]._id], description: '20% off AI plans' },
  ]);

  await Blog.insertMany([
    { title: 'How to Save Money on Streaming Subscriptions', slug: 'save-money-streaming', content: '<p>Discover the best ways to save on Netflix, Prime Video, and more with SubDeals Pro.</p>', excerpt: 'Save big on streaming', category: 'Tips', tags: ['streaming', 'savings'], status: 'published', author: admin._id, seoTitle: 'Save Money on Streaming', seoDescription: 'Tips to save on streaming subscriptions' },
    { title: 'Top AI Tools for 2026', slug: 'top-ai-tools-2026', content: '<p>ChatGPT, Claude, Gemini - which AI tool is right for you?</p>', excerpt: 'Best AI tools guide', category: 'AI', tags: ['ai', 'chatgpt'], status: 'published', author: admin._id },
  ]);

  await Review.insertMany([
    { name: 'Rahul Sharma', rating: 5, review: 'Amazing service! Got my Netflix subscription within minutes.', status: 'approved', plan: createdPlans[0]._id, isVerifiedPurchase: true },
    { name: 'Priya Patel', rating: 5, review: 'Best prices for ChatGPT Plus. Highly recommended!', status: 'approved', plan: createdPlans[9]._id, isVerifiedPurchase: true },
    { name: 'Amit Kumar', rating: 4, review: 'Great support team. Spotify activated quickly.', status: 'approved', plan: createdPlans[5]._id, isVerifiedPurchase: true },
  ]);

  console.log('Seed completed!');
  console.log('Admin: admin@subdealspro.com / Admin@123');
  if (disconnect) await mongoose.disconnect();
};

const isMain = process.argv[1]?.includes('seed.js');
if (isMain) seedDatabase().catch((e) => { console.error(e); process.exit(1); });