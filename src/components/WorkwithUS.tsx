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
      link: "#careers",
      gradient: "from-blue-500 to-indigo-600"
    },
    {
      title: "Partner With Us",
      description: "Integrate our technology into your platform or service. We offer flexible partnership options for businesses.",
      icon: HeartHandshake,
      link: "#partners",
      gradient: "from-purple-500 to-pink-600"
    },
    {
      title: "Agency Solutions",
      description: "Custom solutions for marketing agencies and creative teams looking to scale content production.",
      icon: BriefcaseIcon,
      link: "#agencies",
      gradient: "from-amber-500 to-orange-600"
    },
    {
      title: "Contact Us",
      description: "Have questions or need more information? Our team is ready to help you get started.",
      icon: MessageSquare,
      link: "/contact",
      gradient: "from-emerald-500 to-teal-600"
    }
  ];

  return (
    <div className="w-full py-24 bg-gradient-to-br from-gray-50 to-blue-50/50">
      <div className="container z-50 px-6 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, type: "spring" }}
          className="mb-20 text-center"
        >
          <motion.span 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-block px-3 py-1 mb-4 text-sm font-medium tracking-wider text-blue-600 uppercase rounded-full bg-blue-100/80"
          >
            Collaboration
          </motion.span>
          <h2 className="mb-5 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Work With <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Us</span>
          </h2>
          <p className="max-w-3xl mx-auto text-xl leading-relaxed text-gray-600">
            Join our growing ecosystem of creators, marketers, and innovators building the future of content.
          </p>
        </motion.div>

        <div className="z-50 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {reasons.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.1,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <Link 
                href={item.link} 
                className="z-50 block h-full p-1 transition-all duration-300 rounded-2xl bg-gradient-to-br hover:shadow-lg hover:shadow-blue-100/50"
              >
                <div className="h-full p-8 transition-all duration-300 bg-white rounded-xl group-hover:bg-gray-50/50">
                  <div className={`flex items-center justify-center w-16 h-16 mb-6 text-white rounded-xl bg-gradient-to-r ${item.gradient}`}>
                    <item.icon className="w-7 h-7" />
                  </div>
                  <h3 className="mb-3 text-2xl font-bold text-gray-900">{item.title}</h3>
                  <p className="mb-6 text-gray-600">{item.description}</p>
                  <div className="inline-flex items-center text-sm font-medium text-blue-600 group-hover:underline">
                    Learn more
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1"
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WorkwithUS;