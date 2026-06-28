import api from './axios';
import { isOfflineApiMode } from '../utils/auth';
import { slugify } from '../utils/slugify';
import { getFallbackPlans } from '../data/fallbackPlans';
import { fallbackCategories } from '../data/fallbackCategories';
import {
  fetchCloudPlans,
  saveCloudPlan,
  deleteCloudPlan,
  fetchCloudCategories,
  saveCloudCategory,
  deleteCloudCategory,
} from './cloudPlans';

function filterPlans(plans, params = {}) {
  let result = [...plans];
  if (params.type) result = result.filter((p) => p.type === params.type);
  if (params.category) {
    const cat = String(params.category).toLowerCase();
    result = result.filter((p) => {
      const category = p.category || {};
      return (
        category._id === params.category ||
        category.slug === cat ||
        p.type === cat ||
        category.name?.toLowerCase() === cat ||
        (cat === 'cat-streaming' && p.type === 'entertainment' && category.name === 'Streaming') ||
        (cat === 'cat-music' && ['Spotify Premium', 'Apple Music', 'YouTube Premium'].includes(p.name)) ||
        (cat === 'cat-ai-tools' && p.type === 'ai')
      );
    });
  }
  if (params.featured === 'true') result = result.filter((p) => p.isFeatured);
  if (params.popular === 'true') result = result.filter((p) => p.isPopular);
  if (params.trending === 'true') result = result.filter((p) => p.isTrending);
  if (params.search) {
    const q = params.search.toLowerCase();
    result = result.filter((p) => p.name.toLowerCase().includes(q));
  }
  if (params.status) result = result.filter((p) => p.status === params.status);
  return result;
}

async function enrichCategoriesWithPlanCount(categories) {
  const plans = await ensureCloudPlansSeeded();
  return categories.map((cat) => ({
    ...cat,
    planCount: plans.filter((plan) => {
      const category = plan.category || {};
      if (category._id === cat._id) return true;
      if (plan.type === cat.type && category.name === cat.name) return true;
      if (cat.slug === 'streaming' && plan.type === 'entertainment' && category.name === 'Streaming') return true;
      if (cat.slug === 'music' && ['Spotify Premium', 'Apple Music', 'YouTube Premium'].includes(plan.name)) return true;
      if (cat.slug === 'ai-tools' && plan.type === 'ai') return true;
      return false;
    }).length,
  }));
}

async function ensureCloudPlansSeeded() {
  let plans = await fetchCloudPlans();
  if (plans.length === 0) {
    const seed = getFallbackPlans();
    await Promise.all(seed.map((plan) => saveCloudPlan(plan)));
    plans = await fetchCloudPlans();
  }
  return plans;
}

async function ensureCloudCategoriesSeeded() {
  let categories = await fetchCloudCategories();
  if (categories.length === 0) {
    await Promise.all(fallbackCategories.map((cat) => saveCloudCategory(cat)));
    categories = await fetchCloudCategories();
  }
  return categories;
}

async function getCloudPlansForSite(params = {}) {
  const plans = await ensureCloudPlansSeeded();
  return filterPlans(plans.filter((p) => p.status === 'active'), params);
}

export const fetchPlans = async (params = {}) => {
  if (!isOfflineApiMode()) {
    try {
      const { data, headers } = await api.get('/plans', { params });
      const contentType = headers?.['content-type'] || '';
      if (typeof data !== 'string' && !contentType.includes('text/html') && data.plans?.length) {
        return data.plans;
      }
    } catch {
      // fallback below
    }
  }

  try {
    return await getCloudPlansForSite(params);
  } catch {
    return getFallbackPlans(params);
  }
};

export const fetchPlan = async (slug) => {
  if (!isOfflineApiMode()) {
    try {
      const { data, headers } = await api.get(`/plans/${slug}`);
      const contentType = headers?.['content-type'] || '';
      if (typeof data !== 'string' && !contentType.includes('text/html') && data.plan) {
        return data.plan;
      }
    } catch {
      // fallback below
    }
  }

  try {
    const plans = await ensureCloudPlansSeeded();
    return plans.find((p) => p.slug === slug) || null;
  } catch {
    const plans = getFallbackPlans();
    return plans.find((p) => p.slug === slug) || null;
  }
};

export async function fetchAdminPlans() {
  if (!isOfflineApiMode()) {
    try {
      const { data, headers } = await api.get('/plans/admin/all');
      const contentType = headers?.['content-type'] || '';
      if (typeof data !== 'string' && !contentType.includes('text/html') && Array.isArray(data?.plans)) {
        return { plans: data.plans, offline: false };
      }
    } catch {
      // fallback below
    }
  }

  const plans = await ensureCloudPlansSeeded();
  return { plans, offline: true };
}

export async function fetchAdminCategories() {
  if (!isOfflineApiMode()) {
    try {
      const { data, headers } = await api.get('/categories/admin/all');
      const contentType = headers?.['content-type'] || '';
      if (typeof data !== 'string' && !contentType.includes('text/html') && Array.isArray(data?.categories)) {
        return { categories: data.categories, offline: false };
      }
    } catch {
      // fallback below
    }
  }

  const categories = await enrichCategoriesWithPlanCount(await ensureCloudCategoriesSeeded());
  return { categories, offline: true };
}

export async function fetchPublicCategories() {
  if (!isOfflineApiMode()) {
    try {
      const { data, headers } = await api.get('/categories');
      const contentType = headers?.['content-type'] || '';
      if (typeof data !== 'string' && !contentType.includes('text/html') && Array.isArray(data?.categories) && data.categories.length) {
        return { categories: data.categories, offline: false };
      }
    } catch {
      // fallback below
    }
  }

  const categories = await enrichCategoriesWithPlanCount(await ensureCloudCategoriesSeeded());
  return { categories: categories.filter((c) => c.status === 'active'), offline: true };
}

export async function fetchCategoryBySlug(slug) {
  if (!isOfflineApiMode()) {
    try {
      const { data, headers } = await api.get(`/categories/${slug}`);
      const contentType = headers?.['content-type'] || '';
      if (typeof data !== 'string' && !contentType.includes('text/html') && data?.category) {
        return { category: data.category, offline: false };
      }
    } catch {
      // fallback below
    }
  }

  const categories = await ensureCloudCategoriesSeeded();
  const category = categories.find((c) => c.slug === slug || c._id === slug);
  return { category: category || null, offline: true };
}

export async function saveAdminPlan(form, mode) {
  const payload = {
    ...form,
    slug: form.slug || slugify(form.name),
    _id: form._id || form.slug || slugify(form.name),
    features: Array.isArray(form.features) ? form.features : String(form.features || '').split('\n').filter(Boolean),
    durationPricing: (form.durationPricing || []).map((dp) => ({
      ...dp,
      months: Number(dp.months),
      originalPrice: Number(dp.originalPrice),
      offerPrice: Number(dp.offerPrice),
      discount: Number(dp.discount || 0),
      stock: Number(dp.stock || 0),
      isAvailable: dp.isAvailable !== false,
    })),
    category: form.category
      ? fallbackCategories.find((c) => c._id === form.category) || { name: form.type === 'ai' ? 'AI Tools' : 'Streaming', type: form.type }
      : { name: form.type === 'ai' ? 'AI Tools' : 'Streaming', type: form.type },
  };

  if (!isOfflineApiMode()) {
    try {
      if (mode === 'edit') {
        await api.put(`/plans/${form._id}`, payload);
      } else {
        await api.post('/plans', payload);
      }
      return { offline: false };
    } catch {
      // fallback below
    }
  }

  await saveCloudPlan(payload);
  return { offline: true };
}

export async function deleteAdminPlan(id) {
  if (!isOfflineApiMode()) {
    try {
      await api.delete(`/plans/${id}`);
      return { offline: false };
    } catch {
      // fallback below
    }
  }

  await deleteCloudPlan(id);
  return { offline: true };
}

export async function duplicateAdminPlan(id) {
  const { plans } = await fetchAdminPlans();
  const source = plans.find((p) => p._id === id || p.slug === id);
  if (!source) throw new Error('Plan not found');

  const copy = {
    ...source,
    _id: undefined,
    slug: undefined,
    name: `${source.name} Copy`,
    isFeatured: false,
    isPopular: false,
    isTrending: false,
  };

  return saveAdminPlan(copy, 'create');
}

export async function saveAdminCategory(form, mode) {
  const payload = {
    ...form,
    _id: form._id || slugify(form.name),
    slug: form.slug || slugify(form.name),
    status: form.status || 'active',
    description: form.description || '',
    icon: form.icon || '',
  };

  if (!isOfflineApiMode()) {
    try {
      if (mode === 'edit') await api.put(`/categories/${form._id}`, payload);
      else await api.post('/categories', payload);
      return { offline: false };
    } catch {
      // fallback below
    }
  }

  await saveCloudCategory(payload);
  return { offline: true };
}

export async function deleteAdminCategory(id) {
  if (!isOfflineApiMode()) {
    try {
      await api.delete(`/categories/${id}`);
      return { offline: false };
    } catch {
      // fallback below
    }
  }

  await deleteCloudCategory(id);
  return { offline: true };
}