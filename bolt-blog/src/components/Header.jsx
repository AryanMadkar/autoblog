import { Link, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Info, BookOpen } from 'lucide-react';

const Header = () => {
  const navLinks = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/about', icon: Info, label: 'About' },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-dark-border"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <BookOpen className="w-6 h-6 text-accent-cyan group-hover:rotate-12 transition-transform" />
            <span className="text-xl font-bold gradient-text">
              KnowledgeHub
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center space-x-1">
            {navLinks.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${isActive
                    ? 'text-accent-cyan bg-accent-cyan/10'
                    : 'text-gray-400 hover:text-accent-cyan hover:bg-accent-cyan/5'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
