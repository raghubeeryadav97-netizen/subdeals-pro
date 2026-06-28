const DB_URL = 'https://subdeals-696aa-default-rtdb.firebaseio.com';

function normalizeReview(review, index = 0) {
  const id = review._id || review.id || `REV-${index}`;
  return {
    ...review,
    _id: id,
    comment: review.comment || review.review || '',
    planName: review.planName || review.plan?.name || '',
    status: review.status || 'pending',
    createdAt: review.createdAt || new Date().toISOString(),
  };
}

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

export async function saveCloudReview(review) {
  const id = review._id || `REV-${Date.now().toString(36).toUpperCase()}`;
  const payload = normalizeReview({ ...review, _id: id });
  await restFetch(`/reviews/${id}.json`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  return payload;
}

export async function fetchCloudReviews(status) {
  const data = await restFetch('/reviews.json');
  if (!data) return [];

  let reviews = Object.values(data).map(normalizeReview);
  if (status) reviews = reviews.filter((r) => r.status === status);
  return reviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

export async function updateCloudReview(id, updates) {
  await restFetch(`/reviews/${id}.json`, {
    method: 'PATCH',
    body: JSON.stringify({
      ...updates,
      updatedAt: new Date().toISOString(),
    }),
  });
}

export async function deleteCloudReview(id) {
  await restFetch(`/reviews/${id}.json`, { method: 'DELETE' });
}