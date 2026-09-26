'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ChevronDown, HelpCircle, Package, Truck, CreditCard } from 'lucide-react';

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const categories = [
    { name: 'Shipping', icon: Truck },
    { name: 'Orders', icon: Package },
    { name: 'Payments', icon: CreditCard },
  ];

  const faqs = [
    {
      category: 'Shipping',
      question: 'How fast do you dispatch organic orders?',
      answer: 'All orders are packed fresh and dispatched within 24 hours of purchase. Delivery takes 1–3 business days depending on your location.',
    },
    {
      category: 'Shipping',
      question: 'Do you offer international shipping?',
      answer: 'Currently, we only ship locally to ensure maximum product freshness. We are actively expanding to support neighboring regions soon.',
    },
    {
      category: 'Orders',
      question: 'Can I change my order after placing it?',
      answer: 'Since we process and pack orders rapidly, updates are only possible within 30 minutes of placing the order. Reach out via support chat immediately.',
    },
    {
      category: 'Orders',
      question: 'What is your return policy?',
      answer: 'We offer a 100% satisfaction guarantee. If any organic items arrive damaged or do not meet your expectations, we offer free returns and refunds within 14 days.',
    },
    {
      category: 'Payments',
      question: 'What payment methods do you support?',
      answer: 'We support all major Credit/Debit Cards, secure Bank Transfers, and Cash on Delivery (COD) options in selected locations.',
    },
  ];

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-slate-50 mt-40">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Page Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#B3E5C9]/20 text-[#2E7D32] text-xs font-bold mb-4 tracking-wider uppercase">
            Customer Care
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-slate-500 max-w-2xl mx-auto text-base sm:text-lg">
            Got questions? We have answers. Find instant support regarding shipping, delivery, payments, and order tracking.
          </p>
        </div>

        {/* Categories Banner */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          {categories.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <div
                key={i}
                className="bg-white border border-slate-100 p-6 rounded-3xl text-center shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-2xl bg-[#B3E5C9]/20 text-[#2E7D32] flex items-center justify-center mx-auto mb-3">
                  <Icon size={18} />
                </div>
                <span className="font-bold text-slate-900 text-sm">{cat.name}</span>
              </div>
            );
          })}
        </div>

        {/* Accordion Questions */}
        <div className="flex flex-col gap-4">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm transition-all duration-300"
              >
                <button
                  onClick={() => toggle(i)}
                  className="w-full px-6 sm:px-8 py-6 text-left flex justify-between items-center gap-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <HelpCircle size={20} className="text-[#2E7D32] flex-shrink-0" />
                    <span className="font-bold text-slate-900 text-sm sm:text-base">{faq.question}</span>
                  </div>
                  <ChevronDown
                    size={18}
                    className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 sm:px-8 pb-6 text-slate-500 text-sm sm:text-base leading-relaxed border-t border-slate-50 pt-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer Contact Callout */}
        <div className="mt-16 bg-[#B3E5C9]/20 border border-[#B3E5C9]/35 rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center sm:text-left">
            <h3 className="font-bold text-slate-900 text-lg">Still need assistance?</h3>
            <p className="text-slate-500 text-sm mt-1">Our support team is 24/7 online to solve any challenges.</p>
          </div>
          <Link
            href="/support"
            className="group inline-flex items-center gap-3 px-6 py-3 bg-black text-white text-sm font-bold rounded-full hover:bg-slate-900 active:scale-95 transition-all duration-300 flex-shrink-0"
          >
            Get Help Now
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </div>
  );
}
