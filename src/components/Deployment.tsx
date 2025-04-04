'use client';

import { motion } from 'framer-motion';
import { Globe, Instagram, Facebook, Check } from 'lucide-react';

const Deployment = () => {
  const platforms = [
    {
      name: 'Social Media',
      description: 'Create stunning ads for Instagram, Facebook, TikTok and more',
      icon: Instagram,
      features: [
        'Automatically sized for each platform',
        'One-click publishing',
        'Multi-account management',
        'Performance tracking'
      ]
    },
    {
      name: 'Websites',
      description: 'Generate and deploy website banners and rich media content',
      icon: Globe,
      features: [
        'Responsive designs',
        'Custom CTAs',
        'A/B testing ready',
        'SEO optimized'
      ]
    },
    {
      name: 'Display Networks',
      description: 'Deploy to Google Display Network, Meta and other ad platforms',
      icon: Facebook,
      features: [
        'Built to platform specifications',
        'Campaign integration',
        'Direct API connections',
        'Conversion optimization'
      ]
    }
  ];

  return (
    <div className="w-full py-20 bg-gray-50">
      <div className="container px-6 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold text-gray-900">
            Deploy <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">Anywhere</span>
          </h2>
          <p className="max-w-3xl mx-auto text-xl text-gray-600">
            Create once, deploy everywhere with our multi-platform optimization.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-10 mt-12 md:grid-cols-3">
          {platforms.map((platform, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="overflow-hidden transition-all bg-white border border-gray-200 rounded-2xl hover:shadow-xl"
            >
              <div className="p-8">
                <div className="flex items-center justify-center w-16 h-16 p-3 mb-6 text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl">
                  <platform.icon className="w-10 h-10" />
                </div>
                <h3 className="mb-3 text-2xl font-bold text-gray-900">{platform.name}</h3>
                <p className="mb-6 text-gray-600">{platform.description}</p>
                
                <ul className="space-y-3">
                  {platform.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <div className="flex-shrink-0 mr-2">
                        <Check className="w-5 h-5 text-green-500" />
                      </div>
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Deployment; 