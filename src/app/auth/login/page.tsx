'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function LoginPage() {
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="w-full max-w-4xl rounded-2xl bg-white shadow-2xl overflow-hidden md:flex">
        {/* Illustration Side */}
        <div className="hidden md:block md:w-1/2 bg-gradient-to-br from-blue-500 to-purple-600 p-10">
          <div className="h-full flex items-center justify-center">
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
        <div className="w-full md:w-1/2 p-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Welcome back!</h2>
            <p className="mt-2 text-gray-600">
              Sign in to your AdGenius account
            </p>
          </div>

          {(error || loginError) && (
            <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-800 text-sm">
              {error === 'CredentialsSignin'
                ? 'Invalid email or password'
                : loginError || 'An error occurred. Please try again.'}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
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
                className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-3 border"
                placeholder="••••••••"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <Link href="/auth/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                  Forgot password?
                </Link>
              </div>
            </div>
            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70"
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
                <span className="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div>
                <button
                  onClick={handleGoogleSignIn}
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
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
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
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
              Don't have an account?{' '}
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