import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, Check } from 'lucide-react';

// Define the integrations categories and items
const integrationCategories = [
  {
    title: 'Social Media Platforms',
    description: 'Publish your generated content directly to leading social media platforms',
    integrations: [
      {
        name: 'Instagram',
        logo: '/images/integrations/instagram.svg',
        description: 'Post directly to Instagram feed and stories with proper formatting and sizing',
        features: ['One-click publishing', 'Feed and Stories formats', 'Multiple account support', 'Analytics tracking'],
        comingSoon: false,
      },
      {
        name: 'Facebook',
        logo: '/images/integrations/facebook.svg',
        description: 'Share your content across Facebook Pages, Groups, and personal profiles',
        features: ['Business Page support', 'Carousel posts', 'Scheduled posting', 'Audience targeting'],
        comingSoon: false,
      },
      {
        name: 'TikTok',
        logo: '/images/integrations/tiktok.svg',
        description: 'Generate and upload TikTok-optimized visual content',
        features: ['Vertical video format', 'Template library', 'Custom overlays', 'Hashtag suggestions'],
        comingSoon: false,
      },
      {
        name: 'Twitter',
        logo: '/images/integrations/twitter.svg',
        description: 'Create Twitter posts with properly sized images and optimized copy',
        features: ['Image formatting', 'Thread creation', 'Scheduled tweets', 'Analytics integration'],
        comingSoon: true,
      },
    ],
  },
  {
    title: 'Digital Signage Systems',
    description: 'Push content directly to your digital signage management platforms',
    integrations: [
      {
        name: 'ScreenCloud',
        logo: '/images/integrations/screencloud.svg',
        description: 'Seamlessly publish to ScreenCloud digital signage systems',
        features: ['Direct publishing', 'Content scheduling', 'Multiple display management', 'Layout templates'],
        comingSoon: false,
      },
      {
        name: 'Yodeck',
        logo: '/images/integrations/yodeck.svg',
        description: 'Create and manage content for Yodeck digital displays',
        features: ['Display grouping', 'Remote management', 'Content playlists', 'Real-time updates'],
        comingSoon: false,
      },
      {
        name: 'NoviSign',
        logo: '/images/integrations/novisign.svg',
        description: 'Generate and upload content directly to NoviSign digital signage',
        features: ['Template library', 'Layout customization', 'Multi-zone displays', 'Content rotation'],
        comingSoon: true,
      },
    ],
  },
  {
    title: 'Marketing & Design Tools',
    description: 'Integrate with your favorite marketing and design platforms',
    integrations: [
      {
        name: 'Canva',
        logo: '/images/integrations/canva.svg',
        description: 'Export AI-generated content directly to Canva for additional editing',
        features: ['Direct export', 'Template integration', 'Brand kit support', 'Asset library access'],
        comingSoon: false,
      },
      {
        name: 'HubSpot',
        logo: '/images/integrations/hubspot.svg',
        description: 'Push content to HubSpot for your marketing campaigns',
        features: ['Content library sync', 'Campaign integration', 'Email marketing assets', 'Landing page content'],
        comingSoon: false,
      },
      {
        name: 'Mailchimp',
        logo: '/images/integrations/mailchimp.svg',
        description: 'Create email-ready content for your Mailchimp campaigns',
        features: ['Email templates', 'Campaign content', 'A/B testing variants', 'Responsive designs'],
        comingSoon: true,
      },
    ],
  },
  {
    title: 'File Storage & Management',
    description: 'Automatically save your generated content to cloud storage platforms',
    integrations: [
      {
        name: 'Google Drive',
        logo: '/images/integrations/google-drive.svg',
        description: 'Store and organize your generated content in Google Drive',
        features: ['Automatic uploads', 'Folder organization', 'Sharing settings', 'Version history'],
        comingSoon: false,
      },
      {
        name: 'Dropbox',
        logo: '/images/integrations/dropbox.svg',
        description: 'Save content directly to your Dropbox account',
        features: ['Automatic syncing', 'Team folder support', 'Custom naming', 'Smart sharing'],
        comingSoon: false,
      },
      {
        name: 'OneDrive',
        logo: '/images/integrations/onedrive.svg',
        description: 'Store content in Microsoft OneDrive for business or personal use',
        features: ['Microsoft 365 integration', 'Team access', 'Custom metadata', 'Search functionality'],
        comingSoon: true,
      },
    ],
  },
];

export default function IntegrationsPage() {
  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8 lg:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Seamless Integrations
            </h1>
            <p className="mt-6 text-xl text-blue-100">
              Connect your AI-generated content with the platforms and tools you already use.
              Streamline your workflow with our powerful integrations.
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 w-full h-12 bg-white" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0, 0 80%)' }}></div>
      </div>

      {/* Integration categories */}
      <div className="py-16 bg-white">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="space-y-20">
            {integrationCategories.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <div className="mb-12 text-center">
                  <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                    {category.title}
                  </h2>
                  <p className="mt-4 text-lg text-gray-500">
                    {category.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 xl:grid-cols-3">
                  {category.integrations.map((integration, index) => (
                    <div 
                      key={index} 
                      className={`relative overflow-hidden transition-all duration-300 bg-white border rounded-lg ${
                        integration.comingSoon ? 'border-gray-200' : 'border-blue-200 hover:shadow-lg hover:border-blue-300'
                      }`}
                    >
                      {integration.comingSoon && (
                        <div className="absolute top-0 right-0 px-4 py-1 text-xs font-medium text-white transform rotate-45 translate-y-5 translate-x-8 bg-gradient-to-r from-yellow-400 to-yellow-500">
                          Coming Soon
                        </div>
                      )}
                      <div className="p-6">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 w-12 h-12 overflow-hidden bg-gray-100 rounded-lg">
                            <Image
                              src={integration.logo}
                              alt={integration.name}
                              width={48}
                              height={48}
                              className="object-contain w-full h-full p-2"
                            />
                          </div>
                          <div className="ml-4">
                            <h3 className="text-lg font-medium text-gray-900">{integration.name}</h3>
                          </div>
                        </div>
                        <p className="mt-4 text-gray-600">
                          {integration.description}
                        </p>
                        <ul className="mt-6 space-y-3">
                          {integration.features.map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-start">
                              <div className="flex-shrink-0">
                                <Check className={`w-5 h-5 ${integration.comingSoon ? 'text-gray-400' : 'text-green-500'}`} />
                              </div>
                              <p className={`ml-3 text-sm ${integration.comingSoon ? 'text-gray-400' : 'text-gray-600'}`}>
                                {feature}
                              </p>
                            </li>
                          ))}
                        </ul>
                        {!integration.comingSoon && (
                          <div className="mt-8">
                            <Link
                              href={`/integrations/${integration.name.toLowerCase()}`}
                              className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
                            >
                              Learn more <ChevronRight className="w-4 h-4 ml-1" />
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Enterprise integrations */}
      <div className="py-16 bg-gray-50">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Custom Enterprise Integrations
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Need a specialized integration for your business? Our team can build custom connections to your existing systems.
              </p>
              <div className="mt-8 space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Check className="w-5 h-5 text-green-500" />
                  </div>
                  <p className="ml-3 text-gray-600">
                    <span className="font-medium text-gray-900">API Access</span> - Integrate directly with our powerful API for custom workflows
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Check className="w-5 h-5 text-green-500" />
                  </div>
                  <p className="ml-3 text-gray-600">
                    <span className="font-medium text-gray-900">Dedicated Support</span> - Work with our engineers to build exactly what you need
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Check className="w-5 h-5 text-green-500" />
                  </div>
                  <p className="ml-3 text-gray-600">
                    <span className="font-medium text-gray-900">Customized Workflows</span> - Design automated processes specific to your business
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Check className="w-5 h-5 text-green-500" />
                  </div>
                  <p className="ml-3 text-gray-600">
                    <span className="font-medium text-gray-900">Private Deployments</span> - On-premise or dedicated cloud solutions available
                  </p>
                </div>
              </div>
              <div className="mt-10">
                <Link
                  href="/contact?subject=Enterprise%20Integration"
                  className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700"
                >
                  Contact Sales About Enterprise Integrations
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="p-8 bg-white rounded-lg shadow-xl">
                <h3 className="text-xl font-semibold text-gray-900">Integration Request Form</h3>
                <p className="mt-2 text-gray-600">
                  Don't see the integration you need? Let us know what you're looking for.
                </p>
                <form className="mt-6 space-y-4">
                  <div>
                    <label htmlFor="service" className="block text-sm font-medium text-gray-700">
                      Service/Platform
                    </label>
                    <input
                      type="text"
                      name="service"
                      id="service"
                      className="block w-full px-4 py-3 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="What service would you like to integrate with?"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Your Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      className="block w-full px-4 py-3 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="useCase" className="block text-sm font-medium text-gray-700">
                      Use Case
                    </label>
                    <textarea
                      name="useCase"
                      id="useCase"
                      rows={3}
                      className="block w-full px-4 py-3 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Briefly describe how you would use this integration"
                    ></textarea>
                  </div>
                  <div>
                    <button
                      type="button"
                      className="flex justify-center w-full px-4 py-3 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Submit Request
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="py-16 bg-white">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="px-6 py-8 bg-blue-700 rounded-lg md:py-12 md:px-12 lg:py-16 lg:px-16 xl:flex xl:items-center">
            <div className="xl:w-0 xl:flex-1">
              <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Ready to connect your marketing stack?
              </h2>
              <p className="max-w-3xl mt-3 text-lg text-blue-100">
                Start using our AI content generator with your favorite platforms today. Create once, publish everywhere.
              </p>
            </div>
            <div className="mt-8 sm:w-full sm:max-w-md xl:mt-0 xl:ml-8">
              <Link
                href="/auth/register"
                className="flex items-center justify-center w-full px-5 py-3 text-base font-medium text-blue-600 bg-white border border-transparent rounded-md shadow hover:bg-blue-50"
              >
                Get Started Free
              </Link>
              <p className="mt-3 text-sm text-blue-100 text-center">
                No credit card required for trial.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 