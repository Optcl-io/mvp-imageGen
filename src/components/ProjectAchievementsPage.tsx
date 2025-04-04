'use client';

import { motion } from 'framer-motion';
import { Globe, Award, Users, Zap } from 'lucide-react';
import Image from 'next/image';

const ProjectAchievementsPage = () => {
  const stats = [
    {
      label: 'Clients',
      value: '1,200+',
      icon: Users,
      description: 'Businesses using our platform'
    },
    {
      label: 'Images Generated',
      value: '5M+',
      icon: Zap,
      description: 'Marketing assets created'
    },
    {
      label: 'Countries',
      value: '50+',
      icon: Globe,
      description: 'Global reach and impact'
    },
    {
      label: 'Awards',
      value: '12',
      icon: Award,
      description: 'Industry recognitions'
    }
  ];

  const projects = [
    {
      title: 'Fashion Brand Campaign',
      description: 'Seasonal collection launch with AI-generated imagery across multiple platforms',
      image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      tag: 'E-commerce'
    },
    {
      title: 'Tech Product Launch',
      description: 'Consistent visual identity across web, social and print for new gadget release',
      image: 'https://images.unsplash.com/photo-1498075702571-ecb018f3752d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      tag: 'Technology'
    },
    {
      title: 'Food Delivery App',
      description: 'Mouth-watering food photography generated at scale for menu items',
      image: 'https://images.unsplash.com/photo-1565299507177-b0ac66763828?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      tag: 'Food & Beverage'
    }
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
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">Impact</span>
          </h2>
          <p className="max-w-3xl mx-auto text-xl text-gray-600">
            Transforming marketing workflows and empowering creators worldwide.
          </p>
        </motion.div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 gap-6 mb-20 md:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-6 text-center bg-white border border-gray-200 rounded-2xl"
            >
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 text-blue-600 bg-blue-100 rounded-xl">
                <stat.icon className="w-6 h-6" />
              </div>
              <div className="mb-2 text-3xl font-bold text-gray-900">{stat.value}</div>
              <div className="font-medium text-blue-600">{stat.label}</div>
              <p className="mt-2 text-sm text-gray-600">{stat.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Projects Section */}
        <h3 className="mb-8 text-2xl font-bold text-center text-gray-900">Featured Projects</h3>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="overflow-hidden transition-all bg-white border border-gray-200 rounded-2xl hover:shadow-xl"
            >
              <div className="relative w-full pt-[60%]">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover object-center"
                />
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 text-xs font-medium text-white bg-blue-600 rounded-full">
                    {project.tag}
                  </span>
                </div>
              </div>
              <div className="p-6">
                <h4 className="mb-2 text-xl font-bold text-gray-900">{project.title}</h4>
                <p className="text-gray-600">{project.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="p-8 mt-16 text-center bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl"
        >
          <h3 className="mb-4 text-2xl font-bold text-white">Ready to Create Your Success Story?</h3>
          <p className="max-w-3xl mx-auto mb-6 text-white/90">
            Join thousands of businesses transforming their marketing with AI-generated content.
          </p>
          <a
            href="/sign-up"
            className="inline-block px-8 py-3 font-medium text-blue-600 transition-all bg-white rounded-lg hover:bg-blue-50"
          >
            Get Started Today
          </a>
        </motion.div>
      </div>
    </div>
  );
};

export default ProjectAchievementsPage; 