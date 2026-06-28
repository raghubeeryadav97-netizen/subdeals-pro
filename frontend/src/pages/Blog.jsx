import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../components/common/SEO';
import { PlanCardSkeleton } from '../components/common/Skeleton';
import api from '../api/axios';

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/blogs')
      .then(({ data }) => setBlogs(data.blogs || []))
      .catch(() => setBlogs([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <SEO title="Blog" description="Tips, guides, and news about premium subscriptions." />
      <div className="container mx-auto px-4 py-12">
        <motion.h1 className="section-title text-center mb-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          Blog
        </motion.h1>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => <PlanCardSkeleton key={i} />)}
          </div>
        ) : blogs.length === 0 ? (
          <p className="text-gray-400 text-center py-20">No blog posts yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog, i) => (
              <motion.div key={blog._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
                <Link to={`/blog/${blog.slug}`} className="glass-card block group h-full">
                  {blog.coverImage && (
                    <img src={blog.coverImage} alt={blog.title} className="w-full h-40 object-cover rounded-xl mb-4" />
                  )}
                  <h2 className="font-display font-semibold text-lg group-hover:neon-text transition-all mb-2">{blog.title}</h2>
                  <p className="text-gray-400 text-sm line-clamp-3">{blog.excerpt || blog.content?.slice(0, 150)}</p>
                  <p className="text-xs text-gray-500 mt-4">
                    {new Date(blog.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}