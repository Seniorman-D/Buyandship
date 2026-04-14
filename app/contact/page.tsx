'use client';

import { useState } from 'react';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Phone, Mail, MessageCircle, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');
    setErrorMsg('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.error) {
        setErrorMsg(data.error);
        setStatus('error');
      } else {
        setStatus('success');
        setForm({ name: '', email: '', phone: '', subject: '', message: '' });
      }
    } catch {
      setErrorMsg('Could not send message. Please try WhatsApp or email directly.');
      setStatus('error');
    }
  }

  return (
    <PublicLayout>
      <div className="bg-[#0A2540] text-white py-14 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold mb-3">Contact Us</h1>
          <p className="text-slate-300">We&apos;re here to help. Reach us on WhatsApp for the fastest response.</p>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Contact Info */}
          <div>
            <h2 className="text-2xl font-bold text-[#0A2540] mb-6">Get in Touch</h2>
            <div className="space-y-5">
              <a
                href="https://wa.me/2348029155825"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 p-4 bg-green-50 border border-green-200 rounded-xl hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-green-900">WhatsApp (Fastest)</p>
                  <p className="text-green-700 text-sm">08029155825</p>
                  <p className="text-green-600 text-xs mt-0.5">Click to start chat</p>
                </div>
              </a>

              <a
                href="tel:+2348029155825"
                className="flex items-start gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 bg-[#0A2540] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-[#0A2540]">Phone</p>
                  <p className="text-slate-600 text-sm">+234 802 915 5825</p>
                </div>
              </a>

              <a
                href="mailto:admin@buyandshiptonigeria.com"
                className="flex items-start gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 bg-[#F97316] rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-[#0A2540]">Email</p>
                  <p className="text-slate-600 text-sm">admin@buyandshiptonigeria.com</p>
                </div>
              </a>

              <div className="flex items-start gap-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-blue-900">Business Hours</p>
                  <p className="text-blue-700 text-sm">Monday – Friday: 9am – 5pm WAT</p>
                  <p className="text-blue-600 text-xs mt-0.5">WhatsApp available outside hours</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold text-[#0A2540] mb-6">Send a Message</h2>

            {status === 'success' ? (
              <div className="flex items-start gap-3 p-5 bg-green-50 border border-green-200 rounded-xl">
                <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-green-800">Message sent!</p>
                  <p className="text-green-700 text-sm mt-1">We&apos;ll get back to you within 24 hours. For faster support, use WhatsApp.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={form.name}
                    onChange={handleChange}
                    className="w-full h-10 rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2540]"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    className="w-full h-10 rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2540]"
                    placeholder="you@email.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full h-10 rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2540]"
                    placeholder="08012345678"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-1">Subject *</label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    value={form.subject}
                    onChange={handleChange}
                    className="w-full h-10 rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2540]"
                  >
                    <option value="">Select a topic</option>
                    <option value="Shipping Enquiry">Shipping Enquiry</option>
                    <option value="Procurement Service">Procurement Service</option>
                    <option value="Payment Issue">Payment Issue</option>
                    <option value="Tracking Problem">Tracking Problem</option>
                    <option value="ID Verification">ID Verification</option>
                    <option value="General Question">General Question</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    value={form.message}
                    onChange={handleChange}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0A2540] resize-none"
                    placeholder="How can we help you?"
                  />
                </div>

                {status === 'error' && (
                  <p className="text-red-600 text-sm flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" /> {errorMsg}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full bg-[#0A2540] hover:bg-[#0A2540]/90 disabled:opacity-60 text-white py-3 px-6 rounded-md font-medium transition-colors"
                >
                  {status === 'loading' ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
