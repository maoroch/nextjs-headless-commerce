'use client';

import Link from 'next/link';
import { ArrowRight, ShieldCheck, Scale, FileText, CheckCircle2 } from 'lucide-react';

export default function TermsPage() {
  const sections = [
    {
      id: 'agreement',
      title: '1. Agreement to Terms',
      icon: Scale,
      content: 'By accessing or using Coom Endem (the "Website"), you agree to be bound by these Terms of Service. If you do not agree to all of these terms, do not use our services. We reserve the right to modify these terms at any time, and your continued use of the website constitutes acceptance of those changes.',
    },
    {
      id: 'accounts',
      title: '2. User Accounts & Security',
      icon: ShieldCheck,
      content: 'When you create an account with us, you must provide accurate, complete, and current information. You are solely responsible for maintaining the confidentiality of your account password and for all activities that occur under your account. Notify us immediately of any unauthorized account use.',
    },
    {
      id: 'purchases',
      title: '3. Orders, Pricing & Payments',
      icon: CheckCircle2,
      content: 'All orders placed through the website are subject to acceptance and availability. We reserve the right to refuse or cancel any order for reasons including product unavailability, pricing errors, or suspected fraudulent activity. Prices for our organic products are subject to change without notice.',
    },
    {
      id: 'intellectual',
      title: '4. Intellectual Property',
      icon: FileText,
      content: 'All content on Coom Endem, including text, graphics, logos, images, code, and software, is the property of Coom Endem or its content suppliers and is protected by international copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, or create derivative works without our express written permission.',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 mt-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Page Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#B3E5C9]/20 text-[#2E7D32] text-xs font-bold mb-4 tracking-wider uppercase">
            Legal Directory
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Terms of Service
          </h1>
          <p className="text-slate-500 max-w-2xl mx-auto text-base sm:text-lg">
            Please read these terms carefully before using our platform. They outline your rights and obligations when purchasing our organic products.
          </p>
          <p className="text-xs text-slate-400 mt-2">Last Updated: May 28, 2026</p>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-start">
          {/* Sticky Sidebar Navigation */}
          <div className="lg:col-span-1 sticky top-48 bg-white/80 backdrop-blur-md border border-slate-100 rounded-3xl p-6 shadow-sm hidden lg:block">
            <h3 className="font-bold text-slate-900 mb-4 text-sm tracking-wide uppercase">On This Page</h3>
            <nav className="flex flex-col gap-3">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="text-sm font-semibold text-slate-500 hover:text-[#2E7D32] transition-colors flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-300 hover:bg-[#2E7D32] transition-colors flex-shrink-0" />
                  {section.title.split('. ')[1]}
                </a>
              ))}
            </nav>
          </div>

          {/* Main Legal Content */}
          <div className="lg:col-span-3 flex flex-col gap-8">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <section
                  id={section.id}
                  key={section.id}
                  className="bg-white border border-slate-100 rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300 scroll-mt-48"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-[#B3E5C9]/20 flex items-center justify-center text-[#2E7D32]">
                      <Icon size={22} strokeWidth={2} />
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{section.title}</h2>
                  </div>
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal">
                    {section.content}
                  </p>
                </section>
              );
            })}

            {/* Bottom Contact Callout */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-8 sm:p-12 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mt-6">
              <div>
                <h3 className="text-xl font-bold mb-2">Have questions about our Terms?</h3>
                <p className="text-slate-300 text-sm max-w-md">
                  Our customer support team is always available to help clarify our policy details.
                </p>
              </div>
              <Link
                href="/contact"
                className="group inline-flex items-center gap-3 px-6 py-3 bg-[#B3E5C9] text-slate-900 text-sm font-bold rounded-full hover:bg-white active:scale-95 transition-all duration-300 flex-shrink-0"
              >
                Contact Support
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
