import Link from 'next/link';
import Image from 'next/image';
import { MapPin, ArrowRight, Check } from 'lucide-react';

// Company values
const companyValues = [
  {
    name: 'Innovation',
    description: 'We constantly push the boundaries of AI in design and marketing.'
  },
  {
    name: 'Impact',
    description: 'Our work helps businesses of all sizes compete in the digital landscape.'
  },
  {
    name: 'Diversity & Inclusion',
    description: 'We believe diverse perspectives lead to better products and decisions.'
  },
  {
    name: 'Work-Life Balance',
    description: 'We support flexible work arrangements and respect personal time.'
  }
];

// Benefits
const benefits = [
  {
    name: 'Competitive Salary & Equity',
    description: 'Share in our success with competitive compensation and equity packages.'
  },
  {
    name: 'Health & Wellness',
    description: 'Comprehensive health benefits, mental health support, and wellness programs.'
  },
  {
    name: 'Professional Growth',
    description: 'Learning stipends, mentorship programs, and career development paths.'
  },
  {
    name: 'Remote-Friendly',
    description: 'Work from anywhere with flexible hours and home office stipends.'
  },
  {
    name: 'Paid Time Off',
    description: 'Generous vacation policy, paid holidays, and parental leave.'
  },
  {
    name: 'Team Events',
    description: 'Regular team retreats, social events, and volunteer opportunities.'
  },
];

// Job openings
const jobOpenings = [
  {
    id: 'ml-engineer',
    title: 'Machine Learning Engineer',
    department: 'Engineering',
    location: 'San Francisco, CA (Remote Option)',
    type: 'Full-time',
    description: 'Design and implement advanced machine learning algorithms for our AI-powered content generation platform, focusing on computer vision and generative models.',
    requirements: [
      'MS or PhD in Computer Science, Machine Learning, or related field',
      '3+ years of experience with deep learning frameworks (PyTorch, TensorFlow)',
      'Strong background in computer vision and generative AI',
      'Experience deploying ML models to production',
    ]
  },
  {
    id: 'frontend-developer',
    title: 'Senior Frontend Developer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    description: 'Lead the development of our intuitive web application interfaces, focusing on creating seamless user experiences for our content generation platform.',
    requirements: [
      '5+ years of experience with modern JavaScript frameworks (React, Next.js)',
      'Strong TypeScript skills and component-based architecture',
      'Experience with responsive design and accessibility',
      'Background in design systems and UI/UX principles',
    ]
  },
  {
    id: 'product-manager',
    title: 'Product Manager',
    department: 'Product',
    location: 'New York, NY (Remote Option)',
    type: 'Full-time',
    description: 'Drive the strategy and roadmap for our AI content generation platform, balancing technical constraints with user needs and business goals.',
    requirements: [
      '4+ years of product management experience, preferably in SaaS or AI products',
      'Strong analytical skills and data-driven decision-making',
      'Excellent communication and stakeholder management abilities',
      'Experience with agile development methodologies',
    ]
  },
  {
    id: 'marketing-director',
    title: 'Director of Marketing',
    department: 'Marketing',
    location: 'San Francisco, CA (Remote Option)',
    type: 'Full-time',
    description: 'Lead our marketing strategy to position our AI content generation platform as the go-to solution for businesses seeking to enhance their digital marketing assets.',
    requirements: [
      '8+ years of marketing experience, with 3+ years in SaaS or B2B technology',
      'Track record of successful go-to-market strategies',
      'Experience with digital marketing, content strategy, and demand generation',
      'Strong leadership and team management skills',
    ]
  },
  {
    id: 'customer-success',
    title: 'Customer Success Manager',
    department: 'Customer Success',
    location: 'Remote',
    type: 'Full-time',
    description: 'Ensure our customers achieve their goals using our platform by providing proactive support, strategic guidance, and best practices.',
    requirements: [
      '3+ years of customer success experience in SaaS',
      'Strong communication and relationship-building skills',
      'Problem-solving mindset and ability to translate technical concepts',
      'Experience with CRM systems and customer onboarding processes',
    ]
  },
  {
    id: 'sales-representative',
    title: 'Enterprise Sales Representative',
    department: 'Sales',
    location: 'Remote',
    type: 'Full-time',
    description: 'Drive revenue growth by identifying and closing enterprise deals, showcasing the value of our AI content generation platform to large businesses.',
    requirements: [
      '5+ years of enterprise software sales experience',
      'Track record of meeting or exceeding sales quotas',
      'Experience with solution selling and complex sales cycles',
      'Strong negotiation and presentation skills',
    ]
  },
];

export default function CareersPage() {
  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="relative pb-32 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="px-4 py-24 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Join Our Team
            </h1>
            <p className="max-w-xl mx-auto mt-6 text-xl text-blue-100">
              Help us revolutionize how businesses create digital content through AI innovation.
            </p>
          </div>
        </div>
      </div>

      {/* Content sections */}
      <div className="relative">
        <div className="px-4 mx-auto -mt-32 max-w-7xl sm:px-6 lg:px-8">
          {/* About working here section */}
          <div className="overflow-hidden bg-white rounded-lg shadow-lg">
            <div className="px-4 py-12 sm:px-6 lg:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-12">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">
                    Working at Our Company
                  </h2>
                  <p className="mt-4 text-lg text-gray-600">
                    We're on a mission to democratize professional content creation through AI technology. Our platform empowers businesses of all sizes to create stunning marketing assets without specialized design skills or large creative teams.
                  </p>
                  <p className="mt-4 text-lg text-gray-600">
                    As a fast-growing startup, we offer the opportunity to work on cutting-edge technology that's changing how businesses approach digital marketing. Join us to solve interesting challenges at the intersection of AI, design, and marketing.
                  </p>
                </div>
                <div className="relative mt-10 lg:mt-0">
                  <Image
                    className="rounded-lg object-cover"
                    src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1000"
                    alt="Our team collaborating"
                    width={600}
                    height={400}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Values */}
          <div className="mt-12">
            <h2 className="text-3xl font-bold text-center text-gray-900">
              Our Values
            </h2>
            <p className="max-w-3xl mx-auto mt-4 text-lg text-center text-gray-600">
              These core principles guide everything we do, from product development to how we work together.
            </p>
            <div className="grid grid-cols-1 gap-6 mt-12 sm:grid-cols-2 lg:grid-cols-4">
              {companyValues.map((value) => (
                <div key={value.name} className="p-6 bg-blue-50 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900">{value.name}</h3>
                  <p className="mt-2 text-gray-600">{value.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Benefits */}
          <div className="mt-20">
            <h2 className="text-3xl font-bold text-center text-gray-900">
              Benefits & Perks
            </h2>
            <p className="max-w-3xl mx-auto mt-4 text-lg text-center text-gray-600">
              We offer comprehensive benefits to support your health, wealth, and growth.
            </p>
            <div className="grid grid-cols-1 gap-6 mt-12 sm:grid-cols-2 lg:grid-cols-3">
              {benefits.map((benefit) => (
                <div key={benefit.name} className="flex">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-md">
                      <Check className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">{benefit.name}</h3>
                    <p className="mt-2 text-base text-gray-600">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Job Openings */}
          <div className="mt-20">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900">
                Open Positions
              </h2>
              <p className="max-w-3xl mx-auto mt-4 text-lg text-gray-600">
                Join our team and help shape the future of digital content creation.
              </p>
            </div>

            <div className="mt-12 space-y-4">
              {jobOpenings.map((job) => (
                <div key={job.id} className="overflow-hidden bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition">
                  <div className="px-6 py-6">
                    <div className="flex flex-col justify-between sm:flex-row sm:items-center">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                        <div className="mt-1 text-sm text-gray-500">
                          {job.department} · {job.type}
                        </div>
                      </div>
                      <div className="flex items-center mt-4 sm:mt-0">
                        <MapPin className="w-5 h-5 text-gray-400" />
                        <span className="ml-1.5 text-sm text-gray-500">{job.location}</span>
                      </div>
                    </div>
                    <p className="mt-4 text-base text-gray-600">{job.description}</p>
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-900">Requirements:</h4>
                      <ul className="mt-2 space-y-1 text-sm text-gray-600">
                        {job.requirements.map((req, index) => (
                          <li key={index} className="flex items-start">
                            <span className="flex-shrink-0 inline-block w-1.5 h-1.5 mt-1.5 mr-2 bg-blue-500 rounded-full"></span>
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="mt-6">
                      <Link
                        href={`/careers/${job.id}`}
                        className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
                      >
                        View full description <ArrowRight className="w-4 h-4 ml-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* No positions that fit? */}
          <div className="px-6 py-12 mt-20 bg-blue-50 rounded-lg">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl font-bold text-gray-900">
                Don't see a position that fits your expertise?
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                We're always interested in connecting with talented people. Send us your resume and let us know how you'd like to contribute to our mission.
              </p>
              <div className="mt-8">
                <Link
                  href="/contact?subject=Careers"
                  className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700"
                >
                  Submit your resume
                </Link>
              </div>
            </div>
          </div>
          
          {/* Testimonials */}
          <div className="py-16">
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
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=250"
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
    </div>
  );
} 