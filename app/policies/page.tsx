import type { Metadata } from 'next';
import { PublicLayout } from '@/components/layout/PublicLayout';

export const metadata: Metadata = {
  title: 'Policies – BuyandShip Nigeria',
  description: 'Terms of service, privacy policy, shipping policies, and prohibited items for BuyandShip Nigeria.',
  alternates: { canonical: 'https://buyandshiptonigeria.com/policies' },
};

const sections = [
  {
    id: 'terms',
    title: 'Terms of Service',
    content: `By using BuyandShip Nigeria ("we", "us", "our"), you agree to these Terms of Service. These terms govern your use of our website and services.

**Account Registration**
You must be at least 18 years old to create an account. You are responsible for maintaining the security of your account credentials. You must provide accurate, current, and complete information during registration.

**Identity Verification**
All users must verify their identity using a valid Nigerian NIN (National Identification Number) or alternative government-issued ID before submitting shipping or procurement requests. This is required by law and for the safety of all parties.

**Acceptable Use**
You agree not to use our services to ship prohibited items (see Prohibited Items section), provide false or misleading information about the nature or value of goods, attempt to evade customs duties or taxes, or use our services for any unlawful purpose.

**Payment**
All payments are non-refundable once your item has been shipped from our warehouse. Invoices must be paid within 14 days. Unpaid items may be returned to sender or disposed of at our discretion after 30 days.

**Limitation of Liability**
Our liability is limited to the declared value of your shipment. We strongly recommend declaring accurate values and considering insurance for high-value items.`,
  },
  {
    id: 'privacy',
    title: 'Privacy Policy',
    content: `BuyandShip Nigeria is committed to protecting your personal information.

**Data We Collect**
We collect your name, email, phone number, NIN (for identity verification), delivery addresses, and shipment details.

**How We Use Your Data**
Your data is used to process shipping requests, communicate shipment updates, verify your identity, process payments, and improve our services.

**Data Sharing**
We share your information only with service providers necessary to fulfil your shipment (e.g., our warehouse partners, delivery agents) and as required by Nigerian law.

**Data Security**
We use industry-standard encryption and security measures. Your data is stored securely on Supabase servers.

**Your Rights**
You may request access to, correction of, or deletion of your personal data by contacting admin@buyandshiptonigeria.com.

**Cookies**
We use essential cookies only for authentication and session management. We do not use advertising cookies.`,
  },
  {
    id: 'shipping',
    title: 'Shipping Policy',
    content: `**Processing Time**
After receiving your item at our warehouse and payment confirmation, we process shipments within 1–2 business days.

**Delivery Timeframes**
- USA: 7–14 business days from warehouse receipt
- UK: 7–14 business days from warehouse receipt
- China: 14–21 business days from warehouse receipt

Timeframes are estimates and may vary due to customs processing, public holidays, or unforeseen circumstances.

**Weight Calculation**
We charge based on actual weight or dimensional weight, whichever is greater. Dimensional weight = (Length × Width × Height) / 5000 (in cm).

**Minimums**
- USA: Minimum charge $35 (covers 0–4 lbs)
- UK: Minimum 5kg applies (minimum £45)
- China: Minimum 3kg applies (minimum $30)

**Consolidation**
Multiple packages shipped to the same warehouse can be consolidated into one shipment. Please note this in your shipping request.

**High-Value Items**
Items valued over $300 (USA/China) or £200 (UK) require mandatory value declaration. We strongly recommend insurance for high-value items.

**Customs**
Customers are responsible for any customs duties or import taxes imposed by Nigerian customs on their shipments.`,
  },
  {
    id: 'prohibited',
    title: 'Prohibited Items',
    content: `The following items CANNOT be shipped through BuyandShip Nigeria:

**Globally Prohibited:**
- Weapons, firearms, and ammunition
- Illegal drugs and controlled substances
- Hazardous materials (explosives, flammable liquids, radioactive materials)
- Perishable food items
- Live animals
- Counterfeit or pirated goods
- Currency (cash)
- Pornographic materials
- Any items violating Nigerian customs law

**UK Gadgets & Electronics — Allowed with Conditions:**
Gadgets and electronics CAN be shipped from our UK warehouse, subject to the following requirement:

- Your receipt and invoice MUST display your name exactly as registered on your BuyandShip Nigeria account.
- Items will be held and not processed if documents do not match your registered account name.
- This applies to smartphones, laptops, tablets, iPads, AirPods, smartwatches, gaming consoles, and all battery-powered electronic devices.

Electronics can also be shipped from our USA and China warehouses under the same documentation rule.

**Violation**
Shipping prohibited items will result in immediate account suspension, seizure of the shipment, and potential legal action. No refunds will be issued for prohibited items.`,
  },
  {
    id: 'refunds',
    title: 'Refund Policy',
    content: `**Shipping Fees**
Shipping fees are non-refundable once your item has been picked up from our warehouse and is in transit.

**Before Dispatch**
If you cancel your request before your item has been dispatched from our warehouse, a refund may be processed minus any handling fees already incurred.

**Damaged/Lost Items**
In the rare event your item is lost or damaged while in our care, we will investigate and provide compensation up to the declared value. Please report any issues within 48 hours of delivery.

**Procurement Refunds**
Procurement fees (5%) are non-refundable once we have placed your order with the seller. Product refunds depend on the seller's return policy.

**How to Request**
Contact us at admin@buyandshiptonigeria.com or WhatsApp 08029155825 with your Request ID and details of your refund request. We aim to respond within 2 business days.`,
  },
];

export default function PoliciesPage() {
  return (
    <PublicLayout>
      <div className="bg-[#0A2540] text-white py-14 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold mb-3">Policies</h1>
          <p className="text-slate-300">Our terms, policies, and guidelines — effective immediately</p>
        </div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 py-14">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <aside className="md:w-56 flex-shrink-0">
            <div className="sticky top-20">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Jump to</h3>
              <nav className="space-y-1">
                {sections.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="block text-sm text-slate-600 hover:text-[#0A2540] hover:font-medium py-1.5 px-3 rounded-md hover:bg-slate-100 transition-colors"
                  >
                    {s.title}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Content */}
          <div className="flex-1 space-y-12">
            {sections.map((s) => (
              <section key={s.id} id={s.id}>
                <h2 className="text-2xl font-bold text-[#0A2540] mb-4 pb-2 border-b border-slate-200">
                  {s.title}
                </h2>
                <div className="prose prose-slate max-w-none">
                  {s.content.split('\n\n').map((para, i) => {
                    if (para.startsWith('**') && para.endsWith('**')) {
                      return <h3 key={i} className="font-bold text-[#0A2540] mt-4 mb-2">{para.replace(/\*\*/g, '')}</h3>;
                    }
                    return (
                      <p key={i} className="text-slate-600 leading-relaxed mb-3">
                        {para.split(/(\*\*[^*]+\*\*)/).map((part, j) => {
                          if (part.startsWith('**') && part.endsWith('**')) {
                            return <strong key={j}>{part.replace(/\*\*/g, '')}</strong>;
                          }
                          return <span key={j}>{part}</span>;
                        })}
                      </p>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
