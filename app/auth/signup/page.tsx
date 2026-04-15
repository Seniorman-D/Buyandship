'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabaseBrowser } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, CheckCircle } from 'lucide-react';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  function validatePhone(phone: string) {
    // Nigerian: 11 digits starting with 0 (070x, 080x, 081x, 090x, 091x)
    // or international +234 format
    return /^(0[7-9][01]\d{8}|\+234[7-9][01]\d{8})$/.test(phone.replace(/\s/g, ''));
  }

  async function handleSubmit(e: React.FormEvent) {
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
    setLoading(true);
    setError('');

    const supabase = supabaseBrowser();
    const { data, error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: { full_name: formData.fullName, phone: formData.phone },
        emailRedirectTo: `${window.location.origin}/auth/dashboard`,
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      // Create customer profile via server API (uses service role to bypass RLS,
      // since signUp with email confirmation returns no session yet so auth.uid()
      // would be null and the direct client insert would be silently blocked)
      await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: data.user.id,
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
        }),
      });

      // Send welcome email
      try {
        await fetch('/api/email/welcome', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: formData.email, name: formData.fullName }),
        });
      } catch {}
    }

    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-lg">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-[#0A2540] mb-2">Check your email!</h2>
          <p className="text-slate-600 mb-6">
            We sent a confirmation link to <strong>{formData.email}</strong>.
            Click the link to activate your account and start shipping.
          </p>
          <Link href="/auth/login">
            <Button className="w-full">Go to Login</Button>
          </Link>
        </div>
      </div>
    );
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

          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
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
