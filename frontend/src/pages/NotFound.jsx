import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../components/common/SEO';

export default function NotFound() {
  return (
    <>
      <SEO title="404 - Page Not Found" noindex />
      <div className="container mx-auto px-4 py-32 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-8xl font-display font-bold neon-text mb-4">404</h1>
          <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          <Link to="/" className="btn-primary">Go Home</Link>
        </motion.div>
      </div>
    </>
  );
}