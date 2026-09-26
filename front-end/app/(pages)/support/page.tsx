'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Mail, MessageSquare, Phone, BookOpen, Send, Check } from 'lucide-react';

export default function SupportPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setSubmitted(true);
    }
  };

  const supportMethods = [
    {
      title: 'Email Support',
      desc: 'Send a request and get a response within 4 hours.',
      value: 'support@coomendem.com',
      actionLabel: 'Send email',
      href: 'mailto:support@coomendem.com',
      icon: Mail,
    },
    {
      title: 'Live Chat',
      desc: 'Chat with our organic product specialists instantly.',
      value: 'Online 24/7',
      actionLabel: 'Open chat',
      href: '#chat',
      icon: MessageSquare,
    },
    {
      title: 'Hotline',
      desc: 'Call our client service team directly for urgent issues.',
      value: '+1 (800) 555-0199',
      actionLabel: 'Call us',
      href: 'tel:+18005550199',
      icon: Phone,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 mt-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Page Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#B3E5C9]/20 text-[#2E7D32] text-xs font-bold mb-4 tracking-wider uppercase">
            Support Center
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight mb-4">
            How can we help you?
          </h1>
          <p className="text-slate-500 max-w-2xl mx-auto text-base sm:text-lg">
            We are dedicated to bringing nature closer to you. Find quick resources, connect with our support agents, or submit a support ticket below.
          </p>
        </div>

        {/* Support Grid Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {supportMethods.map((method, i) => {
            const Icon = method.icon;
            return (
              <div
                key={i}
                className="bg-white border border-slate-100 p-8 rounded-3xl shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#B3E5C9]/20 text-[#2E7D32] flex items-center justify-center mb-6">
                    <Icon size={22} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{method.title}</h3>
                  <p className="text-slate-400 text-xs sm:text-sm mb-4">{method.desc}</p>
                  <p className="text-slate-800 font-bold text-sm sm:text-base mb-6">{method.value}</p>
                </div>
                <a
                  href={method.href}
                  className="inline-flex items-center gap-2 font-bold text-sm text-[#2E7D32] hover:text-[#1b5e20] transition-colors"
                >
                  {method.actionLabel}
                  <ArrowRight size={14} />
                </a>
              </div>
            );
          })}
        </div>

        {/* Ticket Form Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start bg-white border border-slate-100 rounded-3xl p-8 sm:p-12 shadow-sm">
          {/* Quick FAQ / Info sidebar */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-6">Quick Resources</h2>
            <div className="flex flex-col gap-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 flex-shrink-0">
                  <BookOpen size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Read our Product Guide</h4>
                  <p className="text-slate-400 text-xs mt-1">Learn how we source, grow, and inspect all of our certified organic items.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-500 flex-shrink-0">
                  <BookOpen size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Check our FAQ Directory</h4>
                  <p className="text-slate-400 text-xs mt-1">Get instant resolutions to shipping speeds, discount structures, and returns.</p>
                  <Link href="/faq" className="text-xs font-bold text-[#2E7D32] hover:underline mt-2 inline-block">Go to FAQ</Link>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-6">Submit a Ticket</h2>
            {submitted ? (
              <div className="bg-[#B3E5C9]/20 border border-[#B3E5C9]/35 rounded-2xl p-8 text-center">
                <div className="w-12 h-12 rounded-full bg-[#2E7D32] text-white flex items-center justify-center mx-auto mb-4">
                  <Check size={24} strokeWidth={2.5} />
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-2">Ticket Submitted!</h3>
                <p className="text-slate-500 text-sm">Thank you for reaching out. A specialist will update you shortly at your registered email.</p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Name"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#2E7D32]"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#2E7D32]"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Subject"
                  required
                  value={formData.subject}
                  onChange={e => setFormData({ ...formData, subject: e.target.value })}
                  className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#2E7D32]"
                />
                <textarea
                  placeholder="How can we help you?"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#2E7D32] resize-none"
                />
                <button
                  type="submit"
                  className="group w-full py-4 bg-black text-white text-sm font-bold rounded-xl hover:bg-slate-900 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Send size={15} />
                  Submit Request
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
