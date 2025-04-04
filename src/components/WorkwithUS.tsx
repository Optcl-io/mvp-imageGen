'use client';

import { motion } from 'framer-motion';
import { BriefcaseIcon, MessageSquare, HeartHandshake, Users } from 'lucide-react';
import Link from 'next/link';

const WorkwithUS = () => {
  const reasons = [
    {
      title: "Join Our Team",
      description: "Be part of a team pushing the boundaries of AI-powered content generation. Help shape the future of digital marketing.",
      icon: Users,
      link: "#careers"
    },
    {
      title: "Partner With Us",
      description: "Integrate our technology into your platform or service. We offer flexible partnership options for businesses.",
      icon: HeartHandshake,
      link: "#partners"
    },
    {
      title: "Agency Solutions",
      description: "Custom solutions for marketing agencies and creative teams looking to scale content production.",
      icon: BriefcaseIcon,
      link: "#agencies"
    },
    {
      title: "Contact Us",
      description: "Have questions or need more information? Our team is ready to help you get started.",
      icon: MessageSquare,
      link: "/contact"
    }
  ];

  return (
    <div className="w-full py-20 bg-blue-50">
      <div className="container px-6 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold text-gray-900">
            Work With <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">Us</span>
          </h2>
          <p className="max-w-3xl mx-auto text-xl text-gray-600">
            Join our growing ecosystem of creators, marketers, and innovators.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {reasons.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="overflow-hidden transition-all bg-white rounded-2xl hover:shadow-xl"
            >
              <Link href={item.link} className="block h-full p-8">
                <div className="flex items-center justify-center w-16 h-16 mb-6 text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl">
                  <item.icon className="w-8 h-8" />
                </div>
                <h3 className="mb-3 text-2xl font-bold text-gray-900">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkwithUS; 