'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { supabaseBrowser } from '@/lib/supabase';

const navLinks = [
  { href: '/rates', label: 'Rates' },
  { href: '/ship-yourself', label: 'Ship Yourself' },
  { href: '/procure', label: 'Procure' },
  { href: '/track', label: 'Track' },
  { href: '/faqs', label: 'FAQs' },
  { href: '/contact', label: 'Contact' },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const supabase = supabaseBrowser();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setLoggedIn(!!session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setLoggedIn(!!session);
    });
    return () => subscription.unsubscribe();
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-[#0A2540] shadow-md">
      <div className="container mx-auto flex h-20 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image src="/logo-white.png" alt="BuyandShip Nigeria" width={220} height={66} className="h-16 w-auto" priority />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm font-medium transition-colors',
                pathname === link.href
                  ? 'text-[#F97316]'
                  : 'text-slate-300 hover:text-white'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          {loggedIn ? (
            <Link href="/auth/dashboard">
              <Button variant="accent" size="sm" className="flex items-center gap-1.5">
                <LayoutDashboard className="h-4 w-4" />
                My Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/auth/login">
                <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-white/10" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button variant="accent" size="sm">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-[#0f2f50] border-t border-white/10 px-4 py-4">
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium py-2 px-3 rounded-md transition-colors',
                  pathname === link.href
                    ? 'bg-[#F97316]/20 text-[#F97316]'
                    : 'text-slate-300 hover:text-white hover:bg-white/10'
                )}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex gap-3 mt-2 pt-3 border-t border-white/10">
              {loggedIn ? (
                <Link href="/auth/dashboard" className="flex-1" onClick={() => setOpen(false)}>
                  <Button variant="accent" size="sm" className="w-full flex items-center gap-1.5">
                    <LayoutDashboard className="h-4 w-4" />
                    My Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link href="/auth/login" className="flex-1" onClick={() => setOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full border-white/20 text-white hover:bg-white/10">
                      Login
                    </Button>
                  </Link>
                  <Link href="/auth/signup" className="flex-1" onClick={() => setOpen(false)}>
                    <Button variant="accent" size="sm" className="w-full">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
