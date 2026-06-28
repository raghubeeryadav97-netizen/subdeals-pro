const pricing = (prices) => [
  { months: 1, label: '1 Month', originalPrice: prices[0] + 30, offerPrice: prices[0], discount: 15, stock: 100, isAvailable: true },
  { months: 3, label: '3 Months', originalPrice: prices[1] + 50, offerPrice: prices[1], discount: 10, stock: 80, isAvailable: true },
  { months: 6, label: '6 Months', originalPrice: prices[2] + 80, offerPrice: prices[2], discount: 15, stock: 60, isAvailable: true },
  { months: 12, label: '12 Months', originalPrice: prices[3] + 150, offerPrice: prices[3], discount: 20, stock: 40, isAvailable: true },
];

const entertainment = [
  { name: 'Netflix', slug: 'netflix', prices: [169, 489, 969, 1699], featured: true, popular: true, trending: true },
  { name: 'Prime Video', slug: 'prime-video', prices: [149, 429, 849, 1499], popular: true },
  { name: 'Disney+ Hotstar', slug: 'disney-hotstar', prices: [149, 399, 799, 1399], trending: true },
  { name: 'Sony LIV', slug: 'sony-liv', prices: [99, 299, 599, 999] },
  { name: 'Zee5', slug: 'zee5', prices: [99, 279, 549, 949] },
  { name: 'Spotify Premium', slug: 'spotify-premium', prices: [119, 349, 649, 1149], featured: true, popular: true },
  { name: 'YouTube Premium', slug: 'youtube-premium', prices: [129, 379, 699, 1199], trending: true },
  { name: 'Apple Music', slug: 'apple-music', prices: [99, 289, 549, 949] },
  { name: 'Crunchyroll', slug: 'crunchyroll', prices: [79, 229, 449, 799] },
];

const ai = [
  { name: 'ChatGPT Plus', slug: 'chatgpt-plus', prices: [1999, 5499, 9999, 17999], featured: true, popular: true, trending: true },
  { name: 'Gemini Advanced', slug: 'gemini-advanced', prices: [1899, 5199, 9499, 16999], trending: true },
  { name: 'Claude Pro', slug: 'claude-pro', prices: [1999, 5499, 9999, 17999], popular: true },
  { name: 'Perplexity Pro', slug: 'perplexity-pro', prices: [1499, 4199, 7499, 13499] },
  { name: 'Midjourney', slug: 'midjourney', prices: [999, 2799, 4999, 8999], featured: true },
  { name: 'Canva Pro', slug: 'canva-pro', prices: [499, 1399, 2499, 4499], popular: true },
  { name: 'Cursor Pro', slug: 'cursor-pro', prices: [1999, 5499, 9999, 17999], trending: true },
  { name: 'GitHub Copilot', slug: 'github-copilot', prices: [999, 2799, 4999, 8999] },
  { name: 'ElevenLabs', slug: 'elevenlabs', prices: [799, 2199, 3999, 6999] },
];

const makePlan = (p, type) => ({
  _id: p.slug,
  name: p.name,
  slug: p.slug,
  type,
  description: `Premium ${p.name} subscription at best price.`,
  features: ['Instant Delivery', '24/7 Support', 'Secure Payment'],
  logo: '',
  banner: '',
  category: { name: type === 'entertainment' ? 'Streaming' : 'AI Tools', type },
  durationPricing: pricing(p.prices),
  status: 'active',
  isFeatured: p.featured || false,
  isPopular: p.popular || false,
  isTrending: p.trending || false,
  deliveryTime: type === 'ai' ? 'Instant' : '5-30 minutes',
});

export const fallbackPlans = [
  ...entertainment.map((p) => makePlan(p, 'entertainment')),
  ...ai.map((p) => makePlan(p, 'ai')),
];

export const getFallbackPlans = (params = {}) => {
  let plans = [...fallbackPlans];
  if (params.type) plans = plans.filter((p) => p.type === params.type);
  if (params.featured === 'true') plans = plans.filter((p) => p.isFeatured);
  if (params.popular === 'true') plans = plans.filter((p) => p.isPopular);
  if (params.trending === 'true') plans = plans.filter((p) => p.isTrending);
  if (params.search) {
    const q = params.search.toLowerCase();
    plans = plans.filter((p) => p.name.toLowerCase().includes(q));
  }
  return plans;
};