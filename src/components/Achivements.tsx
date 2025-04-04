'use client';

import { motion } from 'framer-motion';

const Achivements = () => {
  const achievements = [
    {
      title: 'Users',
      value: '5,000+',
      prefix: '',
      suffix: '',
      description: 'Active users worldwide',
    },
    {
      title: 'Content Created',
      value: '500K+',
      prefix: '',
      suffix: '',
      description: 'Marketing pieces generated',
    },
    {
      title: 'Avg. ROI',
      value: '320',
      prefix: '',
      suffix: '%',
      description: 'Return on investment',
    },
    {
      title: 'Time Saved',
      value: '1.2M+',
      prefix: '',
      suffix: 'hrs',
      description: 'Designer hours saved',
    },
  ];

  return (
    <div className="py-20 bg-white">
      <div className="max-w-7xl px-6 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Powering Marketing Teams Everywhere
          </h2>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            Our AI platform has revolutionized how businesses create content
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {achievements.map((achievement, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative p-6 overflow-hidden bg-white border rounded-2xl border-gray-200/60 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col">
                <h3 className="text-base font-semibold text-gray-500">
                  {achievement.title}
                </h3>
                <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900">
                  {achievement.prefix}
                  {achievement.value}
                  <span>{achievement.suffix}</span>
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {achievement.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Achivements; 