import crypto from 'crypto';
import User from '../models/User.js';
import { generateAccessToken, generateRefreshToken, generateReferralCode } from '../utils/generateToken.js';
import { sendWelcomeEmail, sendPasswordReset } from '../services/emailService.js';
import { sendTemplateMessage } from '../services/whatsappService.js';
import { logAction } from '../utils/auditLog.js';

const sendTokenResponse = (user, statusCode, res) => {
  const token = generateAccessToken(user._id);
  const refreshToken = generateRefreshToken(user._id);
  res.status(statusCode).cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  }).json({
    success: true,
    token,
    refreshToken,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      referralCode: user.referralCode,
      loyaltyPoints: user.loyaltyPoints,
      loyaltyLevel: user.loyaltyLevel,
    },
  });
};

export const register = async (req, res) => {
  const { name, email, password, whatsapp, country, referralCode } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ success: false, message: 'Email already registered' });

  let referredBy = null;
  if (referralCode) {
    const referrer = await User.findOne({ referralCode: referralCode.toUpperCase() });
    if (referrer) referredBy = referrer._id;
  }

  const user = await User.create({
    name,
    email,
    password,
    whatsapp: whatsapp || '',
    country: country || 'India',
    referralCode: generateReferralCode(name),
    referredBy,
    verificationToken: crypto.randomBytes(32).toString('hex'),
  });

  await sendWelcomeEmail(user);
  if (user.whatsapp) await sendTemplateMessage(user.whatsapp, 'welcome', { customerName: name });
  await logAction(req, 'register', 'user', user._id);
  sendTokenResponse(user, 201, res);
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }
  user.lastLogin = new Date();
  user.refreshToken = generateRefreshToken(user._id);
  await user.save();
  await logAction(req, 'login', 'user', user._id);
  sendTokenResponse(user, 200, res);
};

export const getMe = async (req, res) => {
  const user = await User.findById(req.user._id).populate('currentPlan', 'name slug logo');
  res.json({ success: true, user });
};

export const forgotPassword = async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.json({ success: true, message: 'If email exists, reset link sent' });

  const resetToken = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetPasswordExpire = Date.now() + 3600000;
  await user.save();

  const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  await sendPasswordReset(user, resetUrl);
  res.json({ success: true, message: 'Password reset email sent' });
};

export const resetPassword = async (req, res) => {
  const hashed = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const user = await User.findOne({ resetPasswordToken: hashed, resetPasswordExpire: { $gt: Date.now() } });
  if (!user) return res.status(400).json({ success: false, message: 'Invalid or expired token' });

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  sendTokenResponse(user, 200, res);
};

export const refreshToken = async (req, res) => {
  const { refreshToken: token } = req.body;
  if (!token) return res.status(401).json({ success: false, message: 'No refresh token' });
  try {
    const jwt = await import('jsonwebtoken');
    const decoded = jwt.default.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ success: false, message: 'Invalid token' });
    sendTokenResponse(user, 200, res);
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid refresh token' });
  }
};

export const logout = async (req, res) => {
  res.cookie('token', '', { httpOnly: true, expires: new Date(0) });
  res.json({ success: true, message: 'Logged out' });
};

export const updateProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  const { name, whatsapp, country, avatar } = req.body;
  if (name) user.name = name;
  if (whatsapp) user.whatsapp = whatsapp;
  if (country) user.country = country;
  if (avatar) user.avatar = avatar;
  await user.save();
  res.json({ success: true, user });
};