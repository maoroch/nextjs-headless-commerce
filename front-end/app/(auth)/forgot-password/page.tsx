'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
      } else {
        setError(data.error || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please try again later.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row mt-20">

      {/* Left panel — decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-end p-16 pb-32"
        style={{ backgroundImage: "url('/img/auth/2.jpg')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10">
          <span className="inline-block px-4 py-1.5 bg-[#B3E5C9] text-gray-800 text-xs font-semibold rounded-full mb-6">
            Need help?
          </span>
          <h2 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-4">
            Reset your<br />password
          </h2>
          <p className="text-white/70 text-base max-w-xs leading-relaxed">
            We'll send a reset link to your email address.
          </p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-16 lg:py-0">
        <div className="w-full max-w-md">

          {!success ? (
            <>
              <div className="mb-10">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-3">Forgot password?</h1>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Enter your email address and we'll send you a link to reset your password.
                </p>
              </div>

              {/* Error message */}
              {error && (
                <div className="mb-5 px-4 py-3 bg-[#FFCAB3]/40 rounded-2xl text-sm text-red-700 font-medium">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold tracking-widest text-gray-400 uppercase">Email address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="hello@example.com"
                    className="w-full px-5 py-3.5 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-black transition-colors placeholder:text-gray-300"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="group w-full border border-black rounded-full flex items-center justify-between pl-6 pr-2 py-2 mt-2 transition-all duration-300 ease-out hover:bg-black hover:text-white active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <span className="text-sm font-bold tracking-wide">
                    {submitting ? 'Sending…' : 'Send reset link'}
                  </span>
                  <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center group-hover:bg-white transition-all duration-300 flex-shrink-0">
                    <ArrowRight size={18} className="text-white group-hover:text-black transition-colors duration-300" />
                  </div>
                </button>
              </form>

              {/* Back to login */}
              <div className="mt-8 text-center">
                <Link href="/login" className="text-sm text-gray-500 hover:text-black transition-colors">
                  ← Back to sign in
                </Link>
              </div>
            </>
          ) : (
            // Success state
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-[#B3E5C9] flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={32} className="text-gray-800" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Check your email</h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-8">
                We've sent a password reset link to <strong className="text-gray-800">{email}</strong>.<br />
                Follow the instructions in the email to create a new password.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white text-sm font-bold rounded-full hover:bg-gray-900 transition-all duration-300"
              >
                Return to sign in
                <ArrowRight size={16} />
              </Link>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}