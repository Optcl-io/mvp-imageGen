import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

// Featured guide
const featuredGuide = {
  title: 'Creating Digital Signage That Drives Sales',
  slug: 'digital-signage-sales',
  excerpt: 'Learn how to design attention-grabbing digital signage content that effectively promotes products and increases sales in retail environments.',
  image: '/images/guides/digital-signage-guide.jpg',
  author: {
    name: 'Sarah Johnson',
    role: 'Marketing Director',
    image: '/images/team/sarah-johnson.jpg',
  },
  category: 'Digital Signage',
  readTime: '8 min read',
  date: 'June 15, 2023',
};

// Guide categories with example guides
const guideCategories = [
  {
    name: 'Getting Started',
    guides: [
      {
        title: 'Your First Digital Content Generation',
        slug: 'first-generation',
        excerpt: 'A step-by-step walkthrough of creating your first AI-generated digital content piece.',
        image: '/images/guides/first-generation.jpg',
        readTime: '6 min read',
      },
      {
        title: 'Setting Up Your Brand Profile',
        slug: 'brand-profile-setup',
        excerpt: 'How to configure your brand settings for consistent, on-brand content generation.',
        image: '/images/guides/brand-profile.jpg',
        readTime: '5 min read',
      },
      {
        title: 'Understanding AI Generation Parameters',
        slug: 'generation-parameters',
        excerpt: 'Learn what each generation parameter does and how to adjust them for best results.',
        image: '/images/guides/parameters.jpg',
        readTime: '10 min read',
      },
    ],
  },
  {
    name: 'Platform-Specific Guides',
    guides: [
      {
        title: 'Instagram-Optimized Content Creation',
        slug: 'instagram-optimization',
        excerpt: 'Best practices for creating content that performs well on Instagram.',
        image: '/images/guides/instagram-guide.jpg',
        readTime: '7 min read',
      },
      {
        title: 'TikTok Marketing Content',
        slug: 'tiktok-content',
        excerpt: 'How to generate attention-grabbing content for TikTok marketing campaigns.',
        image: '/images/guides/tiktok-guide.jpg',
        readTime: '8 min read',
      },
      {
        title: 'Digital Signage Best Practices',
        slug: 'signage-best-practices',
        excerpt: 'Design principles for effective digital signage that captures attention and drives action.',
        image: '/images/guides/signage-guide.jpg',
        readTime: '9 min read',
      },
    ],
  },
  {
    name: 'Advanced Techniques',
    guides: [
      {
        title: 'Batch Processing for Product Catalogs',
        slug: 'batch-processing',
        excerpt: 'How to efficiently generate content for large numbers of products simultaneously.',
        image: '/images/guides/batch-processing.jpg',
        readTime: '7 min read',
      },
      {
        title: 'Color Psychology in Marketing Content',
        slug: 'color-psychology',
        excerpt: 'Using color effectively in your generated content to influence consumer behavior.',
        image: '/images/guides/color-psychology.jpg',
        readTime: '12 min read',
      },
      {
        title: 'Multi-Platform Content Strategy',
        slug: 'multi-platform-strategy',
        excerpt: 'Creating a cohesive content strategy across digital signage and social media platforms.',
        image: '/images/guides/multi-platform.jpg',
        readTime: '11 min read',
      },
    ],
  },
];

// Recent guides list
const recentGuides = [
  {
    title: 'Optimizing Content for Retail Environments',
    slug: 'retail-optimization',
    excerpt: 'Strategies for creating digital content that performs well in in-store retail settings.',
    image: '/images/guides/retail-guide.jpg',
    category: 'Digital Signage',
    readTime: '7 min read',
    date: 'July 2, 2023',
  },
  {
    title: 'Seasonal Campaign Planning with AI',
    slug: 'seasonal-campaigns',
    excerpt: 'How to use our AI tools to quickly create and deploy seasonal marketing content.',
    image: '/images/guides/seasonal-guide.jpg',
    category: 'Content Strategy',
    readTime: '9 min read',
    date: 'June 28, 2023',
  },
  {
    title: 'Measuring Digital Signage Performance',
    slug: 'measuring-performance',
    excerpt: 'Key metrics and methods for tracking the effectiveness of your digital signage content.',
    image: '/images/guides/metrics-guide.jpg',
    category: 'Analytics',
    readTime: '10 min read',
    date: 'June 20, 2023',
  },
  {
    title: 'Accessibility in Digital Content',
    slug: 'accessibility-guide',
    excerpt: 'Best practices for creating accessible, inclusive digital marketing content.',
    image: '/images/guides/accessibility-guide.jpg',
    category: 'Best Practices',
    readTime: '8 min read',
    date: 'June 12, 2023',
  },
];

export default function GuidesPage() {
  return (
    <div className="bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8 lg:py-24">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Guides & Tutorials
            </h1>
            <p className="max-w-3xl mx-auto mt-6 text-xl text-blue-100">
              Practical tips, walkthroughs, and strategies to help you create effective digital content with our AI platform.
            </p>
          </div>
        </div>
      </div>

      {/* Featured guide */}
      <div className="py-16 bg-white">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Featured Guide
          </h2>
          
          <div className="flex flex-col overflow-hidden bg-white rounded-lg shadow-lg mt-8 lg:flex-row">
            <div className="relative w-full lg:w-1/2">
              <div className="relative h-64 lg:h-full">
                <Image
                  src={featuredGuide.image}
                  alt={featuredGuide.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute top-4 left-4">
                <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-800 bg-blue-100 rounded-full">
                  {featuredGuide.category}
                </span>
              </div>
            </div>
            <div className="p-8 lg:w-1/2">
              <div className="flex items-center mb-3">
                <div className="relative flex-shrink-0 w-10 h-10 rounded-full overflow-hidden">
                  <Image
                    src={featuredGuide.author.image}
                    alt={featuredGuide.author.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{featuredGuide.author.name}</p>
                  <p className="text-xs text-gray-500">{featuredGuide.author.role}</p>
                </div>
                <div className="flex items-center ml-auto text-sm text-gray-500">
                  <span>{featuredGuide.date}</span>
                  <span className="mx-2">•</span>
                  <span>{featuredGuide.readTime}</span>
                </div>
              </div>
              <h3 className="mb-4 text-2xl font-bold text-gray-900 sm:text-3xl">
                {featuredGuide.title}
              </h3>
              <p className="mb-6 text-lg text-gray-600">
                {featuredGuide.excerpt}
              </p>
              <Link
                href={`/guides/${featuredGuide.slug}`}
                className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700"
              >
                Read the guide <ChevronRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Guide categories */}
      <div className="py-16 bg-gray-50">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          {guideCategories.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-16">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
                  {category.name}
                </h2>
                <Link
                  href={`/guides/categories/${category.name.toLowerCase().replace(/ /g, '-')}`}
                  className="text-blue-600 hover:text-blue-500"
                >
                  View all
                </Link>
              </div>
              
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {category.guides.map((guide, guideIndex) => (
                  <div key={guideIndex} className="flex flex-col overflow-hidden bg-white rounded-lg shadow-md hover:shadow-lg transition">
                    <div className="relative h-48">
                      <Image
                        src={guide.image}
                        alt={guide.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col flex-1 p-6">
                      <h3 className="mb-2 text-xl font-bold text-gray-900">
                        {guide.title}
                      </h3>
                      <p className="flex-1 mb-4 text-sm text-gray-600">
                        {guide.excerpt}
                      </p>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-xs text-gray-500">{guide.readTime}</span>
                        <Link
                          href={`/guides/${guide.slug}`}
                          className="text-sm font-medium text-blue-600 hover:text-blue-500"
                        >
                          Read guide
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent guides */}
      <div className="py-16 bg-white">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <h2 className="mb-8 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Recent Guides
          </h2>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {recentGuides.map((guide, index) => (
              <Link
                key={index}
                href={`/guides/${guide.slug}`}
                className="flex overflow-hidden transition bg-white border border-gray-200 rounded-lg hover:shadow-md"
              >
                <div className="relative w-1/3">
                  <div className="h-full">
                    <Image
                      src={guide.image}
                      alt={guide.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="w-2/3 p-4">
                  <div className="flex items-center mb-2">
                    <span className="text-xs font-medium text-blue-600">{guide.category}</span>
                    <span className="mx-2 text-xs text-gray-500">•</span>
                    <span className="text-xs text-gray-500">{guide.readTime}</span>
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">
                    {guide.title}
                  </h3>
                  <p className="mb-2 text-sm text-gray-600 line-clamp-2">
                    {guide.excerpt}
                  </p>
                  <p className="text-xs text-gray-500">{guide.date}</p>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <Link
              href="/guides/archive"
              className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700"
            >
              Browse all guides
            </Link>
          </div>
        </div>
      </div>

      {/* Subscribe section */}
      <div className="py-16 bg-gray-50">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="px-6 py-8 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl md:py-16 md:px-12">
            <div className="max-w-lg mx-auto text-center">
              <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Get new guides in your inbox
              </h2>
              <p className="mt-3 text-lg text-blue-100">
                Subscribe to our newsletter for the latest tips, tutorials, and strategies for optimizing your digital content.
              </p>
              <div className="mt-8">
                <form className="sm:flex">
                  <label htmlFor="email-address" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="w-full px-5 py-3 placeholder-gray-500 border-white rounded-md focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-700"
                    placeholder="Enter your email"
                  />
                  <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3 sm:flex-shrink-0">
                    <button
                      type="submit"
                      className="flex items-center justify-center w-full px-5 py-3 text-base font-medium text-blue-600 bg-white border border-transparent rounded-md hover:bg-blue-50"
                    >
                      Subscribe
                    </button>
                  </div>
                </form>
                <p className="mt-3 text-sm text-blue-100">
                  We care about your data. Read our{' '}
                  <Link href="/privacy" className="font-medium text-white underline">
                    privacy policy
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 