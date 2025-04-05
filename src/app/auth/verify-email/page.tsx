'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function VerifyEmailPage2() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const inputRefs = Array(6).fill(0).map(() => useState<HTMLInputElement | null>(null));

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    // Get email from URL parameters
    const emailParam = searchParams.get('email');
    if (emailParam) {
      setEmail(emailParam);
    }
    
    // Focus on first input on load
    if (inputRefs[0]?.current) {
      inputRefs[0].current.focus();
    }
  }, [searchParams, inputRefs]);

  const handleInputChange = (index: number, value: string) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    // Update OTP digits
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = inputRefs[index + 1][0];
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Move to previous input on backspace if current is empty
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = inputRefs[index - 1][0];
      if (prevInput) {
        prevInput.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    
    // Check if pasted data is 6 digits
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split('');
      setOtp(digits);
      
      // Focus the last input
      const lastInput = inputRefs[5][0];
      if (lastInput) lastInput.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setError('Email is required');
      return;
    }
    
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          otp: otpCode,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to verify email');
      }
      
      setSuccess(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/auth/login');
      }, 3000);
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to verify email');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      setError('Email is required');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to resend OTP');
      }
      
      setError('');
      setSuccess(false); // Reset success state
      
      // Show message
      alert('OTP has been resent to your email');
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to resend OTP');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white shadow-md rounded-xl">
        <div className="mb-8 text-center">
          <h1 className="mb-3 text-2xl font-bold text-gray-900">Email Verification</h1>
          {!success ? (
            <p className="text-gray-600">
              We&apos;ve sent a verification code to your email.
              {email && <span className="block mt-1 font-medium text-gray-800">{email}</span>}
            </p>
          ) : (
            <div className="font-medium text-green-600">
              <p>Email verified successfully!</p>
              <p className="mt-2 text-sm">Redirecting to login...</p>
            </div>
          )}
        </div>

        {!success && (
          <form onSubmit={handleVerify} className="space-y-6">
            <div>
              <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 text-black border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block mb-3 text-sm font-medium text-gray-700">
                Verification Code
              </label>
              <div className="flex justify-between gap-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    ref={(el) => inputRefs[index][1](el)}
                    className="w-12 h-12 text-xl font-bold text-center text-black border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required
                  />
                ))}
              </div>
            </div>

            {error && (
              <div className="p-3 border border-red-200 rounded-md bg-red-50">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-3 font-medium text-white bg-indigo-600 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
            >
              {isLoading ? 'Verifying...' : 'Verify Email'}
            </button>

            <div className="flex justify-between text-sm">
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={isLoading}
                className="font-medium text-indigo-600 hover:text-indigo-800"
              >
                Resend Code
              </button>
              <Link href="/auth/login" className="text-gray-600 hover:text-gray-800">
                Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
} 


const VerifyEmailPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailPage2 />
    </Suspense>
  );
};

export default VerifyEmailPage;