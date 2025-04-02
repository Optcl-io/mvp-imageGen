import Image from "next/image";
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth-options';

export default async function Home() {
  const session = await getServerSession(authOptions);
  
  return (
    <main className="flex flex-col items-center min-h-screen">
      {/* Hero Section */}
      <div className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-6 py-20 max-w-6xl">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                AI-Powered Content Generator for Digital Marketing
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Create stunning digital content for your business in minutes. Upload images, add details, and our AI will generate platform-optimized visuals for digital signage and social media.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {session?.user ? (
                  <Link href="/dashboard" className="bg-white text-blue-600 hover:bg-blue-50 font-semibold rounded-lg px-6 py-3 text-center transition-colors">
                    Go to Dashboard
                  </Link>
                ) : (
                  <>
                    <Link href="/auth/register" className="bg-white text-blue-600 hover:bg-blue-50 font-semibold rounded-lg px-6 py-3 text-center transition-colors">
                      Start Free Trial
                    </Link>
                    <Link href="/auth/login" className="bg-transparent border border-white text-white hover:bg-white/10 font-semibold rounded-lg px-6 py-3 text-center transition-colors">
                      Sign In
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative w-full max-w-md h-80 md:h-96">
                <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-lg shadow-xl overflow-hidden transform -rotate-6">
                  <div className="w-full h-full bg-gradient-to-br from-pink-400 to-purple-500 opacity-90"></div>
                </div>
                <div className="absolute top-10 right-0 w-64 h-64 bg-white rounded-lg shadow-xl overflow-hidden transform rotate-6">
                  <div className="w-full h-full bg-gradient-to-br from-yellow-400 to-orange-500 opacity-90"></div>
                </div>
                <div className="absolute top-20 left-10 w-64 h-64 bg-white rounded-lg shadow-xl overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-blue-400 to-teal-500 opacity-90"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="w-full py-16 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">Transform Your Marketing with AI</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-blue-100 text-blue-600 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Platform Optimized</h3>
              <p className="text-gray-600">Create content specifically tailored for digital signage, Instagram, and TikTok with the perfect dimensions and style.</p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-purple-100 text-purple-600 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Brand Consistent</h3>
              <p className="text-gray-600">Maintain your brand identity with customized colors, logos, and messaging across all generated content.</p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-green-100 text-green-600 p-3 rounded-full w-14 h-14 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Time Saving</h3>
              <p className="text-gray-600">Generate professional quality marketing materials in minutes instead of hours or days, saving time and resources.</p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="w-full py-16 bg-gray-50">
        <div className="container mx-auto px-6 max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-4">How It Works</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">Our simple three-step process makes creating professional marketing content easier than ever.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center">
              <div className="bg-blue-600 text-white font-bold rounded-full w-12 h-12 flex items-center justify-center mb-4">1</div>
              <h3 className="text-xl font-semibold mb-2">Upload</h3>
              <p className="text-gray-600">Upload your product images and provide details like price, slogan, and brand colors.</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-blue-600 text-white font-bold rounded-full w-12 h-12 flex items-center justify-center mb-4">2</div>
              <h3 className="text-xl font-semibold mb-2">Generate</h3>
              <p className="text-gray-600">Our AI creates platform-specific marketing visuals optimized for your target audience.</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-blue-600 text-white font-bold rounded-full w-12 h-12 flex items-center justify-center mb-4">3</div>
              <h3 className="text-xl font-semibold mb-2">Export</h3>
              <p className="text-gray-600">Download or directly share your generated content to social media platforms.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="w-full py-16 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">Choose Your Plan</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow p-8">
              <div className="mb-4">
                <h3 className="text-2xl font-bold">Free Plan</h3>
                <p className="text-gray-600">Perfect for trying out the service</p>
              </div>
              
              <div className="mb-6">
                <p className="text-4xl font-bold">$0<span className="text-gray-500 text-lg font-normal">/month</span></p>
              </div>
              
              <ul className="mb-8 space-y-3">
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>1 generation per day</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Basic platforms support</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Standard image quality</span>
                </li>
              </ul>
              
              <Link href="/auth/register" className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-4 py-3 text-center transition-colors">
                Start Free
              </Link>
            </div>
            
            <div className="bg-blue-600 text-white rounded-xl shadow-md p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-blue-700 text-white text-xs font-bold px-3 py-1 uppercase">Popular</div>
              
              <div className="mb-4">
                <h3 className="text-2xl font-bold">Premium Plan</h3>
                <p className="text-blue-200">For businesses with regular needs</p>
              </div>
              
              <div className="mb-6">
                <p className="text-4xl font-bold">$19.99<span className="text-blue-200 text-lg font-normal">/month</span></p>
              </div>
              
              <ul className="mb-8 space-y-3">
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-blue-300 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>5 generations per day</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-blue-300 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>All platforms supported</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-blue-300 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>High quality output</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-blue-300 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Priority processing</span>
                </li>
              </ul>
              
              <Link href="/auth/register?plan=paid" className="block w-full bg-white text-blue-600 hover:bg-blue-50 font-semibold rounded-lg px-4 py-3 text-center transition-colors">
                Get Premium
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="w-full py-16 bg-gradient-to-r from-purple-600 to-indigo-700 text-white">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to transform your marketing content?</h2>
          <p className="text-xl mb-8 text-purple-100 max-w-2xl mx-auto">Join thousands of businesses that use our AI-powered platform to create stunning visuals in minutes.</p>
          
          <Link href="/auth/register" className="inline-block bg-white text-indigo-600 hover:bg-indigo-50 font-semibold rounded-lg px-8 py-4 text-lg transition-colors">
            Start Creating Now
          </Link>
        </div>
      </div>
    </main>
  );
}
