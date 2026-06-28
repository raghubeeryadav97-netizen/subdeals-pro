import api from './axios';
import { isOfflineApiMode } from '../utils/auth';
import { fallbackReviews } from '../data/fallbackReviews';
import {
  saveCloudReview,
  fetchCloudReviews,
  updateCloudReview,
  deleteCloudReview,
} from './cloudReviews';

function isValidReviewResponse(data) {
  return data && typeof data === 'object' && data.review;
}

export async function submitReview(formData, photoFile) {
  const payload = {
    name: formData.name?.trim(),
    email: formData.email?.trim() || '',
    planName: formData.planName?.trim() || '',
    rating: Number(formData.rating),
    comment: formData.comment?.trim(),
    status: 'pending',
  };

  if (!payload.name || !payload.rating || !payload.comment) {
    throw new Error('Please fill all required fields');
  }

  if (!isOfflineApiMode()) {
    try {
      const body = new FormData();
      body.append('name', payload.name);
      body.append('email', payload.email);
      body.append('rating', String(payload.rating));
      body.append('review', payload.comment);
      if (payload.planName) body.append('planName', payload.planName);
      if (photoFile) body.append('photo', photoFile);

      const { data, headers } = await api.post('/reviews', body, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const contentType = headers?.['content-type'] || '';
      if (typeof data !== 'string' && !contentType.includes('text/html') && isValidReviewResponse(data)) {
        return { review: data.review, offline: false };
      }
    } catch {
      // fallback below
    }
  }

  const review = await saveCloudReview(payload);
  return { review, offline: true };
}

export async function fetchPublicReviews(limit) {
  if (!isOfflineApiMode()) {
    try {
      const { data, headers } = await api.get('/reviews', { params: { status: 'approved' } });
      const contentType = headers?.['content-type'] || '';
      if (typeof data !== 'string' && !contentType.includes('text/html') && Array.isArray(data?.reviews)) {
        const reviews = data.reviews.map((r) => ({
          ...r,
          comment: r.comment || r.review,
          planName: r.planName || r.plan?.name,
        }));
        if (reviews.length) return { reviews: limit ? reviews.slice(0, limit) : reviews, offline: false };
      }
    } catch {
      // fallback below
    }
  }

  try {
    const cloudReviews = await fetchCloudReviews('approved');
    if (cloudReviews.length) {
      return { reviews: limit ? cloudReviews.slice(0, limit) : cloudReviews, offline: true };
    }
  } catch {
    // fallback below
  }

  const reviews = limit ? fallbackReviews.slice(0, limit) : fallbackReviews;
  return { reviews, offline: true, fallback: true };
}

export async function fetchAdminReviews() {
  if (!isOfflineApiMode()) {
    try {
      const { data, headers } = await api.get('/reviews/admin/all');
      const contentType = headers?.['content-type'] || '';
      if (typeof data !== 'string' && !contentType.includes('text/html') && Array.isArray(data?.reviews)) {
        return {
          reviews: data.reviews.map((r) => ({ ...r, comment: r.comment || r.review })),
          offline: false,
        };
      }
    } catch {
      // fallback below
    }
  }

  const reviews = await fetchCloudReviews();
  return { reviews, offline: true };
}

export async function updateAdminReview(id, body) {
  if (!isOfflineApiMode()) {
    try {
      const apiBody = { ...body };
      if (apiBody.comment) {
        apiBody.review = apiBody.comment;
        delete apiBody.comment;
      }
      await api.put(`/reviews/${id}`, apiBody);
      return { offline: false };
    } catch {
      // fallback below
    }
  }

  await updateCloudReview(id, body);
  return { offline: true };
}

export async function deleteAdminReview(id) {
  if (!isOfflineApiMode()) {
    try {
      await api.delete(`/reviews/${id}`);
      return { offline: false };
    } catch {
      // fallback below
    }
  }

  await deleteCloudReview(id);
  return { offline: true };
}