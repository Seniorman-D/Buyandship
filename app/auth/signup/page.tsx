'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff } from 'lucide-react';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');

  function validatePhone(phone: string) {
    // Nigerian: 11 digits starting with 0 (070x, 080x, 081x, 090x, 091x)
    // or international +234 format
    return /^(0[7-9][01]\d{8}|\+234[7-9][01]\d{8})$/.test(phone.replace(/\s/g, ''));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!formData.phone || !validatePhone(formData.phone)) {
      setError('Enter a valid Nigerian phone number (e.g. 08012345678).');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setError('');
    window.open('https://wa.me/2348029155825', '_blank', 'noopener,noreferrer');
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-lg">
        <Link href="/" className="flex items-center justify-center mb-8">
          <Image src="/logo.png" alt="BuyandShip Nigeria" width={240} height={72} className="h-16 w-auto" />
        </Link>

        <h1 className="text-2xl font-bold text-[#0A2540] mb-1">Create your account</h1>
        <p className="text-slate-500 text-sm mb-6">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-[#F97316] font-medium hover:underline">Log in</Link>
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="fullName">Full Name *</Label>
            <Input
              id="fullName"
              type="text"
              required
              placeholder="Your legal name"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              required
              placeholder="you@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="phone">Phone Number *</Label>
            <Input
              id="phone"
              type="tel"
              required
              placeholder="08012345678"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="mt-1"
            />
            <p className="text-xs text-slate-400 mt-1">Nigerian number — e.g. 08012345678 or +2348012345678</p>
          </div>

          <div>
            <Label htmlFor="password">Password *</Label>
            <div className="relative mt-1">
              <Input
                id="password"
                type={showPw ? 'text' : 'password'}
                required
                placeholder="Min 8 characters"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <Label htmlFor="confirmPassword">Confirm Password *</Label>
            <Input
              id="confirmPassword"
              type="password"
              required
              placeholder="Repeat your password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="mt-1"
            />
          </div>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <Button type="submit" className="w-full" size="lg">
            Create Account
          </Button>
        </form>

        <p className="text-xs text-slate-400 text-center mt-4">
          By creating an account, you agree to our{' '}
          <Link href="/policies" className="underline">Terms of Service</Link> and{' '}
          <Link href="/policies#privacy" className="underline">Privacy Policy</Link>
        </p>
      </div>
    </div>
  );
}
