'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, ArrowLeft, ShieldCheck, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Origin } from '@/lib/rates';
import { supabaseBrowser } from '@/lib/supabase';

interface ProductLink {
  url: string;
  description: string;
  quantity: number;
  estimatedPrice: number;
  currency: string;
  notes: string;
}

const EMPTY_PRODUCT = (): ProductLink => ({
  url: '', description: '', quantity: 1, estimatedPrice: 0, currency: 'USD', notes: '',
});

type VerifyStep = 'verify' | 'form';

export default function ProcurePage() {
  const router = useRouter();

  const [verifyStep, setVerifyStep] = useState<VerifyStep>('verify');
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [verifiedName, setVerifiedName] = useState('');

  // NIN gate state
  const [nin, setNin] = useState('');
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyError, setVerifyError] = useState('');
  const [useDocFallback, setUseDocFallback] = useState(false);
  const [docFullName, setDocFullName] = useState('');

  const [origin, setOrigin] = useState<Origin>('USA');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [products, setProducts] = useState<ProductLink[]>([EMPTY_PRODUCT()]);
  const [generalNotes, setGeneralNotes] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  // On mount: check if user is authenticated and NIN-verified — skip verify step
  useEffect(() => {
    async function checkVerified() {
      const supabase = supabaseBrowser();
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        window.location.href = '/auth/login?redirect=/procure';
        return;
      }
      const { data: profile } = await supabase
        .from('customers')
        .select('full_name, nin_verified')
        .eq('id', session.user.id)
        .single();

      if (profile?.nin_verified) {
        const name = profile.full_name ||
          (session.user.user_metadata?.full_name as string) || '';
        setVerifiedName(name);
        setVerifyStep('form');
      }
      setCheckingAuth(false);
    }
    checkVerified();
  }, []);

  async function handleNinVerify(e: React.FormEvent) {
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
        setVerifyStep('form');
      } else {
        setVerifyError(data.error || 'Verification failed');
      }
    } catch {
      setVerifyError('Verification service unavailable. Please try the document upload option.');
    } finally {
      setVerifyLoading(false);
    }
  }

  async function handleDocSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!docFullName.trim()) { setVerifyError('Please enter your full name.'); return; }
    setVerifiedName(docFullName);
    setVerifyStep('form');
  }

  const subtotal = products.reduce((sum, p) => sum + (p.estimatedPrice || 0) * (p.quantity || 1), 0);
  const procurementFee = subtotal * 0.05;
  const total = subtotal + procurementFee;
  const symbol = products[0]?.currency === 'GBP' ? '£' : '$';

  function addProduct() {
    if (products.length >= 10) return;
    setProducts([...products, EMPTY_PRODUCT()]);
  }

  function removeProduct(i: number) {
    setProducts(products.filter((_, idx) => idx !== i));
  }

  function updateProduct(i: number, field: keyof ProductLink, value: string | number) {
    const updated = [...products];
    (updated[i] as unknown as Record<string, string | number>)[field] = value;
    setProducts(updated);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validProducts = products.filter((p) => p.url.trim());
    if (validProducts.length === 0) {
      setFormError('Please add at least one product link.');
      return;
    }
    setFormLoading(true);
    setFormError('');
    try {
      const res = await fetch('/api/procurement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          origin,
          deliveryAddress,
          productLinks: validProducts,
          notes: generalNotes,
        }),
      });
      const data = await res.json();
      if (data.error) {
        setFormError(data.error);
      } else {
        router.push(`/auth/dashboard?success=procurement&id=${data.id}`);
      }
    } catch {
      setFormError('Failed to submit. Please try again.');
    } finally {
      setFormLoading(false);
    }
  }

  const origins: Origin[] = ['USA', 'UK', 'CHINA'];

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
          <h1 className="text-4xl font-bold mb-3">Procurement Service</h1>
          <p className="text-slate-300">
            Can&apos;t ship to our warehouse yourself? We&apos;ll buy it for you — just 5% fee.
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-2xl px-4 py-14">

        {/* NIN Verification Gate */}
        {verifyStep === 'verify' && (
          <div className="bg-white border border-slate-200 rounded-xl p-6 mb-8">
            <div className="flex items-center gap-3 mb-5">
              <ShieldCheck className="h-6 w-6 text-[#0A2540]" />
              <h2 className="text-xl font-bold text-[#0A2540]">Identity Verification Required</h2>
            </div>
            <p className="text-slate-600 text-sm mb-6">
              You must verify your identity before submitting a procurement request. Your NIN is used for KYC compliance only.
            </p>

            {!useDocFallback ? (
              <form onSubmit={handleNinVerify} className="space-y-4">
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
                  <Label htmlFor="doc-name">Full Name (as on ID)</Label>
                  <Input
                    id="doc-name"
                    type="text"
                    placeholder="Your full legal name"
                    value={docFullName}
                    onChange={(e) => setDocFullName(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
                  <Info className="h-3 w-3 inline mr-1" />
                  Document submission requires manual review (24–48 hours). Use NIN for instant verification.
                </div>
                {verifyError && <p className="text-red-600 text-sm">{verifyError}</p>}
                <Button type="submit" className="w-full">Proceed with Document Review</Button>
                <button type="button" onClick={() => setUseDocFallback(false)} className="w-full text-sm text-slate-500">
                  Back to NIN verification
                </button>
              </form>
            )}
          </div>
        )}

        {verifyStep === 'form' && (
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Origin */}
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <Label className="text-base font-semibold text-[#0A2540]">Where should we buy from?</Label>
            <div className="flex gap-2 mt-3">
              {origins.map((o) => (
                <button
                  key={o}
                  type="button"
                  onClick={() => setOrigin(o)}
                  className={cn(
                    'flex-1 py-2.5 px-3 rounded-md text-sm font-medium border-2 transition-all',
                    origin === o ? 'border-[#0A2540] bg-[#0A2540] text-white' : 'border-slate-200 hover:border-slate-300'
                  )}
                >
                  {o === 'USA' ? '🇺🇸' : o === 'UK' ? '🇬🇧' : '🇨🇳'} {o}
                </button>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-[#0A2540]">Products ({products.length}/10)</h2>
              {products.length < 10 && (
                <button type="button" onClick={addProduct}
                  className="flex items-center gap-1 text-sm text-[#F97316] font-medium hover:underline">
                  <Plus className="h-4 w-4" /> Add another item
                </button>
              )}
            </div>

            {products.map((p, i) => (
              <div key={i} className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-[#0A2540]">Item {i + 1}</span>
                  {products.length > 1 && (
                    <button type="button" onClick={() => removeProduct(i)}
                      className="text-red-400 hover:text-red-600 p-1">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div>
                  <Label htmlFor={`url-${i}`}>Product URL *</Label>
                  <Input
                    id={`url-${i}`}
                    type="url"
                    required
                    placeholder="https://amazon.com/dp/..."
                    value={p.url}
                    onChange={(e) => updateProduct(i, 'url', e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor={`desc-${i}`}>Colour / Size / Variant</Label>
                    <Input
                      id={`desc-${i}`}
                      type="text"
                      placeholder="e.g. Black, Size 42"
                      value={p.description}
                      onChange={(e) => updateProduct(i, 'description', e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`qty-${i}`}>Quantity</Label>
                    <Input
                      id={`qty-${i}`}
                      type="number"
                      min="1"
                      value={p.quantity}
                      onChange={(e) => updateProduct(i, 'quantity', parseInt(e.target.value) || 1)}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor={`price-${i}`}>Estimated Price</Label>
                    <Input
                      id={`price-${i}`}
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={p.estimatedPrice || ''}
                      onChange={(e) => updateProduct(i, 'estimatedPrice', parseFloat(e.target.value) || 0)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`cur-${i}`}>Currency</Label>
                    <select
                      id={`cur-${i}`}
                      value={p.currency}
                      onChange={(e) => updateProduct(i, 'currency', e.target.value)}
                      className="mt-1 w-full h-10 rounded-md border border-input px-3 py-2 text-sm"
                    >
                      <option value="USD">USD ($)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="CNY">CNY (¥)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <Label htmlFor={`notes-${i}`}>Special Instructions for this item</Label>
                  <Input
                    id={`notes-${i}`}
                    type="text"
                    placeholder="Any specific requirements for this item"
                    value={p.notes}
                    onChange={(e) => updateProduct(i, 'notes', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            ))}

            {/* Cost preview */}
            {subtotal > 0 && (
              <div className="bg-[#0A2540] text-white rounded-xl p-4 mt-2">
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-300">Items Subtotal</span>
                    <span>{symbol}{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Procurement Fee (5%)</span>
                    <span className="text-[#F97316]">{symbol}{procurementFee.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-white/20 pt-2 flex justify-between font-bold">
                    <span>Estimated Total</span>
                    <span className="text-[#F97316]">{symbol}{total.toFixed(2)}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  * Estimate only. Shipping cost added separately. Final total confirmed by our team.
                </p>
              </div>
            )}
          </div>

          {/* Delivery + General notes */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
            <div>
              <Label htmlFor="delivery">Delivery Address in Nigeria *</Label>
              <textarea
                id="delivery"
                required
                rows={3}
                placeholder="Full delivery address including city and state"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                className="mt-1 w-full rounded-md border border-input px-3 py-2 text-sm"
              />
            </div>
            <div>
              <Label htmlFor="general-notes">General Instructions (optional)</Label>
              <textarea
                id="general-notes"
                rows={2}
                placeholder="Any other instructions for the whole order"
                value={generalNotes}
                onChange={(e) => setGeneralNotes(e.target.value)}
                className="mt-1 w-full rounded-md border border-input px-3 py-2 text-sm"
              />
            </div>
          </div>

          {formError && <p className="text-red-600 text-sm px-1">{formError}</p>}

          <Button type="submit" className="w-full" size="lg" disabled={formLoading}>
            {formLoading ? 'Submitting...' : 'Submit Procurement Request'}
          </Button>

          <p className="text-xs text-slate-500 text-center pb-4">
            Our team reviews your request within 24 hours and sends a confirmed cost to your dashboard for payment.
          </p>
        </form>
        )}

      </div>
    </PublicLayout>
  );
}
