import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BlogCard } from '../components/BlogCard';
import { blogAPI } from '../lib/Api';
import { Sparkles, Loader2 } from 'lucide-react';

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const data = await blogAPI.getAllBlogs();
        setBlogs(data);
      } catch (err) {
        setError('Failed to load blogs. Please try again later.');
        console.error('Error fetching blogs:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass mb-6">
            <Sparkles className="w-4 h-4 text-accent-cyan" />
            <span className="text-sm text-gray-300">AI-Generated Content</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="gradient-text">Discover Knowledge</span>
          </h1>

          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Explore AI-generated articles on technology, development, and innovation.
            Fresh content delivered daily.
          </p>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-accent-cyan animate-spin mb-4" />
            <p className="text-gray-400">Loading amazing content...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="glass rounded-xl p-8 text-center">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Blog Grid */}
        {!loading && !error && (
          <>
            {blogs.length === 0 ? (
              <div className="glass rounded-xl p-12 text-center">
                <Sparkles className="w-16 h-16 text-accent-cyan mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">No blogs yet</h3>
                <p className="text-gray-400">
                  The first AI-generated blog will appear soon!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogs.map((blog, index) => (
                  <BlogCard key={blog.id} blog={blog} index={index} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
