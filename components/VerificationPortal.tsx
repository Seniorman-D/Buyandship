'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle, ShieldCheck } from 'lucide-react';

function validatePhone(phone: string) {
  return /^(0[7-9][01]\d{8}|\+234[7-9][01]\d{8})$/.test(phone.replace(/\s/g, ''));
}

export function VerificationPortal() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [nin, setNin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [verifiedName, setVerifiedName] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!phone || !validatePhone(phone)) {
      setError('Enter a valid Nigerian phone number (e.g. 08012345678).');
      return;
    }
    if (nin.length !== 11 || !/^\d{11}$/.test(nin)) {
      setError('Enter a valid 11-digit NIN.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, email, phone, nin }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
        return;
      }

      setVerifiedName(`${data.firstName || ''} ${data.lastName || ''}`.trim());
      setSuccess(true);
    } catch {
      setError('Something went wrong. Please try again or reach us on WhatsApp.');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8 max-w-lg mx-auto text-center shadow-sm">
        <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-7 w-7 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-[#0A2540] mb-2">Identity Verified!</h3>
        <p className="text-slate-600 text-sm">
          {verifiedName ? <>Confirmed as <strong>{verifiedName}</strong>. </> : null}
          Our team will reach out to you on WhatsApp or email shortly to get you started.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-8 max-w-lg mx-auto shadow-sm">
      <h3 className="text-xl font-bold text-[#0A2540] mb-1">Identity Verification Portal</h3>
      <p className="text-slate-500 text-sm mb-6">
        Want to ship or shop for yourself? Verify your NIN below — it&apos;s checked instantly
        against the national database.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="v-fullName">Full Name *</Label>
          <Input
            id="v-fullName"
            type="text"
            required
            placeholder="Your legal name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="v-email">Email Address *</Label>
          <Input
            id="v-email"
            type="email"
            required
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="v-phone">Phone Number *</Label>
          <Input
            id="v-phone"
            type="tel"
            required
            placeholder="08012345678"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="v-nin">NIN (National Identification Number) *</Label>
          <div className="relative mt-1">
            <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              id="v-nin"
              type="text"
              inputMode="numeric"
              required
              maxLength={11}
              placeholder="11-digit NIN"
              value={nin}
              onChange={(e) => setNin(e.target.value.replace(/\D/g, '').slice(0, 11))}
              className="pl-9"
            />
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? 'Verifying...' : 'Verify My Identity'}
        </Button>
      </form>
    </div>
  );
}
