import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

export const generateAccessToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });

export const generateRefreshToken = (id) =>
  jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d',
  });

export const generateOrderId = () => {
  const date = new Date();
  const prefix = `SDP${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}`;
  return `${prefix}${uuidv4().slice(0, 8).toUpperCase()}`;
};

export const generateTicketId = () => `TKT${Date.now().toString(36).toUpperCase()}`;

export const generateReferralCode = (name) => {
  const base = name.replace(/\s/g, '').slice(0, 4).toUpperCase();
  return `${base}${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
};

export const generateInvoiceNumber = () => {
  const date = new Date();
  return `INV-${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}-${Date.now().toString().slice(-6)}`;
};