import express from 'express';
import { body } from 'express-validator';
import { register, login, getMe, forgotPassword, resetPassword, refreshToken, logout, updateProfile } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', [
  body('name').trim().notEmpty(),
  body('email').isEmail(),
  body('password').isLength({ min: 6 }),
], register);

router.post('/login', [body('email').isEmail(), body('password').notEmpty()], login);
router.post('/forgot-password', [body('email').isEmail()], forgotPassword);
router.post('/reset-password/:token', [body('password').isLength({ min: 6 })], resetPassword);
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

export default router;