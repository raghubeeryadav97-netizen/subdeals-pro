import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { FiUserPlus, FiLoader } from 'react-icons/fi';
import SEO from '../components/common/SEO';
import { register as registerUser, clearError } from '../store/slices/authSlice';
import { useTranslation } from '../hooks/useTranslation';

export default function Register() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((state) => state.auth);
  const { register, handleSubmit, formState: { errors } } = useForm();

  useEffect(() => {
    if (user) navigate('/dashboard');
    return () => dispatch(clearError());
  }, [user, navigate, dispatch]);

  const onSubmit = async (data) => {
    const result = await dispatch(registerUser(data));
    if (registerUser.fulfilled.match(result)) navigate('/dashboard');
  };

  return (
    <>
      <SEO title={t('register')} noindex />
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <motion.div className="glass-card w-full max-w-md" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-display font-bold text-center mb-6 neon-text">{t('register')}</h1>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <input {...register('name', { required: 'Name is required' })} placeholder="Full Name" className="input-field" />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <input {...register('email', { required: 'Email is required' })} type="email" placeholder="Email" className="input-field" />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <input {...register('whatsapp')} placeholder="WhatsApp Number" className="input-field" />
            </div>
            <div>
              <input {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })} type="password" placeholder="Password" className="input-field" />
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
              {loading ? <FiLoader className="animate-spin" /> : <FiUserPlus />}
              {t('register')}
            </button>
          </form>
          <p className="text-center text-gray-400 text-sm mt-6">
            Already have an account? <Link to="/login" className="text-primary-light hover:underline">{t('login')}</Link>
          </p>
        </motion.div>
      </div>
    </>
  );
}