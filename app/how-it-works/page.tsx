import type { Metadata } from 'next';
import Link from 'next/link';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'How It Works — BuyandShip Nigeria',
  description:
    'Step-by-step guide to shipping from the US, UK, and China to Nigeria. Create an account, get your warehouse address, shop online, and receive delivery to your door.',
  alternates: { canonical: 'https://buyandshiptonigeria.com/how-it-works' },
};

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://buyandshiptonigeria.com' },
    { '@type': 'ListItem', position: 2, name: 'How It Works', item: 'https://buyandshiptonigeria.com/how-it-works' },
  ],
};

function BrowserMock({ slug, children }: { slug: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl overflow-hidden border border-slate-200 shadow-md mt-6">
      <div className="bg-[#0A2540] px-4 py-2.5 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        <div className="flex-1 bg-[#0d3160] rounded px-3 py-1 text-xs text-slate-400 font-mono">
          buyandshiptonigeria.com/{slug}
        </div>
      </div>
      <div className="bg-white p-5">{children}</div>
    </div>
  );
}

function TipPill({ text }: { text: string }) {
  return (
    <div className="inline-flex items-start gap-2 bg-green-50 border border-green-200 text-green-800 text-sm px-4 py-2.5 rounded-full mt-5">
      <span className="text-green-600 font-bold shrink-0">💡</span>
      <span>{text}</span>
    </div>
  );
}

const steps = [
  {
    number: '01',
    title: 'Create Your Account & Verify Your Identity',
    bg: 'bg-white',
    body: [
      'Navigate to buyandshiptonigeria.com and click "Get Started Free." Enter your name, email, phone number and create a password.',
      'You will be prompted to verify your identity with your NIN (National Identification Number) or a government-issued ID such as a Driver\'s Licence, International Passport, or Voter\'s Card.',
      'This is a one-time step required for Nigerian customs compliance and takes under 2 minutes. Once verified, your account is fully activated and ready for shipments.',
    ],
    mockSlug: 'auth/signup',
    mock: (
      <div className="space-y-3">
        <div>
          <label className="text-xs text-slate-500 font-medium block mb-1">Full Name</label>
          <div className="h-9 bg-slate-100 rounded-md border border-slate-200 px-3 text-sm flex items-center text-slate-400">e.g. Chukwuemeka Okonkwo</div>
        </div>
        <div>
          <label className="text-xs text-slate-500 font-medium block mb-1">Email Address</label>
          <div className="h-9 bg-slate-100 rounded-md border border-slate-200 px-3 text-sm flex items-center text-slate-400">your@email.com</div>
        </div>
        <div>
          <label className="text-xs text-slate-500 font-medium block mb-1">Phone Number</label>
          <div className="h-9 bg-slate-100 rounded-md border border-slate-200 px-3 text-sm flex items-center text-slate-400">080XXXXXXXX</div>
        </div>
        <div>
          <label className="text-xs text-slate-500 font-medium block mb-1">NIN / ID Number</label>
          <div className="h-9 bg-slate-100 rounded-md border border-slate-200 px-3 text-sm flex items-center text-slate-400">11-digit NIN</div>
        </div>
        <div className="h-9 bg-[#0A2540] rounded-md flex items-center justify-center text-white text-sm font-semibold">Create My Account</div>
      </div>
    ),
    tip: 'Use the same name on your BuyandShip account as the one on your shopping site — it speeds up customs clearance.',
  },
  {
    number: '02',
    title: 'Find Your Personal Warehouse Address',
    bg: 'bg-slate-50',
    body: [
      'After signing up, go to Dashboard → My Addresses. You will see your dedicated US, UK, and China warehouse addresses. These are unique to your account.',
      'Use these as your delivery address when you shop online — the retailer ships to our warehouse, and we ship onwards to Nigeria.',
      'Your US address includes a Suite number unique to your account so packages are matched to you instantly when they arrive at our facility.',
    ],
    mockSlug: 'auth/dashboard',
    mock: (
      <div className="space-y-3">
        {[
          { flag: '🇺🇸', label: 'US Warehouse', line1: 'BUYANDSHIP — JOHN DOE', line2: '123 Warehouse Ave, Suite #00001', line3: 'New York, NY 10001, USA' },
          { flag: '🇬🇧', label: 'UK Warehouse', line1: 'BUYANDSHIP — JOHN DOE', line2: '45 Logistics Park, Unit B2', line3: 'London, E1 6RF, UK' },
          { flag: '🇨🇳', label: 'China Warehouse', line1: 'BUYANDSHIP — JOHN DOE', line2: 'Your phone number on label', line3: 'Guangzhou, Guangdong, China' },
        ].map((addr) => (
          <div key={addr.flag} className="bg-slate-50 border border-slate-200 rounded-lg p-3 flex items-start gap-3">
            <span className="text-2xl">{addr.flag}</span>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-600 mb-0.5">{addr.label}</p>
              <p className="text-xs text-slate-500 leading-relaxed">{addr.line1}<br />{addr.line2}<br />{addr.line3}</p>
            </div>
            <button className="shrink-0 text-xs bg-[#0A2540] text-white px-2.5 py-1 rounded font-medium">Copy</button>
          </div>
        ))}
      </div>
    ),
    tip: 'Save this address in your Amazon or ASOS account right now so it is ready at every checkout.',
  },
  {
    number: '03',
    title: 'Shop on Any US, UK, or China Store',
    bg: 'bg-white',
    body: [
      'Visit any retailer — Amazon, Walmart, ASOS, eBay, iHerb, Shein, AliExpress — and shop normally. At checkout, paste your BuyandShip warehouse address as the delivery address.',
      'The store ships to our warehouse at no extra cost from you — you pay only the store\'s standard shipping rate to the US/UK/China address, and we handle everything from there to Nigeria.',
      'There are no restrictions on the number of packages you send to the warehouse. Once multiple packages arrive, you can request consolidation to save on shipping.',
    ],
    mockSlug: '',
    mock: (
      <div className="space-y-2">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Checkout — Delivery Address</p>
        {[
          ['Full Name', 'BUYANDSHIP — YOUR NAME'],
          ['Address Line 1', '123 Warehouse Ave, Suite #00001'],
          ['City', 'New York'],
          ['State', 'New York (NY)'],
          ['ZIP Code', '10001'],
          ['Country', 'United States'],
        ].map(([label, val]) => (
          <div key={label}>
            <p className="text-xs text-slate-400 mb-0.5">{label}</p>
            <div className="h-8 bg-blue-50 border border-blue-200 rounded px-2.5 text-xs flex items-center text-slate-700 font-medium">{val}</div>
          </div>
        ))}
      </div>
    ),
    tip: 'For China orders, add +2348029155825 to your label or sender notes — this is required for all China shipments.',
  },
  {
    number: '04',
    title: 'Submit a Shipping Request',
    bg: 'bg-slate-50',
    body: [
      'Once you have placed your order with the retailer, log into your BuyandShip dashboard and click "New Shipping Request." This takes about 2 minutes.',
      'Declare what is coming, the approximate weight, the retailer, and the origin country. This lets our team look out for your package at the warehouse and process it faster on arrival.',
      'Use the rate calculator at /rates to estimate your shipping cost to Nigeria before you place your order, so there are no surprises.',
    ],
    mockSlug: 'ship-yourself',
    mock: (
      <div className="space-y-3">
        <div>
          <label className="text-xs text-slate-500 font-medium block mb-1">Item Description</label>
          <div className="h-9 bg-slate-100 rounded-md border border-slate-200 px-3 text-sm flex items-center text-slate-400">e.g. Nike Air Max 270, Size 10</div>
        </div>
        <div>
          <label className="text-xs text-slate-500 font-medium block mb-1">Retailer / Store</label>
          <div className="h-9 bg-slate-100 rounded-md border border-slate-200 px-3 text-sm flex items-center text-slate-400">e.g. Amazon.com</div>
        </div>
        <div>
          <label className="text-xs text-slate-500 font-medium block mb-1">Estimated Weight</label>
          <div className="h-9 bg-slate-100 rounded-md border border-slate-200 px-3 text-sm flex items-center text-slate-400">e.g. 1.5 lbs</div>
        </div>
        <div>
          <label className="text-xs text-slate-500 font-medium block mb-1">Origin</label>
          <div className="flex gap-2">
            {['🇺🇸 USA', '🇬🇧 UK', '🇨🇳 China'].map((o) => (
              <div key={o} className={`flex-1 h-9 rounded-md border text-xs flex items-center justify-center font-medium ${o.includes('USA') ? 'bg-[#0A2540] text-white border-[#0A2540]' : 'bg-white text-slate-500 border-slate-200'}`}>{o}</div>
            ))}
          </div>
        </div>
        <div className="h-9 bg-[#F97316] rounded-md flex items-center justify-center text-white text-sm font-semibold">Submit Request</div>
      </div>
    ),
    tip: 'Use the rate calculator at /rates to estimate your shipping cost before you order.',
  },
  {
    number: '05',
    title: 'We Receive, Weigh & Notify You',
    bg: 'bg-white',
    body: [
      'When your package arrives at our warehouse, we weigh it precisely and calculate the exact shipping cost to Nigeria based on our published rates.',
      'You receive a WhatsApp notification with the confirmed weight and shipping cost. If the cost differs from your estimate, we will always notify you before proceeding.',
      'If you have multiple packages arriving, request consolidation before we ship — it can reduce your total shipping cost by 20–30% by combining everything into one consignment.',
    ],
    mockSlug: '',
    mock: (
      <div className="space-y-3">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">WhatsApp Notification</p>
        <div className="bg-[#dcf8c6] rounded-2xl rounded-tl-sm px-4 py-3 max-w-xs">
          <p className="text-sm text-slate-800 leading-relaxed">
            📦 <strong>Package Arrived!</strong><br />
            Item: Nike Air Max 270<br />
            Weight: <strong>1.4 lbs</strong><br />
            Shipping cost: <strong>$12.60</strong><br /><br />
            Reply <strong>YES</strong> to confirm shipment or <strong>CONSOLIDATE</strong> if more packages are coming.
          </p>
          <p className="text-xs text-slate-400 text-right mt-1">10:34 AM ✓✓</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-2xl rounded-tr-sm px-4 py-2 max-w-xs ml-auto">
          <p className="text-sm text-slate-700">YES, please ship it 🙏</p>
          <p className="text-xs text-slate-400 text-right mt-1">10:35 AM ✓✓</p>
        </div>
      </div>
    ),
    tip: 'Consolidating multiple packages almost always saves money — ask us before we ship.',
  },
  {
    number: '06',
    title: 'Pay & Track Your Shipment',
    bg: 'bg-slate-50',
    body: [
      'We send you a secure Paystack payment link via WhatsApp for the Nigeria-leg shipping cost. Pay by debit card, credit card, or bank transfer in Naira.',
      'Once paid, your package is dispatched and you receive a tracking number. Track in real time at buyandshiptonigeria.com/track at any stage of the journey.',
      'Delivery takes 7–14 business days from our US or UK warehouse, and 14–21 business days from our China warehouse. You will receive status updates at every stage.',
    ],
    mockSlug: 'track',
    mock: (
      <div className="space-y-4">
        <div>
          <label className="text-xs text-slate-500 font-medium block mb-1">Tracking Number</label>
          <div className="h-9 bg-slate-100 rounded-md border border-slate-200 px-3 text-sm flex items-center text-slate-500 font-mono">BAS-17123456-ABCD</div>
        </div>
        <div className="space-y-0">
          {[
            { label: 'Warehouse Received', done: true },
            { label: 'In Transit', done: true },
            { label: 'Customs Cleared', done: false },
            { label: 'Out for Delivery', done: false },
            { label: 'Delivered', done: false },
          ].map((step, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="flex flex-col items-center">
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${step.done ? 'bg-green-500 border-green-500' : 'bg-white border-slate-300'}`}>
                  {step.done && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
                {i < 4 && <div className={`w-0.5 h-6 ${step.done ? 'bg-green-400' : 'bg-slate-200'}`} />}
              </div>
              <p className={`text-xs ${step.done ? 'text-green-700 font-semibold' : 'text-slate-400'}`}>{step.label}</p>
            </div>
          ))}
        </div>
      </div>
    ),
    tip: 'Need express delivery? WhatsApp us on 08029155825 and we will check availability for your shipment.',
  },
  {
    number: '07',
    title: "Can't Shop Abroad? Use Procurement",
    bg: 'bg-white',
    body: [
      "No dollar card? No foreign account? No problem. Our Procurement Service lets you send us a product link from any US, UK, or China retailer and we buy it for you.",
      'We charge 5% of the item cost as our procurement fee, plus the standard shipping rate to Nigeria. You pay us via Paystack in Naira before we place the order.',
      'Procurement works for shoes, electronics, supplements, fashion, baby products, books — virtually anything sold on US, UK, or China stores that is not on our prohibited items list.',
    ],
    mockSlug: 'procure',
    mock: (
      <div className="space-y-3">
        <div>
          <label className="text-xs text-slate-500 font-medium block mb-1">Product URL</label>
          <div className="h-9 bg-slate-100 rounded-md border border-slate-200 px-3 text-sm flex items-center text-slate-400 font-mono truncate">https://amazon.com/dp/B09XKXYZ12</div>
        </div>
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="text-xs text-slate-500 font-medium block mb-1">Size / Variant</label>
            <div className="h-9 bg-slate-100 rounded-md border border-slate-200 px-3 text-sm flex items-center text-slate-400">UK 10 / Black</div>
          </div>
          <div className="w-20">
            <label className="text-xs text-slate-500 font-medium block mb-1">Qty</label>
            <div className="h-9 bg-slate-100 rounded-md border border-slate-200 px-3 text-sm flex items-center text-slate-400">1</div>
          </div>
        </div>
        <div>
          <label className="text-xs text-slate-500 font-medium block mb-1">Origin</label>
          <div className="flex gap-2">
            {['🇺🇸 USA', '🇬🇧 UK', '🇨🇳 China'].map((o) => (
              <div key={o} className={`flex-1 h-9 rounded-md border text-xs flex items-center justify-center font-medium ${o.includes('USA') ? 'bg-[#0A2540] text-white border-[#0A2540]' : 'bg-white text-slate-500 border-slate-200'}`}>{o}</div>
            ))}
          </div>
        </div>
        <div className="h-9 bg-[#F97316] rounded-md flex items-center justify-center text-white text-sm font-semibold">Submit Procurement Request</div>
      </div>
    ),
    tip: 'Procurement fee is just 5% of item cost. Shipping is charged separately at the same standard rates.',
  },
];

export default function HowItWorksPage() {
  return (
    <PublicLayout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      {/* Hero */}
      <div className="bg-[#0A2540] text-white py-14 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold mb-3">How It Works</h1>
          <p className="text-slate-300 text-lg">
            From Amazon checkout to your front door in Nigeria — 7 simple steps.
          </p>
        </div>
      </div>

      {/* Steps */}
      {steps.map((step, idx) => (
        <section key={step.number} className={`py-16 px-4 ${step.bg}`}>
          <div className="container mx-auto max-w-5xl">
            <div className={`flex flex-col ${idx % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-10 items-start`}>
              {/* Content */}
              <div className="flex-1 relative">
                <div className="absolute -top-6 left-0 text-[100px] font-extrabold text-slate-100 leading-none select-none pointer-events-none z-0">
                  {step.number}
                </div>
                <div className="relative z-10 pt-8">
                  <div className="inline-block text-xs font-bold text-[#F97316] bg-[#F97316]/10 px-3 py-1 rounded-full mb-3 uppercase tracking-wider">
                    Step {step.number}
                  </div>
                  <h2 className="text-2xl font-bold text-[#0A2540] mb-4">{step.title}</h2>
                  {step.body.map((para, i) => (
                    <p key={i} className="text-slate-600 leading-relaxed mb-3">{para}</p>
                  ))}
                  <TipPill text={step.tip} />
                </div>
              </div>

              {/* Mock */}
              <div className="flex-1 w-full">
                <BrowserMock slug={step.mockSlug}>
                  {step.mock}
                </BrowserMock>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="py-16 px-4 bg-[#0A2540]">
        <div className="container mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold text-white mb-3">Ready to start shipping?</h2>
          <p className="text-slate-300 mb-8">
            Create your free account in 2 minutes. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-[#F97316] hover:bg-[#ea6c0a] text-white w-full sm:w-auto">
                Get Started Free <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <a href="https://wa.me/2348029155825" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white w-full sm:w-auto">
                Chat on WhatsApp
              </Button>
            </a>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
