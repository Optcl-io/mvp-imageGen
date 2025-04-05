'use client'

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import ContactPage from '@/components/ContactPage';

export default function Home() {
  const { data: session } = useSession();
  const isLoggedIn = !!session;
  const [isLoading, setIsLoading] = useState(true);
  const mainRef = useRef<HTMLElement>(null);

  // Show loading screen only on first visit
  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisitedBefore');
    
    if (!hasVisited) {
      const timer = setTimeout(() => {
        setIsLoading(false);
        localStorage.setItem('hasVisitedBefore', 'true');
      }, 1200);
      
      return () => clearTimeout(timer);
    } else {
      setIsLoading(false);
    }
  }, []);

  // Gradient background animation
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      document.documentElement.style.setProperty('--x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--y', `${e.clientY}px`);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Loading screen component
  const LoadingScreen = () => (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-white"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ 
          type: 'spring',
          stiffness: 260,
          damping: 20
        }}
      >
        <Image
          src="/loading.gif" 
          alt="Loading..." 
          width={150} 
          height={150} 
          className="w-[150px] h-[150px]"
          priority
        />
      </motion.div>
    </motion.div>
  );

  return (
    <>
      <AnimatePresence>
        {isLoading && <LoadingScreen />}
      </AnimatePresence>

      <main
        ref={mainRef}
        className="relative z-10 min-h-screen overflow-hidden"
      >
        {/* Interactive gradient background */}
        <div className="fixed inset-0 z-0 pointer-events-none opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_var(--x,_100px)_var(--y,_100px),_#ff80b5_0%,_#9089fc_50%,_transparent_70%)]" />
        </div>

        {/* Hero section */}
        <section className="relative flex flex-col items-center justify-center px-4 py-32 text-center lg:min-h-screen lg:flex-row lg:py-0 lg:text-left">
          <div className="absolute inset-0 z-0 hidden lg:block">
            <div className="absolute inset-0 to-transparent" />
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="z-10 max-w-4xl mx-auto lg:ml-16 lg:mr-auto lg:max-w-2xl"
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="inline-block px-4 py-2 mb-6 text-sm font-medium tracking-wider text-blue-600 uppercase rounded-full bg-blue-100/80"
            >
              AI Content Generation
            </motion.span>
            
            <h1 className="text-5xl font-bold leading-tight text-gray-900 md:text-6xl lg:text-7xl">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Transform
              </span>{' '}
              Your Content Creation
            </h1>
            
            <div className="h-20">
              <TypeAnimation
                sequence={[
                  'Turn product images into stunning digital signage.',
                  2000,
                  'Create eye-catching social media content instantly.',
                  2000,
                  'Generate platform-optimized marketing assets.',
                  2000,
                  'Boost engagement with AI-enhanced visuals.',
                  2000,
                ]}
                wrapper="p"
                speed={50}
                repeat={Infinity}
                className="text-xl text-gray-600 md:text-2xl"
              />
            </div>

            <p className="max-w-2xl mx-auto mb-10 text-lg leading-relaxed text-gray-600 lg:mx-0">
              Our advanced AI transforms your product images into professional marketing assets 
              optimized for any platform — no design skills required.
            </p>

            <div className="flex flex-col items-center space-y-4 md:flex-row md:space-y-0 md:space-x-6 md:justify-center lg:justify-start">
              {isLoggedIn ? (
                <Link 
                  href="/dashboard" 
                  className="px-8 py-4 text-lg font-medium text-white transition-all duration-300 shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:from-blue-700 hover:to-purple-700 hover:shadow-xl"
                >
                  Go to Dashboard
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="inline w-5 h-5 ml-2 -mr-1" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              ) : (
                <>
                  <Link 
                    href="/auth/register" 
                    className="px-8 py-4 text-lg font-medium text-white transition-all duration-300 shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl hover:from-blue-700 hover:to-purple-700 hover:shadow-xl"
                  >
                    Start Free Trial
                  </Link>
                  <Link 
                    href="/auth/login" 
                    className="px-8 py-4 text-lg font-medium text-gray-700 transition-all duration-300 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:shadow-md"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </motion.div>

          {/* Hero image */}
          <motion.div 
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative z-10 w-full max-w-2xl mt-20 lg:mt-0 lg:absolute lg:right-0 lg:top-1/2 lg:-translate-y-1/2"
          >
            <motion.div
              animate={{ 
                y: [0, -20, 0] 
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
              className="mr-10 overflow-hidden shadow-2xl rounded-2xl"
            >
              <Image
                src="/abc.gif"
                alt="AI-generated digital content visualization"
                width={1000}
                height={1000}
                className="object-cover w-full"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </motion.div>
          </motion.div>
        </section>

        {/* Main content sections with scroll animations */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          {/* <Benifits />
          <ProjectAchievementsPage />
          <Deployment />
          <Achivements />
          <Pricing />
          <TeamPage />
          <WorkwithUS /> */}
          <ContactPage />
        </motion.div>
      </main>
    </>
  );
}