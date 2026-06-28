import { useEffect, useRef, useState } from 'react';
import { useInView, motion } from 'framer-motion';

export default function AnimatedCounter({
  value,
  duration = 2,
  prefix = '',
  suffix = '',
  decimals = 0,
  className = '',
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    const target = Number(value) || 0;
    const startTime = performance.now();
    const durationMs = duration * 1000;

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(target * eased);
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [isInView, value, duration]);

  const formatted = decimals > 0
    ? display.toFixed(decimals)
    : Math.floor(display).toLocaleString();

  return (
    <motion.span
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 10 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
    >
      {prefix}{formatted}{suffix}
    </motion.span>
  );
}