'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send, Check } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 mt-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Page Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#B3E5C9]/20 text-[#2E7D32] text-xs font-bold mb-4 tracking-wider uppercase">
            Get In Touch
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Contact Us
          </h1>
          <p className="text-slate-500 max-w-2xl mx-auto text-base sm:text-lg">
            We are always here to connect with you. Whether you have feedback, questions about our products, or special requests, please drop us a line.
          </p>
        </div>

        {/* Content Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
          {/* Info Details */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            <div className="bg-white border border-slate-100 p-8 rounded-3xl shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#B3E5C9]/20 text-[#2E7D32] flex items-center justify-center flex-shrink-0">
                <Mail size={18} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">General Inquiries</h4>
                <p className="text-slate-500 text-xs sm:text-sm mt-1">hello@coomendem.com</p>
              </div>
            </div>

            <div className="bg-white border border-slate-100 p-8 rounded-3xl shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#B3E5C9]/20 text-[#2E7D32] flex items-center justify-center flex-shrink-0">
                <Phone size={18} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Phone Support</h4>
                <p className="text-slate-500 text-xs sm:text-sm mt-1">+1 (800) 555-0155</p>
              </div>
            </div>

            <div className="bg-white border border-slate-100 p-8 rounded-3xl shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#B3E5C9]/20 text-[#2E7D32] flex items-center justify-center flex-shrink-0">
                <MapPin size={18} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Headquarters</h4>
                <p className="text-slate-500 text-xs sm:text-sm mt-1">128 Greenhouse Rd, Green Valley, CA 90210</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 bg-white border border-slate-100 p-8 sm:p-12 rounded-3xl shadow-sm">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-6">Drop us a line</h2>
            {submitted ? (
              <div className="bg-[#B3E5C9]/20 border border-[#B3E5C9]/35 rounded-2xl p-8 text-center">
                <div className="w-12 h-12 rounded-full bg-[#2E7D32] text-white flex items-center justify-center mx-auto mb-4">
                  <Check size={24} strokeWidth={2.5} />
                </div>
                <h3 className="font-bold text-slate-900 text-lg mb-2">Message Sent!</h3>
                <p className="text-slate-500 text-sm">We appreciate you reaching out. Our team will get back to you shortly.</p>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#2E7D32]"
                  />
                  <input
                    type="email"
                    placeholder="Email Address"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#2E7D32]"
                  />
                </div>
                <textarea
                  placeholder="Tell us what you need..."
                  required
                  rows={5}
                  value={formData.message}
                  onChange={e => setFormData({ ...formData, message: e.target.value })}
                  className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#2E7D32] resize-none"
                />
                <button
                  type="submit"
                  className="group w-full py-4 bg-black text-white text-sm font-bold rounded-xl hover:bg-slate-900 active:scale-[0.98] transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Send size={15} />
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
