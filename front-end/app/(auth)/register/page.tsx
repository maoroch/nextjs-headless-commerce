'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/context/Authcontext';

export default function RegisterPage() {
  const router = useRouter();
  const { register, error } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const ok = await register(form.firstName, form.lastName, form.email, form.password);
    setSubmitting(false);
    if (ok) router.push('/');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row mt-20">

      {/* Left panel — decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-end p-16 pb-32"
        style={{ backgroundImage: "url('/img/catalog/OrganicNuts.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 bg-black/25" />
        <div className="relative z-10">
          <span className="inline-block px-4 py-1.5 bg-[#FFCAB3] text-gray-800 text-xs font-semibold rounded-full mb-6">
            Join the community
          </span>
          <h2 className="text-4xl xl:text-5xl font-bold text-white leading-tight mb-4">
            Start your<br />journey
          </h2>
          <p className="text-white/70 text-base max-w-xs leading-relaxed">
            Create an account to track orders, save favourites and get member-only discounts.
          </p>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center px-6 py-16 lg:py-0">
        <div className="w-full max-w-md">

          <div className="mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 leading-tight mb-3">Create account</h1>
            <p className="text-gray-500 text-sm leading-relaxed">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-black underline underline-offset-2 hover:text-gray-600 transition-colors">
                Sign in
              </Link>
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 px-4 py-3 bg-[#FFCAB3]/40 rounded-2xl text-sm text-red-700 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Name row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold tracking-widest text-gray-400 uppercase">First name</label>
                <input type="text" required value={form.firstName}
                  onChange={e => setForm(prev => ({ ...prev, firstName: e.target.value }))}
                  placeholder="Alex"
                  className="w-full px-5 py-3.5 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-black transition-colors placeholder:text-gray-300" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold tracking-widest text-gray-400 uppercase">Last name</label>
                <input type="text" required value={form.lastName}
                  onChange={e => setForm(prev => ({ ...prev, lastName: e.target.value }))}
                  placeholder="Smith"
                  className="w-full px-5 py-3.5 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-black transition-colors placeholder:text-gray-300" />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold tracking-widest text-gray-400 uppercase">Email</label>
              <input type="email" required value={form.email}
                onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
                placeholder="hello@example.com"
                className="w-full px-5 py-3.5 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-black transition-colors placeholder:text-gray-300" />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold tracking-widest text-gray-400 uppercase">Password</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} required value={form.password}
                  onChange={e => setForm(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="Min. 8 characters"
                  className="w-full px-5 py-3.5 border border-gray-200 rounded-2xl text-sm focus:outline-none focus:border-black transition-colors placeholder:text-gray-300 pr-12" />
                <button type="button" onClick={() => setShowPassword(p => !p)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {/* Password strength */}
              {form.password.length > 0 && (
                <div className="flex gap-1.5 mt-1">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                      form.password.length >= i * 3
                        ? i <= 1 ? 'bg-[#FFCAB3]' : i <= 2 ? 'bg-yellow-300' : i <= 3 ? 'bg-[#B3E5C9]' : 'bg-green-400'
                        : 'bg-gray-100'
                    }`} />
                  ))}
                </div>
              )}
            </div>

            {/* Terms */}
            <label className="flex items-start gap-3 cursor-pointer group">
              <input type="checkbox" required className="mt-0.5 w-4 h-4 rounded border-gray-300 accent-black flex-shrink-0" />
              <span className="text-xs text-gray-500 leading-relaxed">
                I agree to the{' '}
                <Link href="/terms" className="text-black font-semibold underline underline-offset-2 hover:text-gray-600">Terms of Service</Link>
                {' '}and{' '}
                <Link href="/privacy" className="text-black font-semibold underline underline-offset-2 hover:text-gray-600">Privacy Policy</Link>
              </span>
            </label>

            {/* Submit */}
            <button type="submit" disabled={submitting}
              className="group w-full border border-black rounded-full flex items-center justify-between pl-6 pr-2 py-2 mt-2 transition-all duration-300 ease-out hover:bg-black hover:text-white active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed">
              <span className="text-sm font-bold tracking-wide">{submitting ? 'Creating account…' : 'Create Account'}</span>
              <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center group-hover:bg-white transition-all duration-300 flex-shrink-0">
                <ArrowRight size={18} className="text-white group-hover:text-black transition-colors duration-300" />
              </div>
            </button>
          </form>



        </div>
      </div>
    </div>
  );
}