import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';
import Image from "next/image";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <main className="z-0 flex flex-col items-center min-h-screen overflow-hidden">
      {/* Hero Section */}
      <div className="relative z-0 w-full overflow-hidden text-white bg-gradient-to-r from-purple-900 to-blue-800">
        <div className="container relative z-10 px-6 py-24 mx-auto max-w-7xl">
          <div className="flex flex-col items-center gap-12 md:flex-row">
            <div className="md:w-1/2">
              <h1 className="mb-6 text-5xl font-bold leading-tight md:text-6xl">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-400 animate-gradient">
                  AI-Powered Ad Creation
                </span>
              </h1>
              <p className="mb-8 text-xl text-white/90">
                Generate stunning ads, social media posts, and marketing content in seconds with our cutting-edge AI platform.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                {session?.user ? (
                  <Link
                    href="/dashboard"
                    className="flex items-center justify-center gap-2 px-8 py-4 font-bold text-center text-blue-600 transition-all transform bg-white shadow-lg hover:bg-blue-50 rounded-xl hover:scale-105"
                  >
                    <span>Go to Dashboard</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/auth/register"
                      className="flex items-center justify-center gap-2 px-8 py-4 font-bold text-center text-white transition-all transform shadow-lg bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl hover:scale-105 hover:shadow-xl"
                    >
                      <span>Start Free Trial</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </Link>
                    <Link
                      href="/auth/login"
                      className="flex items-center justify-center gap-2 px-8 py-4 font-bold text-center text-white transition-all transform border-2 bg-white/10 border-white/30 rounded-xl hover:scale-105 hover:bg-white/20"
                    >
                      <span>Sign In</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                      </svg>
                    </Link>
                  </>
                )}
              </div>
              <div className="flex items-center gap-4 mt-8">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center justify-center w-10 h-10 text-xs font-bold border-2 rounded-full bg-white/20 border-white/30">
                      {i === 4 ? '5K+' : `U${i}`}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-white/80">Trusted by 5,000+ marketers worldwide</p>
              </div>
            </div>
            <div className="md:w-9/12 flex justify-center  rounded-[30px]">
              <Image
                src="https://images.unsplash.com/photo-1601315488950-3b5047998b38?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="AI Content Creation"
                width={700}
                height={600}
                className="w-full h-auto animate-float rounded-[30px] object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="w-full py-20 bg-white">
        <div className="container px-6 mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">
              Supercharge Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">Marketing</span>
            </h2>
            <p className="max-w-3xl mx-auto text-xl text-gray-600">
              Our AI platform transforms your ideas into high-performing marketing assets instantly.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            <div className="p-8 transition-all transform shadow-lg bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl hover:shadow-xl hover:-translate-y-2">
              <div className="flex items-center justify-center w-16 h-16 p-4 mb-6 text-white bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl">
                <Image
                  src="https://illustrations.popsy.co/amber/designer.svg"
                  alt="Platform Optimized"
                  width={40}
                  height={40}
                />
              </div>
              <h3 className="mb-3 text-2xl font-bold text-gray-900">Platform Optimized</h3>
              <p className="text-gray-600">
                Perfectly sized content for Instagram, TikTok, Facebook, and digital signage with automatic formatting.
              </p>
            </div>

            <div className="p-8 transition-all transform shadow-lg bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl hover:shadow-xl hover:-translate-y-2">
              <div className="flex items-center justify-center w-16 h-16 p-4 mb-6 text-white bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl">
                <Image
                  src="https://illustrations.popsy.co/amber/designer.svg"
                  alt="Brand Consistent"
                  width={40}
                  height={40}
                />
              </div>
              <h3 className="mb-3 text-2xl font-bold text-gray-900">Brand Consistent</h3>
              <p className="text-gray-600">
                Maintain your brand identity with custom colors, fonts, and logos across all generated content.
              </p>
            </div>

            <div className="p-8 transition-all transform shadow-lg bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl hover:shadow-xl hover:-translate-y-2">
              <div className="flex items-center justify-center w-16 h-16 p-4 mb-6 text-white bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl">
                <Image
                  src="https://illustrations.popsy.co/amber/designer.svg"
                  alt="Time Saving"
                  width={40}
                  height={40}
                />
              </div>
              <h3 className="mb-3 text-2xl font-bold text-gray-900">Time Saving</h3>
              <p className="text-gray-600">
                Create professional ads in minutes instead of days. Our AI handles the heavy lifting.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="w-full py-20 bg-gradient-to-r from-purple-900 to-blue-800">
        <div className="container px-6 mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-300">
              Simple, <span className="text-transparent bg-white bg-clip-text">Transparent</span> Pricing
            </h2>
            <p className="max-w-3xl mx-auto text-xl text-gray-200">
              Choose the plan that fits your business needs
            </p>
          </div>

          <div className="grid max-w-5xl grid-cols-1 gap-10 mx-auto md:grid-cols-2">
            <div className="p-10 transition-all transform bg-white border-2 border-gray-200 shadow-lg rounded-2xl hover:shadow-xl hover:-translate-y-2">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Starter</h3>
                <p className="text-gray-600">Perfect for small businesses and individuals</p>
              </div>

              <div className="mb-8">
                <p className="text-5xl font-bold text-gray-900">
                  $0<span className="text-xl font-normal text-gray-500">/month</span>
                </p>
              </div>

              <ul className="mb-10 space-y-4">
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-green-500 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">5 ad generations per week</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-green-500 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Basic social platforms</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-green-500 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Standard resolution</span>
                </li>
              </ul>

              <Link
                href="/auth/register"
                className="block w-full px-6 py-4 font-bold text-center text-white transition-all bg-gray-900 hover:bg-gray-800 rounded-xl"
              >
                Get Started Free
              </Link>
            </div>

            <div className="relative p-10 overflow-hidden text-white transform shadow-xl bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl hover:-translate-y-2">
              <div className="absolute px-4 py-1 text-sm font-bold text-purple-900 uppercase bg-yellow-400 rounded-full top-6 right-6">
                Most Popular
              </div>

              <div className="mb-6">
                <h3 className="text-2xl font-bold">Pro</h3>
                <p className="text-blue-100">For growing businesses and agencies</p>
              </div>

              <div className="mb-8">
                <p className="text-5xl font-bold">
                  $29<span className="text-xl font-normal text-blue-200">/month</span>
                </p>
              </div>

              <ul className="mb-10 space-y-4">
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-yellow-300 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Unlimited ad generations</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-yellow-300 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>All platforms + digital signage</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-yellow-300 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>High resolution + transparent PNG</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-yellow-300 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Advanced analytics</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-6 w-6 text-yellow-300 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  <span>Priority support</span>
                </li>
              </ul>

              <Link
                href="/auth/register?plan=pro"
                className="block w-full px-6 py-4 font-bold text-center text-blue-600 transition-all bg-white shadow-lg hover:bg-blue-50 rounded-xl"
              >
                Upgrade to Pro
              </Link>
            </div>
          </div>
        </div>
      </div>


      {/* How It Works Section */}
      <div className="w-full py-20 bg-gray-50">
        <div className="container px-6 mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">
              How <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">Optcl</span> Works
            </h2>
            <p className="max-w-3xl mx-auto text-xl text-gray-600">
              Three simple steps to create stunning marketing content
            </p>
          </div>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-8">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 blur-md opacity-30"></div>
                <div className="relative flex items-center justify-center w-20 h-20 text-3xl font-bold text-white rounded-full shadow-lg bg-gradient-to-r from-blue-500 to-purple-600">
                  1
                </div>
              </div>
              <h3 className="mb-3 text-2xl font-bold text-gray-900">Upload & Describe</h3>
              <p className="text-gray-600">
                Add your product images and describe your campaign goals, target audience, and brand style.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="relative mb-8">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-400 to-purple-500 blur-md opacity-30"></div>
                <div className="relative flex items-center justify-center w-20 h-20 text-3xl font-bold text-white rounded-full shadow-lg bg-gradient-to-r from-pink-500 to-purple-600">
                  2
                </div>
              </div>
              <h3 className="mb-3 text-2xl font-bold text-gray-900">AI Magic</h3>
              <p className="text-gray-600">
                Our AI generates multiple ad variations optimized for engagement and conversions.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="relative mb-8">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400 to-blue-500 blur-md opacity-30"></div>
                <div className="relative flex items-center justify-center w-20 h-20 text-3xl font-bold text-white rounded-full shadow-lg bg-gradient-to-r from-green-500 to-blue-600">
                  3
                </div>
              </div>
              <h3 className="mb-3 text-2xl font-bold text-gray-900">Publish & Track</h3>
              <p className="text-gray-600">
                Download or publish directly to social platforms and monitor performance analytics.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="w-full py-20 bg-gradient-to-r from-purple-900 to-blue-800">
        <div className="container px-6 mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-200">
              What Our <span className="text-transparent bg-white bg-clip-text">Clients</span> Say
            </h2>
            <p className="max-w-3xl mx-auto text-xl text-gray-200">
              Don&apos;t just take our word for it - hear from our satisfied customers
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                name: "Sarah Johnson",
                role: "Marketing Director, TechStart",
                quote: "Optcl has cut our content creation time by 80%. The AI suggestions are incredibly on-brand and effective.",
                avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=688&q=80",
                rating: 5
              },
              {
                name: "Michael Chen",
                role: "Founder, EcomPro",
                quote: "Our conversion rates increased by 40% after switching to Optcl. The platform pays for itself.",
                avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80",
                rating: 5
              },
              {
                name: "Emma Rodriguez",
                role: "Social Media Manager, Fashionista",
                quote: "I can now create a month's worth of content in just a few hours. The platform is a game-changer!",
                avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=761&q=80",
                rating: 4
              }
            ].map((testimonial, index) => (
              <div key={index} className="p-8 transition-shadow bg-white border border-gray-100 shadow-lg rounded-xl hover:shadow-xl">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="mb-6 italic text-gray-600">&quot;{testimonial.quote}&quot;</p>
                <div className="flex items-center">
                  <div className="relative w-12 h-12 mr-4 overflow-hidden rounded-full">
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>



      {/* CTA Section */}
      <div className="w-full py-24 text-black bg-white">
        <div className="container max-w-5xl px-6 mx-auto text-center">
          <h2 className="mb-8 text-4xl font-bold md:text-5xl">
            Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-400">transform</span> your marketing?
          </h2>
          <p className="max-w-3xl mx-auto mb-10 text-xl">
            Join thousands of businesses creating stunning ads and content with Optcl AI.
          </p>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              href="/auth/register"
              className="px-10 py-5 text-lg font-bold text-center text-white transition-all transform shadow-lg bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl hover:scale-105 hover:shadow-xl"
            >
              Start Free Trial
            </Link>
            <Link
              href="/demo"
              className="px-10 py-5 text-lg font-bold text-center transition-all transform border-2 bg-white/10 border-black/30 rounded-xl hover:scale-105 hover:bg-white/20"
            >
              See Live Demo
            </Link>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="w-full py-20 bg-gradient-to-r from-purple-900 to-blue-800">
        <div className="container max-w-5xl px-6 mx-auto">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-200">
              Frequently Asked <span className="text-transparent bg-white bg-clip-text">Questions</span>
            </h2>
            <p className="max-w-3xl mx-auto text-xl text-gray-200">
              Everything you need to know about Optcl
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                question: "How does the AI generate ads?",
                answer: "Our AI analyzes thousands of high-performing ads across industries to create optimized content tailored to your brand. It considers your inputs, target audience, and platform specifications to generate the most effective creatives."
              },
              {
                question: "Can I customize the generated ads?",
                answer: "Absolutely! All generated ads are fully editable. You can tweak text, colors, layouts, and more before downloading or publishing."
              },
              {
                question: "What image formats are supported?",
                answer: "We support JPG, PNG, and WebP formats for uploads. Downloads are available in JPG, PNG (including transparent), and MP4 for video ads."
              },
              {
                question: "Is there a limit to how many ads I can generate?",
                answer: "The free plan includes 5 generations per week. Pro and Enterprise plans offer unlimited generations."
              },
              {
                question: "How do I cancel my subscription?",
                answer: "You can cancel anytime from your account settings. There are no cancellation fees, and you'll retain access until the end of your billing period."
              }
            ].map((faq, index) => (
              <div key={index} className="p-6 transition-colors bg-gray-50 rounded-xl hover:bg-gray-100">
                <h3 className="mb-2 text-xl font-bold text-gray-900">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};