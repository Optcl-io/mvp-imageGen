import Image from 'next/image';
import Link from 'next/link';
import { 
  ArrowRight, 
  BrainCircuit, 
  LayoutGrid, 
  Sparkles,
  Zap
} from 'lucide-react';

export default function FeaturesPage() {
  const primaryFeatures = [
    {
      name: "AI-Powered Content Generation",
      description: "Transform product images into stunning visual content optimized for any platform with our advanced AI technology.",
      icon: <BrainCircuit className="w-8 h-8 text-blue-600" />,
    },
    {
      name: "Multi-Platform Support",
      description: "Generate content optimized for digital signage, social media, and other marketing channels with a single click.",
      icon: <LayoutGrid className="w-8 h-8 text-blue-600" />,
    },
    {
      name: "Intelligent Customization",
      description: "Smart templates that adapt to your brand guidelines and product characteristics automatically.",
      icon: <Sparkles className="w-8 h-8 text-blue-600" />,
    },
    {
      name: "Lightning-Fast Results",
      description: "Get professional-quality content in seconds, not hours or days, dramatically accelerating your marketing workflow.",
      icon: <Zap className="w-8 h-8 text-blue-600" />,
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="px-6 py-24 mx-auto max-w-7xl sm:py-32 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Powerful Features for Content Creators
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Our AI-powered platform provides all the tools you need to transform product images into 
            stunning visual content optimized for any marketing channel.
          </p>
        </div>
      </div>

      {/* Primary features section */}
      <div className="py-24 bg-gray-50 sm:py-32">
        <div className="px-6 mx-auto max-w-7xl lg:px-8">
          <div className="max-w-2xl mx-auto lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-blue-600">Accelerate Your Workflow</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything You Need for Digital Content
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Our comprehensive feature set helps marketing teams create, manage, and distribute
              professional-quality content across all channels.
            </p>
          </div>
          <div className="max-w-2xl mx-auto mt-16 sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-2 xl:grid-cols-4">
              {primaryFeatures.map((feature, i) => (
                <div key={i} className="flex flex-col">
                  <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-50">
                      {feature.icon}
                    </div>
                    {feature.name}
                  </dt>
                  <dd className="flex flex-col flex-auto mt-4 text-base leading-7 text-gray-600">
                    <p className="flex-auto">{feature.description}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Showcase section */}
      <div className="py-24 overflow-hidden sm:py-32">
        <div className="px-6 mx-auto max-w-7xl lg:px-8">
          <div className="grid max-w-2xl grid-cols-1 mx-auto gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
            <div className="lg:pr-8 lg:pt-4">
              <div className="lg:max-w-lg">
                <h2 className="text-base font-semibold leading-7 text-blue-600">Transform Your Marketing</h2>
                <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                  AI-Generated Content That Converts
                </p>
                <p className="mt-6 text-lg leading-8 text-gray-600">
                  Our platform gives you the power to create stunning visuals that drive engagement and boost conversion rates.
                </p>
                <dl className="max-w-xl mt-10 space-y-8 text-base leading-7 text-gray-600 lg:max-w-none">
                  <div className="relative pl-9">
                    <dt className="inline font-semibold text-gray-900">
                      <Sparkles className="absolute w-5 h-5 text-blue-600 left-1 top-1" />
                      Brand Consistency.
                    </dt>
                    <dd className="inline"> Maintain perfect brand consistency across all marketing channels.</dd>
                  </div>
                  <div className="relative pl-9">
                    <dt className="inline font-semibold text-gray-900">
                      <Zap className="absolute w-5 h-5 text-blue-600 left-1 top-1" />
                      10x Faster Workflows.
                    </dt>
                    <dd className="inline"> Generate in seconds what would take hours or days with traditional methods.</dd>
                  </div>
                  <div className="relative pl-9">
                    <dt className="inline font-semibold text-gray-900">
                      <LayoutGrid className="absolute w-5 h-5 text-blue-600 left-1 top-1" />
                      Multi-Platform Optimization.
                    </dt>
                    <dd className="inline"> Automatically adapt content for digital signage, social media, and more.</dd>
                  </div>
                </dl>
                <div className="mt-10">
                  <Link 
                    href="/auth/register" 
                    className="inline-flex items-center gap-x-2 text-sm font-semibold leading-6 text-blue-600"
                  >
                    Try it for free
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
            <Image
              src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop"
              alt="App screenshot"
              className="object-cover w-full max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10 sm:w-[57rem] md:-ml-4 lg:-ml-0"
              width={2432}
              height={1442}
            />
          </div>
        </div>
      </div>

      {/* CTA section */}
      <div className="px-6 py-24 bg-blue-600 sm:py-32 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to transform your content creation?
          </h2>
          <p className="mx-auto mt-6 text-lg leading-8 text-blue-100 max-w-xl">
            Start creating professional-quality content for any platform in seconds with our AI-powered tools.
          </p>
          <div className="flex items-center justify-center mt-10 gap-x-6">
            <Link
              href="/auth/register"
              className="px-4 py-2.5 text-sm font-semibold text-blue-600 bg-white rounded-md shadow-sm hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Get started for free
            </Link>
            <Link href="/contact" className="text-sm font-semibold leading-6 text-white">
              Contact sales <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 