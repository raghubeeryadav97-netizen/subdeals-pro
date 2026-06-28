import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FiLogIn, FiLoader } from 'react-icons/fi';
import SEO from '../components/common/SEO';
import { login, clearError } from '../store/slices/authSlice';
import { useTranslation } from '../hooks/useTranslation';
import { getPostLoginPath } from '../utils/auth';

export default function Login() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((state) => state.auth);
  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    if (user) navigate(getPostLoginPath(user.role));
    return () => dispatch(clearError());
  }, [user, navigate, dispatch]);

  const onSubmit = async (data) => {
    const result = await dispatch(login(data));
    if (login.fulfilled.match(result)) navigate(getPostLoginPath(result.payload.role));
  };

  return (
    <>
      <SEO title={t('login')} noindex />
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <motion.div className="glass-card w-full max-w-md" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-display font-bold text-center mb-6 neon-text">{t('login')}</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <input {...register('email', { required: 'Email is required' })} type="email" placeholder="Email" className="input-field" />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <input {...register('password', { required: 'Password is required' })} type="password" placeholder="Password" className="input-field" />
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>
            <div className="text-right">
              <Link to="/forgot-password" className="text-sm text-primary-light hover:underline">Forgot Password?</Link>
            </div>
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
              {loading ? <FiLoader className="animate-spin" /> : <FiLogIn />}
              {t('login')}
            </button>
          </form>
          <p className="text-center text-gray-400 text-sm mt-6">
            Don&apos;t have an account? <Link to="/register" className="text-primary-light hover:underline">{t('register')}</Link>
          </p>
          <p className="text-center text-gray-500 text-xs mt-4">
            Admin panel: <Link to="/admin" className="text-primary-light hover:underline">/admin</Link>
            {' '}· admin@subdealspro.com / Admin@123
          </p>
        </motion.div>
      </div>
    </>
  );
}