'use client'

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import Achivements from '@/components/Achivements';
import Benifits from '@/components/Benifits';
import Deployment from '@/components/Deployment';
import ContactPage from '@/components/ContactPage';
import WorkwithUS from '@/components/WorkwithUS';
import TeamPage from '@/components/TeamPage';
import Pricing from '@/components/Pricing';
import ProjectAchievementsPage from '@/components/ProjectAchievementsPage';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function Home() {
  const { data: session } = useSession();
  const isLoggedIn = !!session;
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // Check if user has visited before
    const hasVisited = localStorage.getItem('hasVisitedBefore');
    if (hasVisited) {
      setIsFirstVisit(false);
    } else {
      localStorage.setItem('hasVisitedBefore', 'true');
    }

    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, isFirstVisit ? 2000 : 500);

    // Mouse move handler for gradient effect
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isFirstVisit]);

  // Loading screen
  if (isLoading) {
    return (
      <div className="flex items-center justify-center w-screen h-screen bg-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 mx-auto mb-6 border-4 rounded-full border-t-blue-600 border-r-blue-600 border-b-transparent border-l-transparent"
          />
          <h2 className="text-2xl font-bold text-gray-900">Loading amazing content...</h2>
        </motion.div>
      </div>
    );
  }

  return (
    <main
      ref={mainRef}
      className="relative min-h-screen overflow-hidden bg-white"
    >
      {/* Background gradient animation */}
      <div 
        className="absolute inset-0 bg-[radial-gradient(circle,rgba(59,130,246,0.15)_10%,rgba(255,255,255,0)_70%)] opacity-90 pointer-events-none"
        style={{
          left: mousePosition.x - 1000,
          top: mousePosition.y - 1000,
          width: 2000,
          height: 2000,
          transition: 'left 1s ease-out, top 1s ease-out'
        }}
      />

      {/* Hero section */}
      <section className="relative flex flex-col items-center justify-center min-h-screen px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="z-10 max-w-4xl mx-auto"
        >
          <h1 className="mb-6 text-5xl font-bold text-gray-900 md:text-6xl lg:text-7xl">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">AI-Powered</span> Ad Creation for the Modern Marketer
          </h1>
          
          <div className="h-16 mb-8">
            <TypeAnimation
              sequence={[
                'Generate stunning ad creatives instantly.',
                2000,
                'Transform your ideas into engaging visuals.',
                2000,
                'Create ads that convert better.',
                2000,
              ]}
              wrapper="p"
              speed={50}
              repeat={Infinity}
              className="text-xl text-gray-600 md:text-2xl"
            />
          </div>

          <div className="flex flex-col items-center space-y-4 md:flex-row md:space-y-0 md:space-x-6 md:justify-center">
            {isLoggedIn ? (
              <Link 
                href="/dashboard" 
                className="px-8 py-3 text-lg font-medium text-white transition-all bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 hover:shadow-blue-500/30"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link 
                  href="/sign-up" 
                  className="px-8 py-3 text-lg font-medium text-white transition-all bg-blue-600 rounded-lg shadow-lg hover:bg-blue-700 hover:shadow-blue-500/30"
                >
                  Get Started — Free
                </Link>
                <Link 
                  href="/sign-in" 
                  className="px-8 py-3 text-lg font-medium text-gray-700 transition-all border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="absolute bottom-10"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="text-gray-400"
            >
              <path d="M7 13l5 5 5-5M7 6l5 5 5-5"/>
            </svg>
          </motion.div>
        </motion.div>
      </section>

      {/* Main content sections */}
      <Benifits />
      <ProjectAchievementsPage />
      <Deployment />
      <Achivements />
      <Pricing />
      <TeamPage />
      <WorkwithUS />
      <ContactPage />
    </main>
  );
}