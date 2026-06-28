import { slugify } from '../utils/slugify';

const DB_URL = 'https://subdeals-696aa-default-rtdb.firebaseio.com';

async function restFetch(path, options = {}) {
  const response = await fetch(`${DB_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
    ...options,
  });
  if (!response.ok) throw new Error(`Firebase REST error: ${response.status}`);
  if (response.status === 204) return null;
  return response.json();
}

function normalizePlan(plan) {
  const slug = plan.slug || slugify(plan.name);
  return {
    ...plan,
    _id: plan._id || slug,
    slug,
    status: plan.status || 'active',
    features: Array.isArray(plan.features) ? plan.features : [],
    durationPricing: plan.durationPricing || [],
    category: plan.category || { name: plan.type === 'ai' ? 'AI Tools' : 'Streaming', type: plan.type },
  };
}

export async function fetchCloudPlans() {
  const data = await restFetch('/plans.json');
  if (!data) return [];
  return Object.values(data)
    .map(normalizePlan)
    .sort((a, b) => a.name.localeCompare(b.name));
}

export async function saveCloudPlan(plan) {
  const payload = normalizePlan(plan);
  await restFetch(`/plans/${payload.slug}.json`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  return payload;
}

export async function deleteCloudPlan(slugOrId) {
  await restFetch(`/plans/${slugOrId}.json`, { method: 'DELETE' });
}

export async function fetchCloudCategories() {
  const data = await restFetch('/categories.json');
  if (!data) return [];
  return Object.values(data);
}

export async function saveCloudCategory(category) {
  const id = category._id || slugify(category.name);
  const payload = { ...category, _id: id, slug: category.slug || slugify(category.name) };
  await restFetch(`/categories/${id}.json`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  return payload;
}

export async function deleteCloudCategory(id) {
  await restFetch(`/categories/${id}.json`, { method: 'DELETE' });
}