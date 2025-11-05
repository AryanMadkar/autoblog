import { motion } from 'framer-motion';
import { Sparkles, Zap, Brain, Code } from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered',
      description: 'Content generated using advanced LangGraph workflows and Groq LLM',
    },
    {
      icon: Zap,
      title: 'Automated',
      description: 'New blog posts generated automatically every day at midnight',
    },
    {
      icon: Code,
      title: 'Modern Stack',
      description: 'Built with React, FastAPI, MongoDB, and Python',
    },
    {
      icon: Sparkles,
      title: 'Quality Content',
      description: 'Well-researched, structured articles on trending tech topics',
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-bold mb-6">
            <span className="gradient-text">About This Project</span>
          </h1>
          <p className="text-xl text-gray-400">
            An automated blog generation system powered by AI
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="glass rounded-2xl p-8 md:p-12 mb-12"
        >
          <h2 className="text-2xl font-bold mb-4 text-white">The Vision</h2>
          <p className="text-gray-300 leading-relaxed mb-4">
            This project demonstrates the power of AI-driven content creation using cutting-edge
            technologies. Every blog post you see here is generated entirely by AI, from topic
            selection to image creation, with zero human intervention.
          </p>
          <p className="text-gray-300 leading-relaxed">
            The system uses LangGraph to orchestrate a multi-step workflow that generates
            trending topics, crafts engaging titles, writes comprehensive content, and even
            creates matching thumbnail images - all automatically.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="glass rounded-xl p-6 hover-glow"
            >
              <feature.icon className="w-10 h-10 text-accent-cyan mb-4" />
              <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="glass rounded-2xl p-8 md:p-12 text-center"
        >
          <h2 className="text-2xl font-bold mb-4 text-white">Tech Stack</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {['React', 'FastAPI', 'MongoDB', 'LangGraph', 'Groq', 'Python', 'Tailwind CSS'].map((tech, i) => (
              <span
                key={i}
                className="px-4 py-2 rounded-lg bg-accent-purple/10 text-accent-purple border border-accent-purple/30"
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;
