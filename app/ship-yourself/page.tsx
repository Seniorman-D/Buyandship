'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { calculateShippingCost, getWarehouseAddress, isGadget, type Origin } from '@/lib/rates';
import { ShieldCheck, Copy, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabaseBrowser } from '@/lib/supabase';
import { ArrowLeft } from 'lucide-react';

type Step = 'verify' | 'address' | 'form';

export default function ShipYourselfPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('verify');
  const [checkingAuth, setCheckingAuth] = useState(true);

  // ID Gate state
  const [nin, setNin] = useState('');
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyError, setVerifyError] = useState('');
  const [verifiedName, setVerifiedName] = useState('');
  const [useDocFallback, setUseDocFallback] = useState(false);
  const [docFile, setDocFile] = useState<File | null>(null);
  const [fullName, setFullName] = useState('');

  // On mount: check if user is logged in and already NIN-verified — skip verify step
  useEffect(() => {
    async function checkVerified() {
      const supabase = supabaseBrowser();
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile } = await supabase
          .from('customers')
          .select('full_name, nin_verified')
          .eq('id', session.user.id)
          .single();

        if (profile?.nin_verified) {
          const name = profile.full_name ||
            (session.user.user_metadata?.full_name as string) || '';
          setVerifiedName(name);
          setFullName(name);
          setStep('address');
        }
      }
      setCheckingAuth(false);
    }
    checkVerified();
  }, []);

  // Address display
  const [selectedOrigin, setSelectedOrigin] = useState<Origin>('USA');
  const [copied, setCopied] = useState(false);

  // Shipping form
  const [formData, setFormData] = useState({
    origin: 'USA' as Origin,
    itemName: '',
    trackingNumber: '',
    declaredValue: '',
    declaredCurrency: 'USD',
    deliveryAddress: '',
    weightKg: '',
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [policyWarnings, setPolicyWarnings] = useState<string[]>([]);
  const [highValueDecl, setHighValueDecl] = useState(false);

  // Verify NIN
  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setVerifyLoading(true);
    setVerifyError('');
    try {
      const res = await fetch('/api/verify-nin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nin }),
      });
      const data = await res.json();
      if (data.verified) {
        setVerifiedName(`${data.firstName} ${data.lastName}`);
        setFullName(`${data.firstName} ${data.lastName}`);
        setStep('address');
      } else {
        setVerifyError(data.error || 'Verification failed');
      }
    } catch {
      setVerifyError('Verification service unavailable. Please try the document upload option.');
    } finally {
      setVerifyLoading(false);
    }
  }

  // Submit ID doc fallback
  async function handleDocSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!docFile || !fullName.trim()) {
      setVerifyError('Please provide your name and a document.');
      return;
    }
    // For now, proceed to address step — admin will review doc
    setVerifiedName(fullName);
    setStep('address');
  }

  // Copy warehouse address
  function handleCopy() {
    const addr = getWarehouseAddress(selectedOrigin, verifiedName || 'YOUR NAME');
    navigator.clipboard.writeText(addr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // Check policy compliance
  function checkPolicies() {
    const warnings: string[] = [];
    const { origin, itemName, declaredValue, declaredCurrency } = formData;

    if (origin === 'UK' && isGadget(itemName)) {
      warnings.push('⚠️ Gadgets/electronics from the UK require a receipt & invoice with your account name exactly as registered. Items will be held if documents do not match.');
    }
    if (origin === 'UK' && formData.weightKg && parseFloat(formData.weightKg) < 5) {
      warnings.push('⚠️ UK minimum is 5kg – you will be charged for 5kg (£45 minimum).');
    }
    const val = parseFloat(declaredValue);
    if (origin === 'UK' && declaredCurrency === 'GBP' && val > 200) {
      warnings.push('⚠️ Items over £200 require mandatory value declaration.');
    }
    if ((origin === 'USA' || origin === 'CHINA') && declaredCurrency === 'USD' && val > 300) {
      warnings.push('⚠️ Items over $300 require mandatory value declaration.');
    }

    setPolicyWarnings(warnings);
    return !warnings.some((w) => w.startsWith('❌'));
  }

  // Submit shipping form
  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ok = checkPolicies();
    if (!ok) return;

    const val = parseFloat(formData.declaredValue);
    const needsHighValueDecl =
      (formData.origin === 'UK' && val > 200) ||
      ((formData.origin === 'USA' || formData.origin === 'CHINA') && val > 300);

    if (needsHighValueDecl && !highValueDecl) {
      setFormError('You must check the high-value declaration checkbox.');
      return;
    }

    setFormLoading(true);
    setFormError('');
    try {
      const res = await fetch('/api/shipping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, customerName: verifiedName }),
      });
      const data = await res.json();
      if (data.error) {
        setFormError(data.error);
      } else {
        router.push(`/auth/dashboard?success=shipping&id=${data.id}`);
      }
    } catch {
      setFormError('Failed to submit. Please try again.');
    } finally {
      setFormLoading(false);
    }
  }

  const origins: Origin[] = ['USA', 'UK', 'CHINA'];
  const warehouseAddress = getWarehouseAddress(selectedOrigin, verifiedName || 'YOUR NAME');

  if (checkingAuth) {
    return (
      <PublicLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-4 border-[#0A2540] border-t-transparent rounded-full" />
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="bg-[#0A2540]/80 border-b border-white/10 px-4 py-2">
        <div className="container mx-auto max-w-3xl">
          <Link href="/auth/dashboard" className="inline-flex items-center gap-1.5 text-sm text-slate-300 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>
      <div className="bg-[#0A2540] text-white py-14 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold mb-3">Ship Yourself</h1>
          <p className="text-slate-300">Verify your identity, get your warehouse address, and submit your shipping request</p>
        </div>
      </div>

      <div className="container mx-auto max-w-2xl px-4 py-14">
        {/* Progress */}
        <div className="flex items-center gap-3 mb-10">
          {(['verify', 'address', 'form'] as Step[]).map((s, i) => (
            <div key={s} className="flex items-center gap-3 flex-1">
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0',
                step === s ? 'bg-[#F97316] text-white' :
                ['verify', 'address', 'form'].indexOf(step) > i ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-500'
              )}>
                {['verify', 'address', 'form'].indexOf(step) > i ? '✓' : i + 1}
              </div>
              <span className="text-sm font-medium text-slate-600 hidden sm:block">
                {s === 'verify' ? 'Verify ID' : s === 'address' ? 'Get Address' : 'Submit Request'}
              </span>
              {i < 2 && <div className="flex-1 h-0.5 bg-slate-200" />}
            </div>
          ))}
        </div>

        {/* Step 1: Verify ID */}
        {step === 'verify' && (
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <ShieldCheck className="h-6 w-6 text-[#0A2540]" />
              <h2 className="text-xl font-bold text-[#0A2540]">Identity Verification</h2>
            </div>
            <p className="text-slate-600 text-sm mb-6">
              Nigerian law requires identity verification for international shipping. Your NIN is used for KYC compliance only.
            </p>

            {!useDocFallback ? (
              <form onSubmit={handleVerify} className="space-y-4">
                <div>
                  <Label htmlFor="nin">National Identification Number (NIN)</Label>
                  <Input
                    id="nin"
                    type="text"
                    maxLength={11}
                    placeholder="Enter your 11-digit NIN"
                    value={nin}
                    onChange={(e) => setNin(e.target.value.replace(/\D/g, ''))}
                    className="mt-1"
                  />
                </div>
                {verifyError && (
                  <div className="text-red-600 text-sm flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" /> {verifyError}
                  </div>
                )}
                <Button type="submit" className="w-full" disabled={verifyLoading || nin.length !== 11}>
                  {verifyLoading ? 'Verifying...' : 'Verify NIN'}
                </Button>
                <button
                  type="button"
                  onClick={() => { setUseDocFallback(true); setVerifyError(''); }}
                  className="w-full text-sm text-slate-500 hover:text-[#0A2540] transition-colors"
                >
                  I don&apos;t have my NIN — use ID document instead
                </button>
              </form>
            ) : (
              <form onSubmit={handleDocSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="fullname">Full Name (as on ID)</Label>
                  <Input
                    id="fullname"
                    type="text"
                    placeholder="Your full legal name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="doc">Government ID (JPG, PNG, or PDF)</Label>
                  <input
                    id="doc"
                    type="file"
                    accept="image/*,.pdf"
                    className="mt-1 w-full text-sm file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:bg-[#0A2540] file:text-white hover:file:bg-[#0A2540]/90 file:cursor-pointer"
                    onChange={(e) => setDocFile(e.target.files?.[0] || null)}
                  />
                </div>
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
                  <Info className="h-3 w-3 inline mr-1" />
                  Document submission requires manual review (24–48 hours). Use NIN for instant verification.
                </div>
                {verifyError && <p className="text-red-600 text-sm">{verifyError}</p>}
                <Button type="submit" className="w-full">Submit for Review</Button>
                <button type="button" onClick={() => setUseDocFallback(false)} className="w-full text-sm text-slate-500">
                  Back to NIN verification
                </button>
              </form>
            )}
          </div>
        )}

        {/* Step 2: Address */}
        {step === 'address' && (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
              <div>
                <p className="font-semibold text-green-800">Identity Verified</p>
                <p className="text-sm text-green-600">Welcome, {verifiedName}</p>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <h2 className="text-xl font-bold text-[#0A2540] mb-4">Your Warehouse Address</h2>
              <div className="flex gap-2 mb-4">
                {origins.map((o) => (
                  <button
                    key={o}
                    onClick={() => setSelectedOrigin(o)}
                    className={cn(
                      'flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all border-2',
                      selectedOrigin === o ? 'border-[#0A2540] bg-[#0A2540] text-white' : 'border-slate-200'
                    )}
                  >
                    {o === 'USA' ? '🇺🇸' : o === 'UK' ? '🇬🇧' : '🇨🇳'} {o}
                  </button>
                ))}
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 font-mono text-sm whitespace-pre-line text-slate-700">
                {warehouseAddress}
              </div>
              {selectedOrigin === 'CHINA' && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800">
                  ⚠️ IMPORTANT: +2348029155825 MUST appear on your China shipping label as the shipping mark.
                </div>
              )}
              <div className="flex gap-3 mt-4">
                <Button onClick={handleCopy} variant="outline" className="flex-1">
                  {copied ? <><CheckCircle className="h-4 w-4 mr-2" /> Copied!</> : <><Copy className="h-4 w-4 mr-2" /> Copy Address</>}
                </Button>
                <Button onClick={() => setStep('form')} className="flex-1">
                  Continue to Submit Request →
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Shipping Form */}
        {step === 'form' && (
          <form onSubmit={handleFormSubmit} className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
            <h2 className="text-xl font-bold text-[#0A2540]">Shipping Request Details</h2>

            <div>
              <Label>Shipping Origin</Label>
              <div className="flex gap-2 mt-1">
                {origins.map((o) => (
                  <button
                    key={o}
                    type="button"
                    onClick={() => { setFormData({ ...formData, origin: o }); setPolicyWarnings([]); }}
                    className={cn(
                      'flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all border-2',
                      formData.origin === o ? 'border-[#0A2540] bg-[#0A2540] text-white' : 'border-slate-200'
                    )}
                  >
                    {o === 'USA' ? '🇺🇸' : o === 'UK' ? '🇬🇧' : '🇨🇳'} {o}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="item-name">Item Name / Description *</Label>
                <Input
                  id="item-name"
                  type="text"
                  required
                  placeholder="e.g. Men's Nike Sneakers"
                  value={formData.itemName}
                  onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="tracking">Tracking Number *</Label>
                <Input
                  id="tracking"
                  type="text"
                  required
                  placeholder="Seller's tracking number"
                  value={formData.trackingNumber}
                  onChange={(e) => setFormData({ ...formData, trackingNumber: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="dec-value">Declared Value *</Label>
                <Input
                  id="dec-value"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  placeholder="0.00"
                  value={formData.declaredValue}
                  onChange={(e) => setFormData({ ...formData, declaredValue: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="dec-currency">Currency</Label>
                <select
                  id="dec-currency"
                  value={formData.declaredCurrency}
                  onChange={(e) => setFormData({ ...formData, declaredCurrency: e.target.value })}
                  className="mt-1 w-full h-10 rounded-md border border-input px-3 py-2 text-sm"
                >
                  <option value="USD">USD ($)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="CNY">CNY (¥)</option>
                </select>
              </div>
            </div>

            <div>
              <Label htmlFor="weight">Estimated Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                min="0.1"
                step="0.1"
                placeholder="e.g. 1.5"
                value={formData.weightKg}
                onChange={(e) => setFormData({ ...formData, weightKg: e.target.value })}
                className="mt-1"
              />
              {formData.weightKg && formData.origin && (
                <p className="text-xs text-slate-500 mt-1">
                  Estimated cost: {(() => {
                    const r = calculateShippingCost(formData.origin, parseFloat(formData.weightKg));
                    return `${r.currency === 'GBP' ? '£' : '$'}${r.amount.toFixed(2)} — ${r.note}`;
                  })()}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="delivery">Delivery Address in Nigeria *</Label>
              <textarea
                id="delivery"
                required
                rows={3}
                placeholder="Full delivery address including city and state"
                value={formData.deliveryAddress}
                onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                className="mt-1 w-full rounded-md border border-input px-3 py-2 text-sm"
              />
            </div>

            {/* Policy Warnings */}
            {policyWarnings.map((w, i) => (
              <div key={i} className={cn(
                'p-3 rounded-lg text-sm flex items-start gap-2',
                w.startsWith('❌') ? 'bg-red-50 border border-red-200 text-red-700' : 'bg-amber-50 border border-amber-200 text-amber-700'
              )}>
                <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                {w.replace(/^[❌⚠️] /, '')}
              </div>
            ))}

            {/* High value declaration */}
            {(() => {
              const val = parseFloat(formData.declaredValue);
              const needsDecl = (formData.origin === 'UK' && val > 200) ||
                ((formData.origin === 'USA' || formData.origin === 'CHINA') && val > 300);
              if (!needsDecl) return null;
              return (
                <label className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg cursor-pointer">
                  <input
                    type="checkbox"
                    checked={highValueDecl}
                    onChange={(e) => setHighValueDecl(e.target.checked)}
                    className="mt-0.5"
                  />
                  <span className="text-sm text-amber-800">
                    I confirm that the declared value is accurate and I accept responsibility for any customs duties on this high-value item.
                  </span>
                </label>
              );
            })()}

            {formError && <p className="text-red-600 text-sm">{formError}</p>}

            <div className="flex gap-3">
              <Button type="button" variant="outline" onClick={() => setStep('address')} className="flex-1">
                ← Back
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={formLoading}
                onClick={() => checkPolicies()}
              >
                {formLoading ? 'Submitting...' : 'Submit Shipping Request'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </PublicLayout>
  );
}
