import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiLock, FiLoader } from 'react-icons/fi';
import SEO from '../components/common/SEO';
import api from '../api/axios';

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setSubmitting(true);
    setError('');
    try {
      await api.post(`/auth/reset-password/${token}`, { password: data.password });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <SEO title="Reset Password" noindex />
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <motion.div className="glass-card w-full max-w-md" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-display font-bold text-center mb-6 neon-text">Reset Password</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <input
                {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })}
                type="password"
                placeholder="New Password"
                className="input-field"
              />
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>
            <div>
              <input
                {...register('confirmPassword', {
                  required: 'Confirm password',
                  validate: (val, form) => val === form.password || 'Passwords do not match',
                })}
                type="password"
                placeholder="Confirm Password"
                className="input-field"
              />
              {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword.message}</p>}
            </div>
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            <button type="submit" disabled={submitting} className="btn-primary w-full flex items-center justify-center gap-2">
              {submitting ? <FiLoader className="animate-spin" /> : <FiLock />}
              Reset Password
            </button>
            <p className="text-center text-sm text-gray-400">
              <Link to="/login" className="text-primary-light hover:underline">Back to Login</Link>
            </p>
          </form>
        </motion.div>
      </div>
    </>
  );
}