import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiLoader } from 'react-icons/fi';
import SEO from '../components/common/SEO';
import api from '../api/axios';

export default function ForgotPassword() {
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setSubmitting(true);
    setError('');
    try {
      await api.post('/auth/forgot-password', data);
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset email');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <SEO title="Forgot Password" noindex />
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <motion.div className="glass-card w-full max-w-md" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-display font-bold text-center mb-2">Forgot Password</h1>
          <p className="text-gray-400 text-sm text-center mb-6">Enter your email to receive a reset link.</p>

          {sent ? (
            <div className="text-center">
              <FiMail className="w-12 h-12 text-primary-light mx-auto mb-4" />
              <p className="text-green-400 mb-4">Reset link sent! Check your email.</p>
              <Link to="/login" className="btn-outline">Back to Login</Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <input {...register('email', { required: 'Email is required' })} type="email" placeholder="Email" className="input-field" />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
              </div>
              {error && <p className="text-red-400 text-sm text-center">{error}</p>}
              <button type="submit" disabled={submitting} className="btn-primary w-full flex items-center justify-center gap-2">
                {submitting ? <FiLoader className="animate-spin" /> : <FiMail />}
                Send Reset Link
              </button>
              <p className="text-center text-sm text-gray-400">
                <Link to="/login" className="text-primary-light hover:underline">Back to Login</Link>
              </p>
            </form>
          )}
        </motion.div>
      </div>
    </>
  );
}