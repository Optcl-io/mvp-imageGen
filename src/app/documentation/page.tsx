import Link from 'next/link';
import Image from 'next/image';
import { Search, Book, FileText, Code, Video, HelpCircle, ArrowRight, Terminal, Settings, Clock } from 'lucide-react';

const documentationSections = [
  {
    title: 'Getting Started',
    description: 'Learn the basics of using the digital content generator',
    icon: Book,
    guides: [
      { name: 'Platform Overview', href: '/documentation/overview', duration: '5 min read' },
      { name: 'Account Setup', href: '/documentation/account-setup', duration: '3 min read' },
      { name: 'Your First Generation', href: '/documentation/first-generation', duration: '8 min read' },
      { name: 'Understanding the Dashboard', href: '/documentation/dashboard', duration: '6 min read' },
    ],
  },
  {
    title: 'Content Generation',
    description: 'Master the art of creating optimized digital content',
    icon: FileText,
    guides: [
      { name: 'Uploading Product Images', href: '/documentation/uploading-images', duration: '4 min read' },
      { name: 'Generation Parameters', href: '/documentation/generation-parameters', duration: '7 min read' },
      { name: 'Platform Optimization', href: '/documentation/platform-optimization', duration: '5 min read' },
      { name: 'Batch Processing', href: '/documentation/batch-processing', duration: '6 min read' },
    ],
  },
  {
    title: 'Customization',
    description: 'Learn how to customize outputs for your specific needs',
    icon: Settings,
    guides: [
      { name: 'Brand Settings', href: '/documentation/brand-settings', duration: '6 min read' },
      { name: 'Text Customization', href: '/documentation/text-customization', duration: '4 min read' },
      { name: 'Visual Style Adjustments', href: '/documentation/visual-styles', duration: '8 min read' },
      { name: 'Templates', href: '/documentation/templates', duration: '5 min read' },
    ],
  },
  {
    title: 'Integration',
    description: 'Connect the platform with your existing tools',
    icon: Code,
    guides: [
      { name: 'Social Media Integration', href: '/documentation/social-media-integration', duration: '7 min read' },
      { name: 'Digital Signage Deployment', href: '/documentation/digital-signage', duration: '8 min read' },
      { name: 'Storage Connectors', href: '/documentation/storage-connectors', duration: '5 min read' },
      { name: 'API Documentation', href: '/documentation/api', duration: '15 min read' },
    ],
  },
  {
    title: 'Video Tutorials',
    description: 'Watch step-by-step video guides',
    icon: Video,
    guides: [
      { name: 'Platform Walkthrough', href: '/documentation/videos/walkthrough', duration: '12 min watch' },
      { name: 'Content Generation Process', href: '/documentation/videos/generation-process', duration: '8 min watch' },
      { name: 'Customization Tips', href: '/documentation/videos/customization', duration: '15 min watch' },
      { name: 'Advanced Features', href: '/documentation/videos/advanced-features', duration: '20 min watch' },
    ],
  },
  {
    title: 'Troubleshooting',
    description: 'Solutions to common issues and questions',
    icon: HelpCircle,
    guides: [
      { name: 'Common Issues', href: '/documentation/common-issues', duration: '10 min read' },
      { name: 'Image Requirements', href: '/documentation/image-requirements', duration: '5 min read' },
      { name: 'Generation Errors', href: '/documentation/generation-errors', duration: '7 min read' },
      { name: 'Contact Support', href: '/contact?subject=Support', duration: 'Help Center' },
    ],
  },
];

export default function DocumentationPage() {
  return (
    <div className="bg-white">
      {/* Header */}
      <div className="relative overflow-hidden py-16 sm:py-24">
        <div className="absolute inset-0">
          <Image 
            src="https://images.unsplash.com/photo-1541560052-5e137f229371?q=80&w=1800" 
            alt="Documentation background"
            fill
            className="object-cover w-full h-full opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 opacity-90" />
        </div>
        <div className="relative px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Documentation
            </h1>
            <p className="mt-6 text-xl text-blue-100">
              Comprehensive guides and resources to help you make the most of our AI-powered digital content generator.
            </p>
          </div>
          
          {/* Search bar */}
          <div className="max-w-2xl px-4 mx-auto mt-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full py-3 pl-10 pr-4 text-gray-900 bg-white border-0 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Search documentation..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Documentation sections */}
      <div className="py-16">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
            {documentationSections.map((section, index) => (
              <div key={index} className="relative p-6 overflow-hidden bg-white border border-gray-200 rounded-lg hover:shadow-md transition">
                <div className="flex items-center mb-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100">
                    <section.icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="ml-3 text-xl font-semibold text-gray-900">{section.title}</h2>
                </div>
                <p className="mb-6 text-gray-600">{section.description}</p>
                
                <div className="space-y-3">
                  {section.guides.map((guide, guideIndex) => (
                    <Link
                      key={guideIndex}
                      href={guide.href}
                      className="flex items-center justify-between p-3 transition border border-gray-100 rounded-md hover:bg-gray-50 hover:border-gray-200"
                    >
                      <span className="text-gray-900">{guide.name}</span>
                      <div className="flex items-center">
                        <span className="text-xs text-gray-500">{guide.duration}</span>
                        <ArrowRight className="w-4 h-4 ml-2 text-gray-400" />
                      </div>
                    </Link>
                  ))}
                </div>
                
                <Link
                  href={`/documentation/categories/${section.title.toLowerCase().replace(/ /g, '-')}`}
                  className="inline-flex items-center mt-6 text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  View all {section.title.toLowerCase()} guides <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Popular articles */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900">Popular Articles</h2>
        <div className="grid grid-cols-1 gap-8 mt-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="overflow-hidden bg-white rounded-lg shadow">
            <div className="relative h-48">
              <Image 
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=600" 
                alt="Getting started with the platform" 
                fill 
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900">
                <Link href="/documentation/getting-started" className="hover:text-blue-600">
                  Getting started with the platform
                </Link>
              </h3>
              <p className="mt-2 text-base text-gray-500">Learn the basics of our AI-powered content generation platform and how to create your first project.</p>
              <div className="flex items-center mt-4">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="ml-2 text-sm text-gray-500">5 min read</span>
              </div>
            </div>
          </div>
          
          <div className="overflow-hidden bg-white rounded-lg shadow">
            <div className="relative h-48">
              <Image 
                src="https://images.unsplash.com/photo-1561069934-eee225952461?q=80&w=600" 
                alt="Optimizing content for digital signage" 
                fill 
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900">
                <Link href="/documentation/digital-signage-optimization" className="hover:text-blue-600">
                  Optimizing content for digital signage
                </Link>
              </h3>
              <p className="mt-2 text-base text-gray-500">Tips and best practices for creating effective digital signage content that captures attention and drives action.</p>
              <div className="flex items-center mt-4">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="ml-2 text-sm text-gray-500">8 min read</span>
              </div>
            </div>
          </div>
          
          <div className="overflow-hidden bg-white rounded-lg shadow">
            <div className="relative h-48">
              <Image 
                src="https://images.unsplash.com/photo-1516110833967-0b5716ca1387?q=80&w=600" 
                alt="Batch processing for multiple products" 
                fill 
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900">
                <Link href="/documentation/batch-processing" className="hover:text-blue-600">
                  Batch processing for multiple products
                </Link>
              </h3>
              <p className="mt-2 text-base text-gray-500">How to efficiently generate content for multiple products at once and organize the results.</p>
              <div className="flex items-center mt-4">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="ml-2 text-sm text-gray-500">6 min read</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Can't find answer */}
      <div className="py-16 bg-white">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="px-6 py-8 bg-blue-700 rounded-lg sm:py-12 sm:px-12 lg:flex lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Can&apos;t find what you&apos;re looking for?
              </h2>
              <p className="max-w-3xl mt-3 text-lg text-blue-100">
                Our support team is always ready to help with any questions you might have.
              </p>
            </div>
            <div className="mt-8 lg:mt-0 lg:ml-8">
              <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-blue-700 bg-white border border-transparent rounded-md shadow-sm hover:bg-blue-50"
                >
                  Contact Support
                </Link>
                <Link
                  href="/documentation/faq"
                  className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-white bg-transparent border border-white rounded-md hover:bg-blue-800"
                >
                  Browse FAQ
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 