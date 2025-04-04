'use client';

import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

const Pricing = () => {
  const { data: session } = useSession();
  const isLoggedIn = !!session;

  const plans = [
    {
      name: 'Free',
      description: 'Perfect for trying out AdMaker',
      price: '$0',
      billing: 'forever',
      features: [
        { text: '5 generations per month', included: true },
        { text: 'Basic image quality', included: true },
        { text: 'Standard support', included: true },
        { text: 'Access to basic templates', included: true },
        { text: 'Commercial usage', included: false },
        { text: 'Remove watermark', included: false },
        { text: 'Advanced customization', included: false },
        { text: 'Priority support', included: false },
      ],
      buttonText: isLoggedIn ? 'Current Plan' : 'Sign Up Free',
      buttonLink: isLoggedIn ? '/dashboard' : '/sign-up',
      highlighted: false,
      disabled: isLoggedIn,
    },
    {
      name: 'Pro',
      description: 'For professionals and growing businesses',
      price: '$19',
      billing: 'per month',
      features: [
        { text: 'Unlimited generations', included: true },
        { text: 'HD image quality', included: true },
        { text: 'Priority support', included: true },
        { text: 'Access to all templates', included: true },
        { text: 'Commercial usage', included: true },
        { text: 'Remove watermark', included: true },
        { text: 'Advanced customization', included: true },
        { text: 'API access', included: false },
      ],
      buttonText: 'Upgrade to Pro',
      buttonLink: '/pricing',
      highlighted: true,
      disabled: false,
    },
    {
      name: 'Enterprise',
      description: 'For organizations with advanced needs',
      price: 'Custom',
      billing: 'pricing',
      features: [
        { text: 'Everything in Pro', included: true },
        { text: 'Dedicated account manager', included: true },
        { text: 'SLA & premium support', included: true },
        { text: 'Custom templates', included: true },
        { text: 'White labeling', included: true },
        { text: 'API access', included: true },
        { text: 'Custom integrations', included: true },
        { text: 'Team management', included: true },
      ],
      buttonText: 'Contact Sales',
      buttonLink: '/contact?subject=Enterprise',
      highlighted: false,
      disabled: false,
    },
  ];

  const renderCheck = (included: boolean) => {
    return included ? 
      <Check className="w-5 h-5 text-green-500" /> : 
      <X className="w-5 h-5 text-gray-300" />;
  };

  return (
    <div className="w-full py-20 bg-gray-50" id="pricing">
      <div className="container px-6 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="mb-4 text-4xl font-bold text-gray-900">
            Simple, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">Transparent</span> Pricing
          </h2>
          <p className="max-w-3xl mx-auto text-xl text-gray-600">
            Choose the perfect plan for your needs. No hidden fees or surprises.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-8 mt-12 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`overflow-hidden transition-all bg-white border rounded-2xl ${
                plan.highlighted
                  ? 'border-blue-500 shadow-xl shadow-blue-500/20 ring-2 ring-blue-500/20'
                  : 'border-gray-200 hover:shadow-lg'
              }`}
            >
              <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                <p className="mt-1 text-gray-600">{plan.description}</p>
                <div className="flex items-baseline mt-6">
                  <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                  <span className="ml-2 text-gray-600">{plan.billing}</span>
                </div>

                <ul className="mt-8 space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center">
                      <div className="flex-shrink-0 mr-2">
                        {renderCheck(feature.included)}
                      </div>
                      <span className={feature.included ? 'text-gray-900' : 'text-gray-400'}>{feature.text}</span>
                    </li>
                  ))}
                </ul>

                <Link 
                  href={plan.buttonLink}
                  className={`block w-full py-3 mt-12 text-center font-medium rounded-lg transition-colors ${
                    plan.highlighted
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : plan.disabled
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                  }`}
                >
                  {plan.buttonText}
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="p-8 mt-16 text-center bg-blue-50 rounded-2xl">
          <h3 className="text-xl font-bold text-gray-900">Need a custom solution?</h3>
          <p className="mt-2 text-gray-600">Contact our sales team to find the perfect plan for your specific requirements.</p>
          <Link
            href="/contact"
            className="inline-block px-8 py-3 mt-6 font-medium text-white transition-all bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Pricing; 