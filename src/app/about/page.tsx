import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

// Team members data
const teamMembers = [
  {
    name: 'Emma Rodriguez',
    role: 'Co-Founder & CEO',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=500',
    bio: 'Former marketing executive with 15+ years of experience in digital advertising. Emma founded the company to solve the content creation bottleneck she experienced firsthand.',
  },
  {
    name: 'David Chen',
    role: 'Co-Founder & CTO',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=500',
    bio: 'AI researcher with a PhD in Computer Vision. David leads our technical team and has pioneered several breakthroughs in generative AI for marketing content.',
  },
  {
    name: 'Sophia Williams',
    role: 'Chief Design Officer',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=500',
    bio: 'Award-winning designer who oversees our creative algorithms and ensures all generated content meets the highest aesthetic standards.',
  },
  {
    name: 'Marcus Johnson',
    role: 'VP of Customer Success',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=500',
    bio: 'Former retail marketing director who ensures our platform delivers real business value to customers across all industries.',
  },
];

// Company values
const companyValues = [
  {
    title: 'Innovation First',
    description: 'We constantly push the boundaries of what\'s possible with AI to deliver cutting-edge solutions for digital content creation.',
  },
  {
    title: 'Customer Success',
    description: 'Our customers\' success is our success. We measure our impact by the real business outcomes we help our clients achieve.',
  },
  {
    title: 'Quality & Consistency',
    description: 'We believe AI-generated content should be indistinguishable from human-created work, maintaining the highest standards of quality.',
  },
  {
    title: 'Ethical AI',
    description: 'We develop our technology responsibly, with transparency about capabilities and limitations, and respect for creators and privacy.',
  },
];

// Milestones
const companyMilestones = [
  {
    year: '2020',
    title: 'Founded in San Francisco',
    description: 'Started with a mission to democratize professional content creation for businesses of all sizes.',
  },
  {
    year: '2021',
    title: 'First Generation Algorithm',
    description: 'Launched our proprietary AI model specialized in digital signage and social media content.',
  },
  {
    year: '2022',
    title: 'Series A Funding',
    description: 'Secured $12M in funding to expand our team and enhance our platform capabilities.',
  },
  {
    year: '2023',
    title: 'Platform Expansion',
    description: 'Expanded to support all major social media platforms and digital signage formats.',
  },
  {
    year: '2024',
    title: 'Enterprise Launch',
    description: 'Released Enterprise solution with advanced customization, API access, and dedicated support.',
  },
];

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="relative pt-16 pb-24 sm:pt-24 sm:pb-32">
          <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Our Story
              </h1>
              <p className="mt-6 text-xl leading-8 text-blue-100">
                We're building the future of digital content creation, making professional-quality marketing assets accessible to businesses of all sizes.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Mission section */}
      <div className="py-16 overflow-hidden bg-white sm:py-24">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid items-center grid-cols-1 gap-y-16 gap-x-8 lg:grid-cols-2">
            <div className="relative aspect-[3/2] lg:aspect-auto lg:h-96">
              <Image
                src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1000"
                alt="Our mission"
                fill
                className="object-cover rounded-2xl"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Our Mission
              </h2>
              <p className="mt-6 text-lg text-gray-600">
                We believe every business deserves access to professional-quality marketing content. Our AI-powered platform democratizes content creation, allowing companies of all sizes to compete effectively in the digital space without massive creative teams or budgets.
              </p>
              <p className="mt-4 text-lg text-gray-600">
                By automating the technical aspects of content creation while preserving creative control, we're empowering marketers and business owners to focus on strategy and results rather than production details.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Values section */}
      <div className="py-16 bg-gray-50 sm:py-24">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Our Values
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              These core principles guide everything we do, from product development to customer interactions.
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2">
            {companyValues.map((value, index) => (
              <div key={index} className="p-8 bg-white rounded-lg shadow-sm">
                <h3 className="text-xl font-bold text-gray-900">{value.title}</h3>
                <p className="mt-4 text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team section */}
      <div className="py-16 bg-white sm:py-24">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Meet Our Team
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Our diverse team brings together expertise in AI, design, marketing, and business to create a revolutionary content platform.
            </p>
          </div>
          <ul
            role="list"
            className="grid max-w-2xl grid-cols-1 gap-8 mx-auto mt-16 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-4"
          >
            {teamMembers.map((person) => (
              <li key={person.name} className="overflow-hidden bg-white rounded-xl shadow-sm">
                <div className="relative h-48">
                  <Image
                    src={person.image}
                    alt={person.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900">{person.name}</h3>
                  <p className="mt-1 text-sm text-blue-600">{person.role}</p>
                  <p className="mt-4 text-sm text-gray-600">{person.bio}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Company history/timeline */}
      <div className="py-16 bg-gray-50 sm:py-24">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Our Journey
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              From a small startup to a leader in AI-powered content generation.
            </p>
          </div>
          <div className="mt-16 max-w-lg mx-auto">
            <div className="flow-root">
              <ul role="list" className="-mb-8">
                {companyMilestones.map((milestone, index) => (
                  <li key={index}>
                    <div className="relative pb-8">
                      {index !== companyMilestones.length - 1 ? (
                        <span className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                      ) : null}
                      <div className="relative flex items-start space-x-4">
                        <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-full">
                          <span className="text-sm font-bold text-white">{milestone.year}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-bold text-gray-900">{milestone.title}</h3>
                          <p className="mt-1 text-gray-600">{milestone.description}</p>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Press section */}
      <div className="py-16 bg-white sm:py-24">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              As Featured In
            </h2>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 md:grid-cols-4">
            {['TechCrunch', 'Forbes', 'Business Insider', 'Fast Company'].map((press) => (
              <div key={press} className="flex justify-center">
                <div className="h-12 text-gray-400 flex items-center">
                  <span className="text-xl font-bold">{press}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Careers CTA */}
      <div className="py-16 bg-blue-600 sm:py-24">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-8">
            <div>
              <h2 className="max-w-md text-3xl font-bold tracking-tight text-white sm:text-4xl md:max-w-3xl">
                Join Our Team
              </h2>
              <p className="mt-4 text-lg text-blue-100">
                We're always looking for talented individuals who are passionate about AI, design, and helping businesses succeed.
              </p>
            </div>
            <div className="flex items-center">
              <Link
                href="/careers"
                className="inline-flex items-center px-6 py-3 text-base font-medium text-blue-600 bg-white border border-transparent rounded-md shadow-sm hover:bg-blue-50"
              >
                View Open Positions <ChevronRight className="w-5 h-5 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-16">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900">
            What Our Team Says
          </h2>
          <div className="grid grid-cols-1 gap-8 mt-12 md:grid-cols-2">
            <div className="p-6 bg-gray-50 rounded-lg">
              <p className="text-lg italic text-gray-600">
                "Working here gives me the opportunity to solve challenging AI problems while seeing the immediate impact on real businesses. The team is incredibly supportive and the work-life balance is excellent."
              </p>
              <div className="flex items-center mt-6">
                <div className="flex-shrink-0">
                  <div className="relative w-10 h-10 overflow-hidden rounded-full bg-blue-100">
                    <Image
                      src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=250"
                      alt="Employee portrait"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Alex Patel</p>
                  <p className="text-sm text-gray-500">Machine Learning Engineer</p>
                </div>
              </div>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg">
              <p className="text-lg italic text-gray-600">
                "I love the transparency and autonomy here. Everyone's voice is heard, and we're encouraged to experiment and learn. It's rewarding to help businesses create content that would otherwise require expensive agencies."
              </p>
              <div className="flex items-center mt-6">
                <div className="flex-shrink-0">
                  <div className="relative w-10 h-10 overflow-hidden rounded-full bg-blue-100">
                    <Image
                      src="https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?q=80&w=250"
                      alt="Employee portrait"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Mia Johnson</p>
                  <p className="text-sm text-gray-500">Product Designer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 