import Plan from '../models/Plan.js';
import Blog from '../models/Blog.js';
import Category from '../models/Category.js';

export const getSitemap = async (req, res) => {
  const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  const [plans, blogs, categories] = await Promise.all([
    Plan.find({ status: 'active' }).select('slug updatedAt'),
    Blog.find({ status: 'published' }).select('slug updatedAt'),
    Category.find({ status: 'active' }).select('slug updatedAt'),
  ]);

  const staticPages = ['', 'entertainment', 'ai-plans', 'categories', 'pricing', 'faq', 'reviews', 'about', 'blog', 'contact', 'refund-policy', 'terms', 'privacy-policy'];

  let xml = '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';

  staticPages.forEach((page) => {
    xml += `<url><loc>${baseUrl}/${page}</loc><changefreq>weekly</changefreq><priority>${page === '' ? '1.0' : '0.8'}</priority></url>`;
  });

  plans.forEach((p) => { xml += `<url><loc>${baseUrl}/plans/${p.slug}</loc><lastmod>${p.updatedAt.toISOString()}</lastmod><priority>0.9</priority></url>`; });
  blogs.forEach((b) => { xml += `<url><loc>${baseUrl}/blog/${b.slug}</loc><lastmod>${b.updatedAt.toISOString()}</lastmod><priority>0.7</priority></url>`; });
  categories.forEach((c) => { xml += `<url><loc>${baseUrl}/categories/${c.slug}</loc><lastmod>${c.updatedAt.toISOString()}</lastmod><priority>0.8</priority></url>`; });

  xml += '</urlset>';
  res.set('Content-Type', 'application/xml');
  res.send(xml);
};

export const getRobots = (req, res) => {
  const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
  res.type('text/plain').send(`User-agent: *\nAllow: /\nDisallow: /admin/\nDisallow: /dashboard/\nSitemap: ${baseUrl}/api/seo/sitemap.xml`);
};