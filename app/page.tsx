import type { Metadata } from 'next';
import Link from 'next/link';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Button } from '@/components/ui/button';
import {
  Package, CheckCircle, Star, Shield, Clock, MessageCircle, ArrowRight, Globe,
  TrendingDown, Users,
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'BuyandShip Nigeria – Ship from USA, UK & China to Nigeria',
  description:
    'Shop from the USA, UK, and China and ship to Nigeria at the cheapest rates. BuyandShip Nigeria – fast, reliable, trusted.',
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'BuyandShip Nigeria',
  description: 'International shipping and procurement service – USA, UK, China to Nigeria',
  url: 'https://buyandshiptonigeria.com',
  telephone: '+2348029155825',
  email: 'admin@buyandshiptonigeria.com',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'NG',
  },
  openingHours: 'Mo-Fr 09:00-17:00',
  priceRange: '$$',
};

const steps = [
  { step: '01', title: 'Create Account', desc: 'Sign up and verify your identity with NIN or ID document.' },
  { step: '02', title: 'Get Warehouse Address', desc: 'Receive your personal USA, UK, or China warehouse address.' },
  { step: '03', title: 'Shop Online', desc: 'Shop at any US, UK, or China store and ship to your warehouse address.' },
  { step: '04', title: 'We Ship to Nigeria', desc: 'We receive, consolidate, and ship your items to your door in Nigeria.' },
];

const rates = [
  {
    flag: '🇺🇸', origin: 'USA', rate: '$9/lb', min: '$35 minimum (up to 4 lbs)',
    color: 'border-blue-500', badge: 'Most Popular',
  },
  {
    flag: '🇬🇧', origin: 'UK', rate: '£9/kg', min: '5kg minimum (£45)',
    color: 'border-red-500', badge: 'No Gadgets',
  },
  {
    flag: '🇨🇳', origin: 'China', rate: '$10/kg', min: '3kg minimum ($30)',
    color: 'border-yellow-500', badge: 'Bulk Savings',
  },
];

const whyUs = [
  { icon: <TrendingDown className="h-6 w-6" />, title: 'Lowest Rates', desc: 'Competitive per-kg/lb rates — no hidden fees, no surprises.' },
  { icon: <Shield className="h-6 w-6" />, title: 'Fully Verified', desc: 'NIN-verified accounts ensure your shipments are secure and traceable.' },
  { icon: <Clock className="h-6 w-6" />, title: 'Fast Delivery', desc: '7–14 business days from warehouse to your door in Nigeria.' },
  { icon: <Users className="h-6 w-6" />, title: 'Procurement Service', desc: "Can't ship yourself? We buy it for you for just 5% fee." },
  { icon: <Globe className="h-6 w-6" />, title: '3 Countries', desc: 'USA, UK, and China covered. Shop from thousands of global retailers.' },
  { icon: <MessageCircle className="h-6 w-6" />, title: '24/7 WhatsApp', desc: 'Real human support on WhatsApp — always here when you need us.' },
];

export default function HomePage() {
  return (
    <PublicLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0A2540] to-[#1a3f6f] text-white py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-[#F97316]/20 text-[#F97316] px-4 py-1.5 rounded-full text-sm font-medium mb-6">
            <Star className="h-4 w-4 fill-current" />
            Nigeria&apos;s Trusted Shipping Partner
          </div>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            Shop Anywhere.{' '}
            <span className="text-[#F97316]">Ship to Nigeria.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            Shop from the USA, UK, and China and ship directly to Nigeria at the cheapest rates.
            Fast, reliable, and 100% trusted.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="xl" variant="accent" className="w-full sm:w-auto">
                Get Started Free <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            <Link href="/rates">
              <Button size="xl" variant="ghost" className="w-full sm:w-auto bg-white text-[#0A2540] font-semibold hover:bg-white/90 transition-colors">
                View Rates
              </Button>
            </Link>
          </div>
          <div className="flex flex-wrap justify-center gap-6 mt-12 text-sm text-slate-400">
            <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-400" /> No hidden fees</div>
            <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-400" /> NIN verified</div>
            <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-400" /> WhatsApp support</div>
            <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-400" /> Paystack payments</div>
          </div>
        </div>
      </section>

      {/* Rate Cards */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-center text-[#0A2540] mb-2">Our Shipping Rates</h2>
          <p className="text-center text-slate-500 mb-10">Simple, transparent pricing. Pay only for what you ship.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {rates.map((r) => (
              <div key={r.origin} className={`border-2 ${r.color} rounded-xl p-6 relative hover:shadow-lg transition-shadow`}>
                {r.badge && (
                  <span className="absolute -top-3 left-4 bg-[#0A2540] text-white text-xs px-3 py-1 rounded-full">
                    {r.badge}
                  </span>
                )}
                <div className="text-4xl mb-3">{r.flag}</div>
                <h3 className="text-xl font-bold text-[#0A2540] mb-1">{r.origin}</h3>
                <div className="text-3xl font-bold text-[#F97316] mb-1">{r.rate}</div>
                <p className="text-sm text-slate-500">{r.min}</p>
                <Link href="/rates" className="mt-4 inline-flex items-center text-sm text-[#0A2540] font-medium hover:underline">
                  See full breakdown <ArrowRight className="h-3 w-3 ml-1" />
                </Link>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/rates">
              <Button variant="default" size="lg">
                Try the Rate Calculator <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-center text-[#0A2540] mb-2">How It Works</h2>
          <p className="text-center text-slate-500 mb-12">Four simple steps from checkout to your doorstep</p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div key={i} className="relative text-center">
                <div className="w-14 h-14 rounded-full bg-[#0A2540] text-white text-xl font-bold flex items-center justify-center mx-auto mb-4">
                  {s.step}
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-7 left-[60%] w-[80%] h-0.5 bg-[#F97316]/30" />
                )}
                <h3 className="font-bold text-[#0A2540] mb-2">{s.title}</h3>
                <p className="text-sm text-slate-500">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/auth/signup">
              <Button variant="accent" size="lg">
                Start Shipping Today <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-center text-[#0A2540] mb-2">Why Choose BuyandShip Nigeria?</h2>
          <p className="text-center text-slate-500 mb-12">Everything you need for stress-free international shipping</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {whyUs.map((w, i) => (
              <div key={i} className="p-6 rounded-xl border border-slate-100 hover:border-[#F97316]/30 hover:shadow-md transition-all group">
                <div className="w-12 h-12 rounded-lg bg-[#F97316]/10 text-[#F97316] flex items-center justify-center mb-4 group-hover:bg-[#F97316] group-hover:text-white transition-colors">
                  {w.icon}
                </div>
                <h3 className="font-bold text-[#0A2540] mb-2">{w.title}</h3>
                <p className="text-sm text-slate-500">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 px-4 bg-[#F97316]">
        <div className="container mx-auto max-w-3xl text-center">
          <Package className="h-12 w-12 text-white mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-4">Ready to start shipping?</h2>
          <p className="text-orange-100 mb-8">
            Join thousands of Nigerians shopping from the USA, UK, and China with ease.
            Create your free account today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="xl" className="bg-white text-[#F97316] hover:bg-orange-50 w-full sm:w-auto">
                Create Free Account <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            <a href="https://wa.me/2348029155825" target="_blank" rel="noopener noreferrer">
              <Button size="xl" className="bg-green-500 hover:bg-green-600 text-white font-semibold w-full sm:w-auto">
                <MessageCircle className="h-5 w-5 mr-2" /> Chat on WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
