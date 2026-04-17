import type { Metadata } from 'next';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export const metadata: Metadata = {
  title: 'FAQs – BuyandShip Nigeria',
  description: 'Frequently asked questions about shipping from USA, UK, and China to Nigeria with BuyandShip Nigeria.',
};

const faqs = [
  {
    q: 'How does BuyandShip Nigeria work?',
    a: "You create an account, get your personal warehouse address in the USA, UK, or China, shop online using that address, then submit a shipping request. We receive your item, calculate the cost, and ship it to you in Nigeria.",
  },
  {
    q: 'How do I get my warehouse address?',
    a: "After creating and verifying your account, your personal warehouse addresses for USA, UK, and China are automatically assigned to your account and emailed to you.",
  },
  {
    q: 'What are your shipping rates?',
    a: "USA: $9/lb (minimum $35 for up to 4 lbs). UK: £9/kg (minimum 5kg = £45). China: $10/kg (minimum 3kg = $30). See our Rates page for an interactive calculator.",
  },
  {
    q: 'Can I ship electronics/phones/laptops from the UK?',
    a: "Yes, gadgets and electronics can now be shipped from our UK warehouse. However, your receipt and invoice MUST show your name exactly as it appears on your BuyandShip Nigeria account. Items will be held if documents do not match your registered name.",
  },
  {
    q: 'Why must +2348029155825 appear on my China label?',
    a: "Our China warehouse requires your phone number on the shipping label as a shipping mark to correctly identify and process your package. Failure to include this number may result in your package being undeliverable.",
  },
  {
    q: 'How long does shipping take?',
    a: "USA: 7–14 business days. UK: 7–14 business days. China: 14–21 business days. These are estimates from the time your item is received at our warehouse. Customs processing may add extra time.",
  },
  {
    q: 'How do I pay for shipping?',
    a: "You pay securely via Paystack using your debit/credit card or bank transfer. We will email you an invoice with a payment link once your item has been weighed at our warehouse.",
  },
  {
    q: 'What is the procurement service?',
    a: "If you cannot ship to our warehouse yourself (e.g., the seller doesn't ship to us or you need assistance purchasing), we can buy the item on your behalf for a 5% procurement fee on top of the item cost plus shipping.",
  },
  {
    q: 'Do I need to verify my identity?',
    a: "Yes. All customers must verify their identity with their NIN (National Identification Number) before submitting shipping or procurement requests. This protects all parties and ensures compliance.",
  },
  {
    q: 'What if my NIN verification fails?',
    a: "If NIN verification fails, you can upload an alternative government-issued ID (e.g., Driver's Licence, International Passport, Voter's Card) for manual review by our team.",
  },
  {
    q: 'Can I track my shipment?',
    a: "Yes. You can track your shipment on our /track page using your Request ID or tracking number. You'll also receive email updates whenever your shipment status changes.",
  },
  {
    q: 'What items are prohibited?',
    a: "We do not ship: weapons, drugs, hazardous materials, perishable food items, live animals, counterfeit goods, or any items prohibited by Nigerian customs law. Gadgets and electronics from the UK are allowed but require a receipt and invoice matching your registered account name exactly.",
  },
  {
    q: 'What happens if my item is lost or damaged?',
    a: "We handle your items with care. In the unlikely event of loss or damage, please contact us via WhatsApp immediately. We recommend declaring accurate item values and purchasing insurance for high-value items.",
  },
  {
    q: 'Is there a weight limit per shipment?',
    a: "There is no strict upper weight limit. However, for very large or heavy shipments (over 100kg), please contact us via WhatsApp for a custom quote.",
  },
  {
    q: 'Can I consolidate multiple packages?',
    a: "Yes! If you shop at multiple stores and send everything to our warehouse, we can consolidate your packages into one shipment to save on shipping costs. Just mention this when submitting your request.",
  },
  {
    q: 'What currencies are accepted for payment?',
    a: "All payments are processed in Naira (NGN) via Paystack using the current exchange rate. Shipping costs are quoted in USD or GBP and converted to NGN at the time of invoicing.",
  },
  {
    q: 'How do I contact customer support?',
    a: "WhatsApp us on 08029155825 (Mon–Fri, 9am–5pm WAT), email admin@buyandshiptonigeria.com, or use the contact form on our website. WhatsApp is the fastest way to reach us.",
  },
  {
    q: 'Do you deliver to all states in Nigeria?',
    a: "Yes! We deliver to all 36 states and Abuja. Delivery timelines may vary by location. Please provide your full delivery address including state when submitting your request.",
  },
  {
    q: 'What is the minimum declared value required?',
    a: "For items valued over $300 (USA/China) or £200 (UK), you must declare the accurate value and check a mandatory declaration checkbox. Under-declaring values is against our policy and may cause customs issues.",
  },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
};

export default function FAQsPage() {
  return (
    <PublicLayout>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="bg-[#0A2540] text-white py-14 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold mb-3">Frequently Asked Questions</h1>
          <p className="text-slate-300">Everything you need to know about shipping with BuyandShip Nigeria</p>
        </div>
      </div>

      <div className="container mx-auto max-w-3xl px-4 py-14">
        <Accordion type="single" collapsible className="space-y-2">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border border-slate-200 rounded-lg px-4">
              <AccordionTrigger className="text-left font-medium text-[#0A2540] hover:no-underline hover:text-[#F97316]">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-slate-600 leading-relaxed">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-12 p-6 bg-[#F97316]/10 border border-[#F97316]/20 rounded-xl text-center">
          <p className="font-semibold text-[#0A2540] mb-2">Still have questions?</p>
          <p className="text-slate-600 text-sm mb-4">
            Our team is available Mon–Fri, 9am–5pm WAT
          </p>
          <a
            href="https://wa.me/2348029155825"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors"
          >
            Chat on WhatsApp
          </a>
        </div>
      </div>
    </PublicLayout>
  );
}
