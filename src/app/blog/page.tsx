import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, Tag } from 'lucide-react';

// Featured post
const featuredPost = {
  title: 'How AI is Transforming Digital Marketing for Retail',
  slug: 'ai-transforming-digital-marketing-retail',
  excerpt: 'Discover how retailers are leveraging AI-powered content generation to streamline their marketing efforts across digital signage and social media, leading to increased engagement and sales.',
  image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=1000',
  date: 'June 8, 2024',
  readTime: '9 min read',
  author: {
    name: 'Emma Rodriguez',
    role: 'CEO',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=250',
  },
  category: 'Industry Insights',
};

// Recent blog posts
const recentPosts = [
  {
    title: '5 Ways to Optimize Your Digital Signage Content',
    slug: 'optimize-digital-signage-content',
    excerpt: 'Learn proven strategies to maximize the impact of your in-store digital displays with AI-generated content that drives customer engagement and purchasing decisions.',
    image: 'https://images.unsplash.com/photo-1587614382346-4ec70e388b28?q=80&w=500',
    date: 'May 25, 2024',
    readTime: '7 min read',
    author: {
      name: 'Marcus Johnson',
      role: 'VP of Customer Success',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=250',
    },
    category: 'Best Practices',
  },
  {
    title: 'The Psychology of Color in Marketing Content',
    slug: 'psychology-color-marketing-content',
    excerpt: 'Understand how color choices in your marketing assets affect consumer perception and behavior, and how our AI platform optimizes color selection for maximum impact.',
    image: 'https://images.unsplash.com/photo-1579547945413-497e1b99dac0?q=80&w=500',
    date: 'May 12, 2024',
    readTime: '11 min read',
    author: {
      name: 'Sophia Williams',
      role: 'Chief Design Officer',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=250',
    },
    category: 'Design',
  },
  {
    title: 'From Product Photo to Marketing Campaign: A Complete Workflow',
    slug: 'product-photo-to-marketing-campaign',
    excerpt: 'Follow along as we demonstrate how to transform a simple product photo into a complete multi-channel marketing campaign using our AI content generator.',
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=500',
    date: 'April 30, 2024',
    readTime: '12 min read',
    author: {
      name: 'David Chen',
      role: 'CTO',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=250',
    },
    category: 'Tutorials',
  },
];

// Popular categories
const categories = [
  { name: 'Tutorials', count: 14, slug: 'tutorials' },
  { name: 'Industry Insights', count: 9, slug: 'industry-insights' },
  { name: 'Best Practices', count: 12, slug: 'best-practices' },
  { name: 'Product Updates', count: 8, slug: 'product-updates' },
  { name: 'Case Studies', count: 6, slug: 'case-studies' },
  { name: 'Design', count: 10, slug: 'design' },
];

// Recent posts (compact list)
const compactPosts = [
  {
    title: 'Announcing Batch Processing for Enterprise Users',
    slug: 'batch-processing-enterprise',
    date: 'April 15, 2024',
    category: 'Product Updates',
  },
  {
    title: 'How to Create Platform-Specific Content That Converts',
    slug: 'platform-specific-content-converts',
    date: 'April 3, 2024',
    category: 'Tutorials',
  },
  {
    title: 'Q1 2024: Digital Marketing Trends for SMBs',
    slug: 'q1-2024-digital-marketing-trends',
    date: 'March 28, 2024',
    category: 'Industry Insights',
  },
  {
    title: 'Restaurant Chain Boosts Engagement by 43% with AI-Generated Signage',
    slug: 'restaurant-chain-engagement-case-study',
    date: 'March 12, 2024',
    category: 'Case Studies',
  },
];

export default function BlogPage() {
  return (
    <div className="bg-white">
      {/* Header */}
      <div className="relative overflow-hidden bg-blue-600">
        <div className="absolute inset-y-0 w-full h-full" aria-hidden="true">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-800 to-indigo-900 opacity-90" />
        </div>
        <div className="relative px-4 pt-16 pb-20 sm:px-6 sm:pt-24 sm:pb-28 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Our Blog
            </h1>
            <p className="max-w-xl mx-auto mt-6 text-xl text-blue-100">
              Insights, guides, and updates on AI-powered digital content creation
            </p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="px-4 mx-auto mt-12 max-w-7xl sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
          {/* Left content area */}
          <div className="lg:col-span-8">
            {/* Featured post */}
            <div className="mb-16">
              <div className="overflow-hidden bg-white rounded-lg shadow-md">
                <div className="relative h-72 sm:h-80 md:h-96">
                  <Image
                    src={featuredPost.image}
                    alt={featuredPost.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-800 bg-blue-100 rounded-full">
                      {featuredPost.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-3 space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{featuredPost.date}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      <span>{featuredPost.readTime}</span>
                    </div>
                  </div>
                  <h2 className="mb-3 text-2xl font-bold text-gray-900 sm:text-3xl">
                    <Link href={`/blog/${featuredPost.slug}`} className="hover:text-blue-600">
                      {featuredPost.title}
                    </Link>
                  </h2>
                  <p className="mb-5 text-lg text-gray-600">
                    {featuredPost.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="relative flex-shrink-0 w-10 h-10 mr-3 rounded-full overflow-hidden">
                        <Image
                          src={featuredPost.author.image}
                          alt={featuredPost.author.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{featuredPost.author.name}</p>
                        <p className="text-xs text-gray-500">{featuredPost.author.role}</p>
                      </div>
                    </div>
                    <Link
                      href={`/blog/${featuredPost.slug}`}
                      className="text-sm font-semibold text-blue-600 hover:text-blue-500"
                    >
                      Read article →
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent posts grid */}
            <div>
              <h2 className="mb-8 text-2xl font-bold text-gray-900">Recent Articles</h2>
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                {recentPosts.map((post) => (
                  <div key={post.slug} className="flex flex-col overflow-hidden bg-white rounded-lg shadow-md">
                    <div className="relative h-48">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium text-blue-800 bg-blue-100 rounded-full">
                          {post.category}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col flex-1 p-6">
                      <div className="flex items-center mb-2 space-x-3 text-xs text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          <span>{post.date}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                      <h3 className="mb-2 text-lg font-bold text-gray-900">
                        <Link href={`/blog/${post.slug}`} className="hover:text-blue-600">
                          {post.title}
                        </Link>
                      </h3>
                      <p className="flex-1 mb-4 text-sm text-gray-600">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center mt-auto">
                        <div className="relative flex-shrink-0 w-8 h-8 mr-2 rounded-full overflow-hidden">
                          <Image
                            src={post.author.image}
                            alt={post.author.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="text-xs font-medium text-gray-900">{post.author.name}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-10 text-center">
                <Link
                  href="/blog/archive"
                  className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700"
                >
                  View all articles
                </Link>
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="lg:col-span-4">
            {/* Categories */}
            <div className="p-6 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-bold text-gray-900">Categories</h3>
              <div className="mt-4 space-y-3">
                {categories.map((category) => (
                  <Link 
                    key={category.slug}
                    href={`/blog/category/${category.slug}`}
                    className="flex items-center justify-between text-gray-600 hover:text-blue-600"
                  >
                    <span className="flex items-center">
                      <Tag className="w-4 h-4 mr-2" />
                      {category.name}
                    </span>
                    <span className="text-sm text-gray-400">
                      {category.count}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent posts (compact) */}
            <div className="p-6 mt-8 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-bold text-gray-900">Recent Posts</h3>
              <div className="mt-4 space-y-5">
                {compactPosts.map((post) => (
                  <div key={post.slug} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-sm font-medium text-gray-900 hover:text-blue-600"
                    >
                      {post.title}
                    </Link>
                    <div className="flex items-center mt-1 space-x-3 text-xs text-gray-500">
                      <span>{post.date}</span>
                      <span>•</span>
                      <span>{post.category}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Newsletter signup */}
            <div className="p-6 mt-8 bg-blue-600 rounded-lg">
              <h3 className="text-lg font-bold text-white">Subscribe to our newsletter</h3>
              <p className="mt-2 text-sm text-blue-100">
                Get the latest articles, guides, and industry insights delivered to your inbox.
              </p>
              <form className="mt-4">
                <div>
                  <label htmlFor="email-address" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="email-address"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="w-full px-4 py-2 text-sm text-gray-900 placeholder-gray-500 bg-white border-white rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-700 focus:ring-white"
                    placeholder="Enter your email"
                  />
                </div>
                <div className="mt-3">
                  <button
                    type="submit"
                    className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-transparent rounded-md hover:bg-blue-50"
                  >
                    Subscribe
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 