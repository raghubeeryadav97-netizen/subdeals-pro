import api from './axios';
import { getFallbackPlans } from '../data/fallbackPlans';

export const fetchPlans = async (params = {}) => {
  try {
    const { data } = await api.get('/plans', { params });
    if (data.plans?.length) return data.plans;
    return getFallbackPlans(params);
  } catch {
    return getFallbackPlans(params);
  }
};

export const fetchPlan = async (slug) => {
  try {
    const { data } = await api.get(`/plans/${slug}`);
    if (data.plan) return data.plan;
  } catch {
    // fallback below
  }
  const plans = getFallbackPlans();
  return plans.find((p) => p.slug === slug) || null;
};