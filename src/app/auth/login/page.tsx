'use client';
import { Suspense, useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

function LoginPage2() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';
  const error = searchParams.get('error');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError('');

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setLoginError(result.error);
        return;
      }

      router.push(callbackUrl);
    } catch (error) {
      setLoginError('An unexpected error occurred. Please try again.');
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl });
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="w-full max-w-4xl overflow-hidden bg-white shadow-2xl rounded-2xl md:flex">
        {/* Illustration Side */}
        <div className="hidden p-10 md:block md:w-1/2 bg-gradient-to-br from-blue-500 to-purple-600">
          <div className="flex items-center justify-center h-full">
            <Image
              src="https://illustrations.popsy.co/amber/digital-nomad.svg"
              alt="Login Illustration"
              width={400}
              height={400}
              className="w-full h-auto"
            />
          </div>
        </div>

        {/* Form Side */}
        <div className="w-full p-10 md:w-1/2">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900">Welcome back!</h2>
            <p className="mt-2 text-gray-600">
              Sign in to your Optcl account
            </p>
          </div>

          {(error || loginError) && (
            <div className="p-4 mb-6 text-sm text-red-800 rounded-lg bg-red-50">
              {error === 'CredentialsSignin'
                ? 'Invalid email or password'
                : loginError || 'An error occurred. Please try again.'}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="-space-y-px rounded-md shadow-sm">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="relative block w-full rounded-t-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600"
                  placeholder="Email address"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="relative block w-full rounded-b-md border-0 py-1.5 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600"
                  placeholder="Password"
                />
              </div>
            </div>

            <div className="flex items-center justify-end">
              <div className="text-sm">
                <Link href="/auth/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative flex w-full justify-center rounded-md bg-blue-600 py-2 px-3 text-sm font-semibold text-white hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:bg-blue-400"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 text-gray-500 bg-white">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6">
              <div>
                <button
                  onClick={handleGoogleSignIn}
                  className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50"
                >
                  <svg
                    className="w-5 h-5"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm6.26 12.387c-.16.45-.36.867-.61 1.253-.25.387-.54.72-.87 1.007-.33.287-.7.527-1.11.72-.41.193-.85.333-1.32.42-.47.087-.96.13-1.47.13-.51 0-1-.043-1.47-.13-.47-.087-.91-.227-1.32-.42-.41-.193-.78-.433-1.11-.72-.33-.287-.62-.62-.87-1.007-.25-.386-.45-.803-.61-1.253-.16-.45-.28-.927-.36-1.427-.08-.5-.12-1.013-.12-1.54 0-.527.04-1.04.12-1.54.08-.5.2-.977.36-1.427.16-.45.36-.867.61-1.253.25-.387.54-.72.87-1.007.33-.287.7-.527 1.11-.72.41-.193.85-.333 1.32-.42.47-.087.96-.13 1.47-.13.51 0 1 .043 1.47.13.47.087.91.227 1.32.42.41.193.78.433 1.11.72.33.287.62.62.87 1.007.25.386.45.803.61 1.253.16.45.28.927.36 1.427.08.5.12 1.013.12 1.54 0 .527-.04 1.04-.12 1.54-.08.5-.2.977-.36 1.427z" />
                  </svg>
                </button>
              </div>
              <div>
                <button
                  type="button"
                  className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50"
                >
                  <svg
                    className="w-5 h-5"
                    aria-hidden="true"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm6.26 12.387c-.16.45-.36.867-.61 1.253-.25.387-.54.72-.87 1.007-.33.287-.7.527-1.11.72-.41.193-.85.333-1.32.42-.47.087-.96.13-1.47.13-.51 0-1-.043-1.47-.13-.47-.087-.91-.227-1.32-.42-.41-.193-.78-.433-1.11-.72-.33-.287-.62-.62-.87-1.007-.25-.386-.45-.803-.61-1.253-.16-.45-.28-.927-.36-1.427-.08-.5-.12-1.013-.12-1.54 0-.527.04-1.04.12-1.54.08-.5.2-.977.36-1.427.16-.45.36-.867.61-1.253.25-.387.54-.72.87-1.007.33-.287.7-.527 1.11-.72.41-.193.85-.333 1.32-.42.47-.087.96-.13 1.47-.13.51 0 1 .043 1.47.13.47.087.91.227 1.32.42.41.193.78.433 1.11.72.33.287.62.62.87 1.007.25.386.45.803.61 1.253.16.45.28.927.36 1.427.08.5.12 1.013.12 1.54 0 .527-.04 1.04-.12 1.54-.08.5-.2.977-.36 1.427z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don&apos;t have an account?{' '}
              <Link href="/auth/register" className="font-medium text-blue-600 hover:text-blue-500">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

const LoginPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginPage2 />
    </Suspense>
  );
};

export default LoginPage;