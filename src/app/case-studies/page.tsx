import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

// Featured case study
const featuredCaseStudy = {
  title: "MetroRetail's Digital Signage Transformation",
  slug: "metroretail-digital-signage",
  summary: "How a national retail chain increased in-store engagement by 78% with AI-generated digital signage content.",
  category: "Retail",
  image: "https://images.unsplash.com/photo-1581091877018-dac6a371d50f?q=80&w=1200",
  logo: "https://images.unsplash.com/photo-1614036417651-efe5912149d8?q=80&w=300",
  challenge: "MetroRetail struggled with maintaining consistent, engaging digital signage content across 120+ stores nationwide. Their small design team couldn't keep up with seasonal changes and promotions, resulting in outdated displays and missed marketing opportunities.",
  solution: "By implementing our AI-powered content generation platform, MetroRetail automated the creation of tailored digital signage content for each store location. The platform integrated with their inventory system to highlight relevant products and promotions based on store-specific data.",
  results: [
    "78% increase in customer engagement with digital displays",
    "42% reduction in content production costs",
    "85% decrease in time-to-deploy for new promotional campaigns",
    "23% lift in sales for products featured on AI-generated displays"
  ],
  quote: {
    text: "The platform transformed how we approach in-store marketing. Our digital displays are now always up-to-date and relevant to each location, with virtually no manual work required from our team.",
    author: "Sarah Chen",
    title: "Chief Marketing Officer, MetroRetail"
  }
};

// Case studies list
const caseStudies = [
  {
    title: "FoodDelight&apos;s TikTok success",
    slug: "fooddelights-tiktok-success",
    summary: "How a specialty food brand achieved 2.5M+ TikTok impressions using AI-generated video content.",
    category: "Social Media",
    image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=600",
    logo: "https://images.unsplash.com/photo-1597737156646-fa5ce5cfe315?q=80&w=200"
  },
  {
    title: "TechNova's Multi-Platform Strategy",
    slug: "technova-multi-platform",
    summary: "A B2B tech company streamlined content creation across 6 different platforms, increasing lead generation by 156%.",
    category: "B2B Marketing",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=600",
    logo: "https://images.unsplash.com/photo-1563986768711-b3bde3dc821e?q=80&w=200"
  },
  {
    title: "Global Bank's Digital Transformation",
    slug: "global-bank-transformation",
    summary: "How a financial institution used AI-generated content to modernize their branch displays and digital communications.",
    category: "Finance",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=600",
    logo: "https://images.unsplash.com/photo-1622204336970-38121c567f98?q=80&w=200"
  },
  {
    title: "FastFashion's Seasonal Campaigns",
    slug: "fastfashion-seasonal",
    summary: "A fashion retailer automated their seasonal campaign creation, reducing time-to-market by 65% while maintaining brand consistency.",
    category: "Retail",
    image: "https://images.unsplash.com/photo-1551232864-3f0890e580d9?q=80&w=600",
    logo: "https://images.unsplash.com/photo-1526014184584-1805c81e5408?q=80&w=200"
  },
  {
    title: "TravelEase's Destination Marketing",
    slug: "travelease-destination",
    summary: "How a travel agency automatically generated customized destination marketing materials for 200+ locations.",
    category: "Travel",
    image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=600",
    logo: "https://images.unsplash.com/photo-1496372412473-e8548ffd82bc?q=80&w=200"
  },
  {
    title: "HealthPlus Medical Center",
    slug: "healthplus-medical",
    summary: "A healthcare provider improved patient education with AI-generated informational displays throughout their facilities.",
    category: "Healthcare",
    image: "https://images.unsplash.com/photo-1638202993928-7267aad84c31?q=80&w=600",
    logo: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=200"
  },
];

export default function CaseStudiesPage() {
  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 sm:py-24">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Customer Success Stories
            </h1>
            <p className="mt-6 text-xl text-blue-100">
              See how businesses are transforming their marketing content with our AI-powered digital content generator.
            </p>
          </div>
        </div>
      </div>

      {/* Featured case study */}
      <div className="overflow-hidden bg-white">
        <div className="relative px-4 py-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="absolute top-0 bottom-0 hidden w-screen left-3/4 bg-gray-50 lg:block" />
          <div className="mx-auto text-base max-w-prose lg:grid lg:grid-cols-2 lg:gap-8 lg:max-w-none">
            <div>
              <div className="flex items-center space-x-4">
                <div className="relative flex-shrink-0 w-12 h-12 overflow-hidden rounded-full">
                  <Image 
                    src={featuredCaseStudy.logo} 
                    alt={featuredCaseStudy.title}
                    width={48}
                    height={48}
                    className="object-contain"
                  />
                </div>
                <div>
                  <h2 className="text-base font-semibold tracking-wide text-indigo-600 uppercase">
                    Featured Case Study
                  </h2>
                  <p className="text-gray-500">{featuredCaseStudy.category}</p>
                </div>
              </div>
              <h3 className="mt-6 text-3xl font-bold text-gray-900">
                {featuredCaseStudy.title}
              </h3>
            </div>
          </div>
          <div className="mt-8 lg:grid lg:grid-cols-2 lg:gap-8">
            <div className="relative lg:row-start-1 lg:col-start-2">
              <div className="relative mx-auto text-base max-w-prose lg:max-w-none">
                <figure>
                  <div className="aspect-w-16 aspect-h-9 lg:aspect-w-3 lg:aspect-h-2">
                    <div className="relative h-[300px] lg:h-[400px] overflow-hidden rounded-lg shadow-lg">
                      <Image
                        src={featuredCaseStudy.image}
                        alt={featuredCaseStudy.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                </figure>
              </div>
            </div>
            <div className="mt-8 lg:mt-0">
              <div className="mx-auto text-base max-w-prose lg:max-w-none">
                <h4 className="text-lg font-medium text-gray-900">The Challenge</h4>
                <p className="mt-2 text-base text-gray-500">
                  {featuredCaseStudy.challenge}
                </p>
                
                <div className="mt-6">
                  <h4 className="text-lg font-medium text-gray-900">The Solution</h4>
                  <p className="mt-2 text-base text-gray-500">
                    {featuredCaseStudy.solution}
                  </p>
                </div>
                
                <div className="mt-6">
                  <h4 className="text-lg font-medium text-gray-900">The Results</h4>
                  <p className="mt-2 text-base text-gray-500">
                    {featuredCaseStudy.results.join(', ')}
                  </p>
                </div>
                
                <div className="p-6 mt-8 bg-blue-50 rounded-xl">
                  <blockquote className="italic text-gray-700">
                    "{featuredCaseStudy.quote.text}"
                  </blockquote>
                  <p className="mt-4 text-sm font-medium text-gray-900">
                    {featuredCaseStudy.quote.author}, {featuredCaseStudy.quote.title}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* More case studies */}
      <div className="py-16 bg-gray-50 sm:py-24">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              More Success Stories
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Discover how companies across industries are achieving remarkable results with our platform.
            </p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 mt-12 sm:grid-cols-2 lg:grid-cols-3">
            {caseStudies.map((caseStudy, index) => (
              <div key={index} className="overflow-hidden bg-white rounded-lg shadow-md">
                <div className="relative h-48">
                  <Image
                    src={caseStudy.image}
                    alt={caseStudy.title}
                    fill
                    className="object-cover w-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60" />
                  <div className="absolute bottom-0 left-0 p-4">
                    <span className="inline-block px-3 py-1 text-xs font-semibold text-white bg-blue-600 rounded-full">
                      {caseStudy.category}
                    </span>
                  </div>
                </div>
                <div className="relative px-6 pt-6 pb-14">
                  <div className="relative w-12 h-12 mb-4 overflow-hidden bg-white rounded-full ring-2 ring-gray-200">
                    <Image
                      src={caseStudy.logo}
                      alt={`${caseStudy.title} logo`}
                      width={48}
                      height={48}
                      className="object-contain"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {caseStudy.title}
                  </h3>
                  <p className="mt-2 text-gray-600">
                    {caseStudy.summary}
                  </p>
                  <div className="absolute bottom-6 right-6">
                    <Link
                      href={`/case-studies/${caseStudy.slug}`}
                      className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
                    >
                      Read full case study <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="py-16 bg-white sm:py-24">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="p-8 bg-blue-700 rounded-2xl sm:p-16">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Ready to become our next success story?
              </h2>
              <p className="mt-4 text-lg text-blue-100">
                Join the growing list of businesses transforming their digital content creation with AI.
              </p>
              <div className="mt-10">
                <Link
                  href="/auth/register"
                  className="inline-block px-8 py-3 font-medium text-blue-700 bg-white rounded-md hover:bg-blue-50"
                >
                  Start Your Free Trial
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 