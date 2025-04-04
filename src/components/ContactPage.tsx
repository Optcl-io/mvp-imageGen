'use client';

import { motion } from 'framer-motion';
import { Send, Mail, Phone, MapPin } from 'lucide-react';
import { useState } from 'react';

const ContactPage = () => {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      // Submit form data to API endpoint
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formState),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }
      
      setSubmitSuccess(true);
      setFormState({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError(error instanceof Error ? error.message : "There was an error submitting your message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      details: 'info@optcl.de',
      link: 'mailto:info@optcl.de'
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: '+49 157 38813286',
      link: 'tel:+4915738813286'
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      details: 'Wahnerstraße 1, 50679 Köln',
      link: 'https://www.google.com/maps/place/Wahner+Str.+1,+50679+K%C3%B6ln,+Germany/@50.932664,6.9689259,17z/data=!3m1!4b1!4m6!3m5!1s0x47bf25ca572dba59:0x37af99c8de4035f4!8m2!3d50.9326606!4d6.9715008!16s%2Fg%2F11c2gwh135?entry=ttu&g_ep=EgoyMDI1MDMyNC4wIKXMDSoASAFQAw%3D%3D'
    }
  ];

  return (
    <div className="w-full h-full py-20 bg-white" id="contact">
      <div className="container px-6 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold text-gray-900">
            Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">Touch</span>
          </h2>
          <p className="max-w-3xl mx-auto text-xl text-gray-600">
            Have questions or want to learn more? Reach out to our team.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2"
          >
            <div className="p-8 bg-white shadow-lg rounded-2xl">
              {submitSuccess ? (
                <div className="p-6 text-center">
                  <div className="flex items-center justify-center w-16 h-16 mx-auto mb-6 text-white bg-green-500 rounded-full">
                    <Send className="w-8 h-8" />
                  </div>
                  <h3 className="mb-4 text-2xl font-bold text-gray-900">Message Sent!</h3>
                  <p className="mb-6 text-gray-600">
                    Thank you for reaching out. We&apos;ll get back to you as soon as possible.
                  </p>
                  <button
                    onClick={() => setSubmitSuccess(false)}
                    className="px-8 py-3 font-medium text-white transition-all bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formState.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">
                        Your Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formState.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="subject" className="block mb-2 text-sm font-medium text-gray-900">
                        Subject
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formState.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="How can we help you?"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900">
                        Your Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formState.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="w-full px-4 py-3 text-gray-900 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Tell us what you need..."
                      />
                    </div>
                  </div>

                  {submitError && (
                    <div className="p-4 mt-6 text-red-700 bg-red-100 rounded-lg">
                      {submitError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`inline-flex items-center px-8 py-3 mt-6 font-medium text-white transition-all bg-blue-600 rounded-lg ${
                      isSubmitting ? 'opacity-75 cursor-not-allowed' : 'hover:bg-blue-700'
                    }`}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                    <Send className="w-4 h-4 ml-2" />
                  </button>
                </form>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex flex-col h-full p-8 bg-white rounded-2xl">
              <h3 className="mb-6 text-xl font-bold text-gray-900">Contact Information</h3>
              
              <div className="space-y-6">
                {contactInfo.map((item, index) => (
                  <a 
                    key={index}
                    href={item.link}
                    className="flex items-start p-4 transition-all border border-gray-200 rounded-xl hover:border-blue-300 hover:bg-blue-50"
                  >
                    <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 mr-4 text-blue-600 bg-blue-100 rounded-lg">
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{item.title}</h4>
                      <p className="mt-1 text-sm text-gray-600">{item.details}</p>
                    </div>
                  </a>
                ))}
              </div>
{/* 
              <div className="mt-8">
                <h4 className="mb-4 text-lg font-medium text-gray-900">Follow Us</h4>
                <div className="flex space-x-4">

                </div>
              </div> */}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage; 