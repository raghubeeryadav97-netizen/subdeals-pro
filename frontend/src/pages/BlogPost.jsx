import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SEO from '../components/common/SEO';
import { PageSkeleton } from '../components/common/Skeleton';
import api from '../api/axios';

export default function BlogPost() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/blogs/${slug}`)
      .then(({ data }) => setBlog(data.blog))
      .catch(() => setBlog(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <PageSkeleton />;
  if (!blog) return (
    <div className="container mx-auto px-4 py-20 text-center">
      <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
      <Link to="/blog" className="btn-primary">Back to Blog</Link>
    </div>
  );

  return (
    <>
      <SEO title={blog.title} description={blog.excerpt} image={blog.coverImage} type="article" />
      <article className="container mx-auto px-4 py-12 max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Link to="/blog" className="text-primary-light text-sm mb-4 inline-block hover:underline">&larr; Back to Blog</Link>
          {blog.coverImage && (
            <img src={blog.coverImage} alt={blog.title} className="w-full h-64 object-cover rounded-2xl mb-8" />
          )}
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">{blog.title}</h1>
          <p className="text-gray-400 text-sm mb-8">
            {new Date(blog.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            {blog.author && ` • ${blog.author}`}
          </p>
          <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed whitespace-pre-wrap">
            {blog.content}
          </div>
        </motion.div>
      </article>
    </>
  );
}