import { Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="glass border-t border-dark-border mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-gray-400">
          <p className="flex items-center justify-center space-x-2">
            <span>Made with</span>
            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
            <span>by Aryan Madkar</span>
          </p>
          <p className="mt-2 text-sm">
            Powered by AI • LangGraph • Groq
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
