import { motion } from 'framer-motion';
import { FiStar } from 'react-icons/fi';

export default function ReviewCard({ review, index = 0 }) {
  return (
    <motion.div
      className="glass-card"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0 overflow-hidden">
          {review.photo ? (
            <img src={review.photo} alt={review.name} className="w-full h-full object-cover" />
          ) : (
            <span className="font-bold text-primary-light">{review.name?.[0]?.toUpperCase()}</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h4 className="font-semibold truncate">{review.name}</h4>
            <div className="flex items-center gap-0.5 text-yellow-400 shrink-0">
              {Array.from({ length: 5 }).map((_, i) => (
                <FiStar key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'fill-current' : 'text-gray-600'}`} />
              ))}
            </div>
          </div>
          {review.planName && (
            <p className="text-xs text-primary-light mb-2">{review.planName}</p>
          )}
          <p className="text-gray-400 text-sm leading-relaxed">{review.comment || review.review}</p>
          <p className="text-xs text-gray-500 mt-3">
            {new Date(review.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
        </div>
      </div>
    </motion.div>
  );
}