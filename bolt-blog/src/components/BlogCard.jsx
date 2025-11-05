import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Tag, ArrowRight } from 'lucide-react';

export const BlogCard = ({ blog, index }) => {
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    return (
        <motion.article
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="glass rounded-xl overflow-hidden hover-glow group"
        >
            {/* Image */}
            <div className="relative h-56 overflow-hidden bg-gradient-to-br from-accent-cyan/20 to-accent-purple/20">
                <img
                    src={blog.image_url}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                />

                {/* Category Badge */}
                {blog.category && (
                    <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-dark-bg/80 backdrop-blur-sm border border-accent-cyan/30">
                        <span className="text-xs font-medium text-accent-cyan">
                            {blog.category}
                        </span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="p-6">
                <Link to={`/article/${blog.id}`}>
                    <h3 className="text-xl font-bold mb-3 text-white group-hover:text-accent-cyan transition-colors line-clamp-2">
                        {blog.title}
                    </h3>
                </Link>

                {/* Meta Info */}
                <div className="flex items-center space-x-4 mb-4 text-sm text-gray-400">
                    <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(blog.created_at)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>5 min read</span>
                    </div>
                </div>

                {/* Tags */}
                {blog.tags && blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                        {blog.tags.slice(0, 3).map((tag, i) => (
                            <span
                                key={i}
                                className="inline-flex items-center space-x-1 px-2 py-1 rounded-md bg-accent-purple/10 text-accent-purple text-xs"
                            >
                                <Tag className="w-3 h-3" />
                                <span>{tag}</span>
                            </span>
                        ))}
                    </div>
                )}

                {/* Read More */}
                <Link
                    to={`/article/${blog.id}`}
                    className="inline-flex items-center space-x-2 text-accent-cyan hover:text-accent-cyan/80 transition-colors"
                >
                    <span className="text-sm font-medium">Read article</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        </motion.article>
    );
};
