'use client';

import { motion } from 'framer-motion';
import { Zap, Clock, Star, LayoutGrid } from 'lucide-react';

const Benifits = () => {
  const features = [
    {
      name: 'Platform Optimized',
      description: 'Perfectly sized content for Instagram, TikTok, Facebook, and digital signage with automatic formatting.',
      icon: LayoutGrid,
      color: 'bg-gradient-to-r from-blue-500 to-purple-500',
      light: 'bg-gradient-to-br from-blue-50 to-purple-50',
    },
    {
      name: 'Brand Consistent',
      description: 'Maintain your brand identity with custom colors, fonts, and logos across all generated content.',
      icon: Star,
      color: 'bg-gradient-to-r from-pink-500 to-purple-500',
      light: 'bg-gradient-to-br from-pink-50 to-purple-50',
    },
    {
      name: 'Time Saving',
      description: 'Create professional ads in minutes instead of days. Our AI handles the heavy lifting.',
      icon: Clock,
      color: 'bg-gradient-to-r from-green-500 to-blue-500',
      light: 'bg-gradient-to-br from-green-50 to-blue-50',
    },
    {
      name: 'High Performance',
      description: 'Ads generated with our AI convert better than traditional design, helping you achieve better ROI.',
      icon: Zap,
      color: 'bg-gradient-to-r from-orange-500 to-yellow-500',
      light: 'bg-gradient-to-br from-orange-50 to-yellow-50',
    },
  ];

  return (
    <div className="w-full py-20 bg-white">
      <div className="container px-6 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold text-gray-900">
            Supercharge Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">Marketing</span>
          </h2>
          <p className="max-w-3xl mx-auto text-xl text-gray-600">
            Our AI platform transforms your ideas into high-performing marketing assets instantly.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`p-8 transition-all transform shadow-lg ${feature.light} rounded-2xl hover:shadow-xl hover:-translate-y-2`}
            >
              <div className={`flex items-center justify-center w-16 h-16 p-4 mb-6 text-white ${feature.color} rounded-2xl`}>
                <feature.icon className="w-8 h-8" />
              </div>
              <h3 className="mb-3 text-2xl font-bold text-gray-900">{feature.name}</h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Benifits; 