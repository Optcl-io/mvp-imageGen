import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import { CheckIcon } from '@heroicons/react/24/outline';
import SubscribeButton from '@/components/subscription/SubscribeButton';

// Define the pricing tiers
const tiers = [
  {
    name: 'Free',
    id: 'free',
    price: '$0',
    description: 'Basic features for individual creators',
    features: [
      `${process.env.FREE_TIER_DAILY_LIMIT || '1'} generation per day`,
      'Basic templates',
      'Standard quality outputs',
      'Community support',
    ],
    buttonText: 'Get Started',
    buttonHref: '/auth/register?plan=free',
    isPrimary: false,
    activeLabel: 'Your Current Plan',
  },
  {
    name: 'Premium',
    id: 'premium',
    price: '$9.99',
    period: 'monthly',
    description: 'Advanced features for serious content creators',
    features: [
      `${process.env.PAID_TIER_DAILY_LIMIT || '5'} generations per day`,
      'All templates',
      'High-quality outputs',
      'Priority support',
      'Advanced customization options',
      'Download in multiple formats',
    ],
    buttonText: 'Subscribe Now',
    buttonHref: '',
    isPrimary: true,
    activeLabel: 'Your Current Plan',
  },
];

export default async function PricingPage() {
  const session = await getServerSession(authOptions);
  const isAuthenticated = !!session?.user;
  const currentSubscription = session?.user?.subscription || 'FREE';

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Pricing Plans
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Choose the plan that works best for your content creation needs
          </p>
          <div className="mt-6 text-center text-sm text-gray-500">
            <p>Premium features are only available after successful payment processing.</p>
            <p className="mt-2">Our secure payment system ensures that premium access is only granted after payment verification through Stripe.</p>
          </div>
        </div>
        
        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-y-10 gap-x-8 lg:max-w-4xl lg:grid-cols-2 lg:gap-y-0">
          {tiers.map((tier) => {
            const isCurrentPlan = tier.id === 'premium' 
              ? currentSubscription === 'PAID' 
              : currentSubscription === 'FREE';
            
            return (
              <div 
                key={tier.id}
                className={`relative rounded-2xl border p-8 shadow-sm ${
                  tier.isPrimary ? 'border-indigo-600 ring-2 ring-indigo-600' : 'border-gray-200'
                }`}
              >
                {isCurrentPlan && (
                  <div className="absolute -top-3 right-10 inline-flex items-center rounded-md bg-green-100 px-2 py-1 text-xs font-medium text-green-700">
                    {tier.activeLabel}
                  </div>
                )}
                
                <div className="flex flex-col items-start gap-x-8">
                  <h3 
                    className={`text-lg font-semibold leading-8 ${
                      tier.isPrimary ? 'text-indigo-600' : 'text-gray-900'
                    }`}
                  >
                    {tier.name}
                  </h3>
                  <p className="mt-4 text-sm leading-6 text-gray-600">{tier.description}</p>
                  <p className="mt-6 flex items-baseline gap-x-1">
                    <span className="text-4xl font-bold tracking-tight text-gray-900">{tier.price}</span>
                    {tier.period && (
                      <span className="text-sm font-semibold leading-6 text-gray-600">/{tier.period}</span>
                    )}
                  </p>
                  
                  <ul role="list" className="mt-8 space-y-3 text-sm leading-6 text-gray-600 w-full">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex gap-x-3">
                        <CheckIcon className="h-5 w-5 flex-none text-indigo-600" aria-hidden="true" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="mt-8 w-full">
                    {tier.id === 'premium' ? (
                      isCurrentPlan ? (
                        <button
                          disabled
                          className="rounded-md w-full bg-gray-300 px-3.5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm"
                        >
                          Already subscribed
                        </button>
                      ) : (
                        <SubscribeButton 
                          priceId={process.env.STRIPE_PREMIUM_PRICE_ID || undefined}
                          className="w-full"
                        >
                          {tier.buttonText}
                        </SubscribeButton>
                      )
                    ) : (
                      isAuthenticated ? (
                        <button
                          disabled
                          className="rounded-md w-full bg-gray-100 px-3.5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm"
                        >
                          {isCurrentPlan ? 'Current Plan' : 'Downgrade'}
                        </button>
                      ) : (
                        <a
                          href={tier.buttonHref}
                          className="rounded-md w-full block text-center bg-gray-100 px-3.5 py-2.5 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-200"
                        >
                          {tier.buttonText}
                        </a>
                      )
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 