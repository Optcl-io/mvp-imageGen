import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { SparklesIcon, CheckBadgeIcon, BoltIcon, ArrowPathIcon } from '@heroicons/react/24/solid';
import SubscribeButton from '@/components/subscription/SubscribeButton';

const tiers = [
  {
    name: 'Starter',
    id: 'free',
    price: '$0',
    description: 'Perfect for trying out the platform',
    features: [
      `${process.env.FREE_TIER_DAILY_LIMIT || '3'} generations per day`,
      'Basic templates',
      'Standard resolution outputs',
      'Email support',
      'Watermarked downloads'
    ],
    buttonText: 'Get Started Free',
    buttonHref: '/auth/register?plan=free',
    isPrimary: false,
    activeLabel: 'Your Current Plan',
    icon: <ArrowPathIcon className="h-6 w-6 text-blue-500" />
  },
  {
    name: 'Pro',
    id: 'premium',
    price: '$29',
    period: 'month',
    description: 'For serious content creators & businesses',
    features: [
      `${process.env.PAID_TIER_DAILY_LIMIT || '15'} generations per day`,
      'All premium templates',
      'High-resolution downloads',
      'Priority support',
      'Brand customization',
      'Multiple formats (PNG, JPG, PDF)',
      'Commercial usage rights',
      'No watermarks'
    ],
    buttonText: 'Upgrade to Pro',
    buttonHref: '',
    isPrimary: true,
    activeLabel: 'Your Current Plan',
    icon: <SparklesIcon className="h-6 w-6 text-yellow-400" />
  },
];

export default async function PricingPage() {
  const session = await getServerSession(authOptions);
  const isAuthenticated = !!session?.user;
  const currentSubscription = session?.user?.subscription || 'FREE';

  return (
    <div className="bg-gradient-to-b from-white to-blue-50 py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Hero Section */}
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Simple, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Transparent</span> Pricing
          </h1>
          <p className="mt-6 text-xl leading-8 text-gray-600">
            Choose the perfect plan for your creative needs
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-8 lg:max-w-5xl lg:grid-cols-2">
          {tiers.map((tier) => {
            const isCurrentPlan = tier.id === 'premium' 
              ? currentSubscription === 'PAID' 
              : currentSubscription === 'FREE';
            
            return (
              <div 
                key={tier.id}
                className={`relative rounded-2xl p-8 shadow-xl ${
                  tier.isPrimary 
                    ? 'bg-gradient-to-br from-purple-600 to-blue-600 text-white border-0'
                    : 'bg-white text-gray-900 border border-gray-200'
                }`}
              >
                {isCurrentPlan && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 inline-flex items-center rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 px-4 py-1 text-sm font-bold text-white shadow-lg">
                    {tier.activeLabel}
                  </div>
                )}
                
                <div className="flex items-center mb-6">
                  <div className={`p-3 rounded-lg mr-4 ${
                    tier.isPrimary ? 'bg-white/20' : 'bg-blue-100'
                  }`}>
                    {tier.icon}
                  </div>
                  <h3 className="text-2xl font-bold">{tier.name}</h3>
                </div>
                
                <p className={`text-lg mb-6 ${
                  tier.isPrimary ? 'text-blue-100' : 'text-gray-600'
                }`}>
                  {tier.description}
                </p>
                
                <div className="mb-8">
                  <p className="text-5xl font-bold mb-2">
                    {tier.price}
                    {tier.period && (
                      <span className="text-xl font-normal">/{tier.period}</span>
                    )}
                  </p>
                  {tier.id === 'premium' && (
                    <p className="text-sm">Billed monthly. Cancel anytime.</p>
                  )}
                </div>
                
                <ul role="list" className="space-y-4 mb-10">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <div className={`flex-shrink-0 p-1 rounded-full mr-3 ${
                        tier.isPrimary ? 'bg-white/20' : 'bg-blue-100'
                      }`}>
                        <CheckBadgeIcon className={`h-5 w-5 ${
                          tier.isPrimary ? 'text-white' : 'text-blue-600'
                        }`} />
                      </div>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-auto">
                  {tier.id === 'premium' ? (
                    isCurrentPlan ? (
                      <button
                        disabled
                        className={`w-full py-3 px-4 rounded-xl font-bold ${
                          tier.isPrimary 
                            ? 'bg-white/20 text-white' 
                            : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        ✓ Current Plan
                      </button>
                    ) : (
                      <SubscribeButton 
                        priceId={process.env.STRIPE_PREMIUM_PRICE_ID || undefined}
                        className={`w-full py-3 px-4 rounded-xl font-bold shadow-lg ${
                          tier.isPrimary
                            ? 'bg-red-400 text-black hover:bg-blue-50'
                            : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700'
                        }`}
                      >
                        {tier.buttonText}
                      </SubscribeButton>
                    )
                  ) : (
                    isAuthenticated ? (
                      <button
                        disabled
                        className={`w-full py-3 px-4 rounded-xl font-bold ${
                          isCurrentPlan 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-gray-200 text-gray-700'
                        }`}
                      >
                        {isCurrentPlan ? '✓ Current Plan' : 'Downgrade'}
                      </button>
                    ) : (
                      <a
                        href={tier.buttonHref}
                        className="block w-full py-3 px-4 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-bold text-center shadow-lg transition-colors"
                      >
                        {tier.buttonText}
                      </a>
                    )
                  )}
                </div>
              </div>
            );
          })}
        </div>

                {/* Features Grid */}
                <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              name: 'Unlimited Creativity',
              icon: <BoltIcon className="h-8 w-8 text-purple-600" />,
              description: 'Generate as many variations as you need'
            },
            {
              name: 'Premium Quality',
              icon: <CheckBadgeIcon className="h-8 w-8 text-blue-600" />,
              description: 'High-resolution, professional-grade outputs'
            },
            {
              name: 'Instant Access',
              icon: <SparklesIcon className="h-8 w-8 text-yellow-500" />,
              description: 'Start creating immediately after signup'
            },
            {
              name: 'Secure Payments',
              icon: <SparklesIcon className="h-8 w-8 text-yellow-500" />,
              description: 'Powered by Stripe for secure transactions'
            }
          ].map((feature) => (
            <div key={feature.name} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="bg-blue-50 p-2 rounded-lg mr-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900">{feature.name}</h3>
              </div>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}