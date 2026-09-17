'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UploadCloud, CheckCircle } from 'lucide-react';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

function validatePhone(phone: string) {
  return /^(0[7-9][01]\d{8}|\+234[7-9][01]\d{8})$/.test(phone.replace(/\s/g, ''));
}

export function VerificationPortal() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!phone || !validatePhone(phone)) {
      setError('Enter a valid Nigerian phone number (e.g. 08012345678).');
      return;
    }
    if (!file) {
      setError('Please attach your NIN slip or a valid ID.');
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setError('File is too large — max 5MB.');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('fullName', fullName);
      formData.append('email', email);
      formData.append('phone', phone);
      formData.append('file', file);

      const res = await fetch('/api/verification', { method: 'POST', body: formData });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong. Please try again.');
        return;
      }

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
        <h3 className="text-xl font-bold text-[#0A2540] mb-2">Submitted!</h3>
        <p className="text-slate-600 text-sm">
          We&apos;ve received your ID. Our team will verify it and reach out to you on WhatsApp or
          email shortly.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-8 max-w-lg mx-auto shadow-sm">
      <h3 className="text-xl font-bold text-[#0A2540] mb-1">Identity Verification Portal</h3>
      <p className="text-slate-500 text-sm mb-6">
        Want to ship or shop for yourself? Verify your identity here and our team will reach out
        to get you started.
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
          <Label htmlFor="v-file">NIN Slip or Government ID *</Label>
          <label
            htmlFor="v-file"
            className="mt-1 flex items-center gap-3 border-2 border-dashed border-slate-200 rounded-lg px-4 py-3 cursor-pointer hover:border-[#F97316] transition-colors"
          >
            <UploadCloud className="h-5 w-5 text-slate-400 flex-shrink-0" />
            <span className="text-sm text-slate-500 truncate">
              {file ? file.name : 'Click to upload (JPG, PNG, or PDF — max 5MB)'}
            </span>
          </label>
          <input
            id="v-file"
            type="file"
            accept="image/jpeg,image/png,image/webp,application/pdf"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button type="submit" className="w-full" size="lg" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit for Verification'}
        </Button>
      </form>
    </div>
  );
}
