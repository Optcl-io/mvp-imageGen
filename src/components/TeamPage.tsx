'use client';

import { motion } from 'framer-motion';
import { Linkedin, Github, Twitter } from 'lucide-react';
import Image from 'next/image';

const TeamPage = () => {
  const team = [
    {
      name: 'Lasse Welz',
      role: 'Founder & CEO',
      bio: '',
      imageSrc: 'https://randomuser.me/api/portraits/women/44.jpg',
      social: {
        linkedin: '#',
        twitter: '#',
        github: '#'
      }
    },
    {
      name: 'Priyank Soni',
      role: 'Co-Founder & Chief Marketing Officer',
      bio: '',
      imageSrc: 'https://randomuser.me/api/portraits/men/32.jpg',
      social: {
        linkedin: '#',
        twitter: '#',
        github: '#'
      }
    },
    {
      name: 'Mukund Soni',
      role: 'Co-Founder & Chief Troubleshooting Officer',
      bio: '',
      imageSrc: 'https://randomuser.me/api/portraits/women/68.jpg',
      social: {
        linkedin: '#',
        twitter: '#',
        github: '#'
      }
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
            Meet Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">Team</span>
          </h2>
          <p className="max-w-3xl mx-auto text-xl text-gray-600">
            Passionate experts in AI, design, and marketing working to revolutionize content creation.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {team.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="overflow-hidden transition-all bg-white border border-gray-200 rounded-2xl hover:shadow-xl"
            >
              {/* <div className="relative w-full pt-[100%]">
                <Image
                  src={member.imageSrc}
                  alt={member.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover object-center"
                />
              </div> */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                <p className="text-blue-600">{member.role}</p>
                <p className="mt-3 text-gray-600">{member.bio}</p>
                
                <div className="flex mt-6 space-x-4">
                  <a href={member.social.linkedin} className="text-gray-500 hover:text-blue-600">
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a href={member.social.twitter} className="text-gray-500 hover:text-blue-400">
                    <Twitter className="w-5 h-5" />
                  </a>
                  <a href={member.social.github} className="text-gray-500 hover:text-gray-900">
                    <Github className="w-5 h-5" />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="p-8 mt-16 text-center bg-blue-50 rounded-2xl"
        >
          <h3 className="text-2xl font-bold text-gray-900">Join Our Team</h3>
          <p className="max-w-3xl mx-auto mt-4 text-gray-600">
            We&apos;re always looking for talented individuals to join our mission. Check out our open positions and apply today.
          </p>
          <a
            href="#careers"
            className="inline-block px-8 py-3 mt-6 font-medium text-white transition-all bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            View Open Positions
          </a>
        </motion.div> */}
      </div>
    </div>
  );
};

export default TeamPage; 