import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FiSend, FiLoader } from 'react-icons/fi';
import api from '../../api/axios';

export default function ReviewForm({ onSuccess }) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setSubmitting(true);
    setError('');
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, val]) => {
        if (key !== 'photo' && val) formData.append(key, val);
      });
      if (data.photo?.[0]) formData.append('photo', data.photo[0]);

      await api.post('/reviews', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      reset();
      onSuccess?.();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit(onSubmit)}
      className="glass-card space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h3 className="font-display font-semibold text-lg">Write a Review</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <input {...register('name', { required: 'Name is required' })} placeholder="Your Name *" className="input-field" />
          {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <input {...register('email')} placeholder="Email (optional)" type="email" className="input-field" />
        </div>
      </div>

      <input {...register('planName')} placeholder="Plan Name (optional)" className="input-field" />

      <div>
        <label className="block text-sm text-gray-400 mb-2">Rating *</label>
        <select {...register('rating', { required: true, valueAsNumber: true })} className="input-field">
          <option value="">Select rating</option>
          {[5, 4, 3, 2, 1].map((r) => (
            <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>
          ))}
        </select>
      </div>

      <div>
        <textarea
          {...register('comment', { required: 'Review is required', minLength: { value: 10, message: 'Min 10 characters' } })}
          placeholder="Share your experience *"
          rows={4}
          className="input-field resize-none"
        />
        {errors.comment && <p className="text-red-400 text-xs mt-1">{errors.comment.message}</p>}
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-2">Photo (optional)</label>
        <input type="file" accept="image/*" {...register('photo')} className="input-field file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:bg-primary/20 file:text-primary-light" />
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      <button type="submit" disabled={submitting} className="btn-primary flex items-center gap-2">
        {submitting ? <FiLoader className="animate-spin" /> : <FiSend />}
        Submit Review
      </button>
    </motion.form>
  );
}