import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, MessageCircle } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#0A2540] text-slate-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="mb-3">
              <Image src="/logo-white.png" alt="BuyandShip Nigeria" width={150} height={45} className="h-10 w-auto" />
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              Shop Anywhere. Ship to Nigeria. Your trusted shipping partner for USA, UK &amp; China goods.
            </p>
            <div className="flex gap-3 mt-4">
              <a
                href="https://wa.me/2348029155825"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-full transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/ship-yourself" className="hover:text-white transition-colors">Ship Yourself</Link></li>
              <li><Link href="/procure" className="hover:text-white transition-colors">Procurement Service</Link></li>
              <li><Link href="/track" className="hover:text-white transition-colors">Track Shipment</Link></li>
              <li><Link href="/rates" className="hover:text-white transition-colors">Shipping Rates</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/faqs" className="hover:text-white transition-colors">FAQs</Link></li>
              <li><Link href="/policies" className="hover:text-white transition-colors">Policies</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link href="/auth/signup" className="hover:text-white transition-colors">Create Account</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                <a href="https://wa.me/2348029155825" target="_blank" rel="noopener noreferrer" className="hover:text-white">
                  WhatsApp: 08029155825
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#F97316] flex-shrink-0" />
                <a href="tel:+2348029155825" className="hover:text-white">+234 802 915 5825</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#F97316] flex-shrink-0" />
                <a href="mailto:admin@buyandshiptonigeria.com" className="hover:text-white">
                  admin@buyandshiptonigeria.com
                </a>
              </li>
            </ul>
            <p className="text-xs text-slate-500 mt-3">Mon–Fri, 9am–5pm WAT</p>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} BuyandShip Nigeria. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/policies" className="hover:text-slate-300">Privacy Policy</Link>
            <Link href="/policies" className="hover:text-slate-300">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
