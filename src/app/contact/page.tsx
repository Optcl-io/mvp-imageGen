'use client';

import { useState } from 'react';
import { EnvelopeIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Mail, Phone, Linkedin, Twitter, Github } from 'lucide-react';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function ContactUsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch('/api/contact/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="z-50 bg-gradient-to-br from-gray-50 to-white">
      <div className="px-4 py-20 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          className="max-w-5xl mx-auto md:grid md:grid-cols-2 md:gap-12"
        >
          <div className="space-y-8">
            <motion.div variants={fadeIn}>
              <h2 className="text-3xl font-bold tracking-tight text-transparent text-gray-900 sm:text-4xl bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">
                Let's connect
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                We&apos;re here to help and answer any questions. Reach out and we&apos;ll respond as soon as we can.
              </p>
            </motion.div>
            
            <motion.div variants={fadeIn} className="space-y-6">
              <div className="flex items-start p-4 transition-all duration-300 rounded-lg hover:bg-gray-50/50 group">
                <div className="flex-shrink-0 p-3 rounded-lg bg-blue-50 group-hover:bg-blue-100">
                  <EnvelopeIcon className="w-6 h-6 text-blue-600" aria-hidden="true" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Email us</h3>
                  <p className="mt-1 text-base font-medium text-gray-900">support@optcl.com</p>
                </div>
              </div>
              
              <div className="flex items-start p-4 transition-all duration-300 rounded-lg hover:bg-gray-50/50 group">
                <div className="flex-shrink-0 p-3 rounded-lg bg-indigo-50 group-hover:bg-indigo-100">
                  <PhoneIcon className="w-6 h-6 text-indigo-600" aria-hidden="true" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Call us</h3>
                  <p className="mt-1 text-base font-medium text-gray-900">+1 (555) 123-4567</p>
                </div>
              </div>
              
              <div className="flex items-start p-4 transition-all duration-300 rounded-lg hover:bg-gray-50/50 group">
                <div className="flex-shrink-0 p-3 rounded-lg bg-purple-50 group-hover:bg-purple-100">
                  <MapPinIcon className="w-6 h-6 text-purple-600" aria-hidden="true" />
                </div>
                <div className="ml-4">
                  <h3 className="text-sm font-medium text-gray-500">Visit us</h3>
                  <p className="mt-1 text-base font-medium text-gray-900">123 Market Street</p>
                  <p className="text-base font-medium text-gray-900">San Francisco, CA 94103</p>
                </div>
              </div>
            </motion.div>
          </div>
          
          <motion.div variants={fadeIn} className="mt-12 sm:mt-16 md:mt-0">
            {success ? (
              <div className="p-6 border border-green-200 rounded-xl bg-green-50/50 backdrop-blur-sm">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-green-800">Message sent successfully!</h3>
                    <p className="mt-2 text-sm text-green-700">
                      Thank you for reaching out. We&apos;ll get back to you soon.
                    </p>
                    <button
                      onClick={() => setSuccess(false)}
                      className="inline-flex items-center px-4 py-2 mt-4 text-sm font-medium text-white transition-all duration-200 bg-green-600 border border-transparent rounded-lg shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                    >
                      Send another message
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-4 text-sm text-red-800 transition-all duration-300 border border-red-200 rounded-xl bg-red-50/50 backdrop-blur-sm">
                    {error}
                  </div>
                )}
                
                <div className="space-y-1">
                  <label htmlFor="name" className="text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    autoComplete="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 text-gray-900 transition-all duration-200 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400"
                  />
                </div>
                
                <div className="space-y-1">
                  <label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 text-gray-900 transition-all duration-200 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400"
                  />
                </div>
                
                <div className="space-y-1">
                  <label htmlFor="subject" className="text-sm font-medium text-gray-700">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    id="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 text-gray-900 transition-all duration-200 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400"
                  />
                </div>
                
                <div className="space-y-1">
                  <label htmlFor="message" className="text-sm font-medium text-gray-700">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 text-gray-900 transition-all duration-200 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 hover:border-gray-400"
                  />
                </div>
                
                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex items-center justify-center w-full px-6 py-3 text-base font-medium text-white transition-all duration-200 border border-transparent rounded-lg shadow-sm bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <svg className="w-5 h-5 mr-3 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </>
                    ) : 'Send Message'}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}