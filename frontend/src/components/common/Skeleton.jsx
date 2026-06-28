import { motion } from 'framer-motion';

export function Skeleton({ className = '', rounded = 'rounded-xl' }) {
  return (
    <motion.div
      className={`bg-white/10 animate-pulse ${rounded} ${className}`}
      initial={{ opacity: 0.5 }}
      animate={{ opacity: [0.5, 0.8, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    />
  );
}

export function PlanCardSkeleton() {
  return (
    <div className="glass-card space-y-4">
      <Skeleton className="h-16 w-16 mx-auto rounded-full" />
      <Skeleton className="h-6 w-3/4 mx-auto" />
      <Skeleton className="h-4 w-1/2 mx-auto" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-12 w-full rounded-xl" />
    </div>
  );
}

export function TableRowSkeleton({ cols = 5 }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton className="h-4 w-full" />
        </td>
      ))}
    </tr>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="glass-card">
      <Skeleton className="h-4 w-24 mb-3" />
      <Skeleton className="h-8 w-32 mb-2" />
      <Skeleton className="h-3 w-20" />
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-12 space-y-8">
      <Skeleton className="h-10 w-64" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <PlanCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}

export default Skeleton;