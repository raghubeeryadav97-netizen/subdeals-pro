import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiCheck, FiLoader } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import api from '../../api/axios';
import { placeOrder } from '../../api/orders';
import { forceSyncOrderToCloud } from '../../utils/orderCloudSync';
import { useTranslation } from '../../hooks/useTranslation';

export default function PurchaseModal({ plan, isOpen, onClose }) {
  const { t } = useTranslation();
  const { user } = useSelector((state) => state.auth);
  const settings = useSelector((state) => state.settings.data);
  const currency = settings?.currency_symbol || '₹';
  const paymentMethods = settings?.payment_methods || ['upi', 'qr', 'bank_transfer', 'manual'];

  const [selectedDuration, setSelectedDuration] = useState(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState('');
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      customerName: user?.name || '',
      customerEmail: user?.email || '',
      customerWhatsapp: user?.whatsapp || '',
      customerCountry: user?.country || 'India',
      couponCode: '',
      paymentMethod: paymentMethods[0] || 'upi',
    },
  });

  const couponCode = watch('couponCode');

  useEffect(() => {
    if (!isOpen) {
      setSuccess(null);
      setError('');
      return;
    }
    if (plan?.durationPricing?.length) {
      const available = plan.durationPricing.find((d) => d.isAvailable && d.stock > 0);
      setSelectedDuration(available || plan.durationPricing[0]);
    }
  }, [plan, isOpen]);

  useEffect(() => {
    if (user) {
      setValue('customerName', user.name);
      setValue('customerEmail', user.email);
      setValue('customerWhatsapp', user.whatsapp || '');
      setValue('customerCountry', user.country || 'India');
    }
  }, [user, setValue]);

  const validateCoupon = async () => {
    if (!couponCode || !selectedDuration) return;
    setValidatingCoupon(true);
    setCouponMessage('');
    try {
      const { data } = await api.post('/coupons/validate', {
        code: couponCode,
        planId: plan._id,
        amount: selectedDuration.offerPrice,
      });
      if (data.valid) {
        setCouponDiscount(data.discount);
        setCouponMessage(`Coupon applied! You save ${currency}${data.discount}`);
      } else {
        setCouponDiscount(0);
        setCouponMessage(data.message || 'Invalid coupon');
      }
    } catch (err) {
      setCouponDiscount(0);
      setCouponMessage(err.response?.data?.message || 'Invalid coupon');
    } finally {
      setValidatingCoupon(false);
    }
  };

  const finalPrice = selectedDuration ? selectedDuration.offerPrice - couponDiscount : 0;

  const onSubmit = async (formData) => {
    if (!selectedDuration) return;
    setSubmitting(true);
    setError('');
    setSuccess(null);
    try {
      const data = await placeOrder({
        planId: plan._id,
        planName: plan.name,
        duration: selectedDuration.months,
        durationLabel: selectedDuration.label,
        originalPrice: selectedDuration.originalPrice,
        finalPrice,
        discountAmount: couponDiscount,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerWhatsapp: formData.customerWhatsapp,
        customerCountry: formData.customerCountry,
        couponCode: formData.couponCode || undefined,
        paymentMethod: formData.paymentMethod,
      }, settings);

      const cloudResult = await forceSyncOrderToCloud(data.order);

      if (data.whatsappUrl) {
        window.open(data.whatsappUrl, '_blank');
      }

      setSuccess({
        orderId: data.order?.orderId,
        whatsappUrl: data.whatsappUrl,
        offline: data.offline,
        cloudSynced: cloudResult.synced,
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Order place nahi ho pa raha. Dubara try karo.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!plan) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => onClose(false)}
          />
          <motion.div
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto glass p-6 md:p-8"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
          >
            <button
              type="button"
              onClick={() => onClose(false)}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/10"
            >
              <FiX className="w-5 h-5" />
            </button>

            <h2 className="text-2xl font-display font-bold mb-1">
              {success ? 'Order Placed!' : `Purchase ${plan.name}`}
            </h2>
            <p className="text-gray-400 text-sm mb-6">
              {success ? 'WhatsApp par payment confirm karo.' : 'Complete your order details below'}
            </p>

            {success ? (
              <div className="space-y-4">
                <div className="glass p-4 rounded-xl border border-green-400/30 text-sm text-green-300">
                  Order ID: <span className="font-mono font-bold">{success.orderId}</span>
                </div>
                <p className={`text-sm ${success.cloudSynced ? 'text-green-300' : 'text-yellow-300'}`}>
                  {success.cloudSynced
                    ? 'Order cloud par save ho gaya — admin panel mein dikhega.'
                    : 'Order place hua lekin cloud sync pending hai. Order ID save karke admin ko bhejo.'}
                </p>
                <p className="text-gray-400 text-sm">
                  Payment details WhatsApp par bhej di gayi hain. Admin confirm karega to subscription milega.
                </p>
                {success.whatsappUrl && (
                  <a
                    href={success.whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary w-full text-center block"
                  >
                    Open WhatsApp Again
                  </a>
                )}
                <button type="button" onClick={() => onClose(true)} className="btn-outline w-full">
                  Close
                </button>
              </div>
            ) : (
            <>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">{t('duration')}</label>
              <div className="grid grid-cols-2 gap-2">
                {plan.durationPricing?.filter((d) => d.isAvailable).map((d) => (
                  <button
                    key={d.months}
                    type="button"
                    onClick={() => { setSelectedDuration(d); setCouponDiscount(0); setCouponMessage(''); }}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedDuration?.months === d.months
                        ? 'border-primary bg-primary/10'
                        : 'border-white/10 hover:border-primary/30'
                    }`}
                  >
                    <div className="font-semibold">{d.label}</div>
                    <div className="text-sm text-gray-400">
                      <span className="line-through mr-1">{currency}{d.originalPrice}</span>
                      <span className="text-primary-light font-bold">{currency}{d.offerPrice}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <input
                  {...register('customerName', { required: 'Name is required' })}
                  placeholder="Full Name *"
                  className="input-field"
                />
                {errors.customerName && <p className="text-red-400 text-xs mt-1">{errors.customerName.message}</p>}
              </div>

              <div>
                <input
                  {...register('customerWhatsapp', { required: 'WhatsApp number is required' })}
                  placeholder="WhatsApp Number *"
                  className="input-field"
                />
                {errors.customerWhatsapp && <p className="text-red-400 text-xs mt-1">{errors.customerWhatsapp.message}</p>}
              </div>

              <div>
                <input
                  {...register('customerEmail', { required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } })}
                  placeholder="Email *"
                  type="email"
                  className="input-field"
                />
                {errors.customerEmail && <p className="text-red-400 text-xs mt-1">{errors.customerEmail.message}</p>}
              </div>

              <div>
                <input
                  {...register('customerCountry')}
                  placeholder="Country"
                  className="input-field"
                />
              </div>

              <div className="flex gap-2">
                <input
                  {...register('couponCode')}
                  placeholder="Coupon Code"
                  className="input-field flex-1"
                />
                <button
                  type="button"
                  onClick={validateCoupon}
                  disabled={validatingCoupon || !couponCode}
                  className="btn-outline px-4 whitespace-nowrap"
                >
                  {validatingCoupon ? <FiLoader className="animate-spin" /> : 'Apply'}
                </button>
              </div>
              {couponMessage && (
                <p className={`text-xs ${couponDiscount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {couponMessage}
                </p>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">Payment Method</label>
                <select {...register('paymentMethod')} className="input-field">
                  {paymentMethods.map((m) => (
                    <option key={m} value={m}>{m.replace(/_/g, ' ').toUpperCase()}</option>
                  ))}
                </select>
              </div>

              <div className="glass p-4 rounded-xl">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Subtotal</span>
                  <span>{currency}{selectedDuration?.offerPrice || 0}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-sm mb-1 text-green-400">
                    <span>Discount</span>
                    <span>-{currency}{couponDiscount}</span>
                  </div>
                )}
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-white/10">
                  <span>Total</span>
                  <span className="neon-text">{currency}{finalPrice}</span>
                </div>
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <button type="submit" disabled={submitting || !selectedDuration} className="btn-primary w-full flex items-center justify-center gap-2">
                {submitting ? (
                  <><FiLoader className="animate-spin" /> Processing...</>
                ) : (
                  <><FiCheck /> {t('buyNow')} — {currency}{finalPrice}</>
                )}
              </button>
            </form>
            </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}