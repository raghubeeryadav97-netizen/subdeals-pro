import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FiMail, FiPhone, FiMapPin, FiSend, FiLoader } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import SEO from '../components/common/SEO';
import api from '../api/axios';

export default function Contact() {
  const settings = useSelector((state) => state.settings.data);
  const company = settings?.company || {};
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setSubmitting(true);
    setError('');
    try {
      await api.post('/contact', data);
      setSuccess(true);
      reset();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <SEO title="Contact" description="Get in touch with SubDeals Pro support team." />
      <div className="container mx-auto px-4 py-12">
        <motion.h1 className="section-title text-center mb-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          Contact <span className="neon-text">Us</span>
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="space-y-4">
            {settings?.support_email && (
              <div className="glass-card flex items-center gap-4">
                <FiMail className="w-5 h-5 text-primary-light" />
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <a href={`mailto:${settings.support_email}`} className="text-sm hover:text-primary-light">{settings.support_email}</a>
                </div>
              </div>
            )}
            {settings?.whatsapp_number && (
              <a href={`https://wa.me/${settings.whatsapp_number.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="glass-card flex items-center gap-4 hover:border-green-400/30">
                <FaWhatsapp className="w-5 h-5 text-green-400" />
                <div>
                  <p className="text-sm text-gray-400">WhatsApp</p>
                  <span className="text-sm">Chat with us</span>
                </div>
              </a>
            )}
            {company.phone && (
              <div className="glass-card flex items-center gap-4">
                <FiPhone className="w-5 h-5 text-primary-light" />
                <div>
                  <p className="text-sm text-gray-400">Phone</p>
                  <span className="text-sm">{company.phone}</span>
                </div>
              </div>
            )}
            {company.address && (
              <div className="glass-card flex items-center gap-4">
                <FiMapPin className="w-5 h-5 text-primary-light" />
                <div>
                  <p className="text-sm text-gray-400">Address</p>
                  <span className="text-sm">{company.address}</span>
                </div>
              </div>
            )}
          </div>

          <motion.form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-2 glass-card space-y-4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input {...register('name', { required: 'Name is required' })} placeholder="Your Name *" className="input-field" />
                {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
              </div>
              <div>
                <input {...register('email', { required: 'Email is required' })} type="email" placeholder="Email *" className="input-field" />
                {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
              </div>
            </div>
            <input {...register('subject')} placeholder="Subject" className="input-field" />
            <div>
              <textarea {...register('message', { required: 'Message is required' })} placeholder="Your Message *" rows={5} className="input-field resize-none" />
              {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message.message}</p>}
            </div>

            {success && <p className="text-green-400 text-sm">Message sent successfully! We&apos;ll get back to you soon.</p>}
            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button type="submit" disabled={submitting} className="btn-primary flex items-center gap-2">
              {submitting ? <FiLoader className="animate-spin" /> : <FiSend />}
              Send Message
            </button>
          </motion.form>
        </div>
      </div>
    </>
  );
}