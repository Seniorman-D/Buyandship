'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ShieldCheck, Plus, Trash2, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Origin } from '@/lib/rates';

type Step = 'verify' | 'form';

interface ProductLink {
  url: string;
  description: string;
  quantity: number;
  estimatedPrice: number;
  currency: string;
}

export default function ProcurePage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>('verify');

  // Verify
  const [nin, setNin] = useState('');
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [verifyError, setVerifyError] = useState('');
  const [verifiedName, setVerifiedName] = useState('');
  const [useDocFallback, setUseDocFallback] = useState(false);
  const [fullName, setFullName] = useState('');

  // Form
  const [origin, setOrigin] = useState<Origin>('USA');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [products, setProducts] = useState<ProductLink[]>([
    { url: '', description: '', quantity: 1, estimatedPrice: 0, currency: 'USD' },
  ]);
  const [notes, setNotes] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const subtotal = products.reduce((sum, p) => sum + p.estimatedPrice * p.quantity, 0);
  const procurementFee = subtotal * 0.05;
  const total = subtotal + procurementFee;
  const currency = products[0]?.currency || 'USD';
  const symbol = currency === 'GBP' ? '£' : '$';

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
        setStep('form');
      } else {
        setVerifyError(data.error || 'Verification failed');
      }
    } catch {
      setVerifyError('Verification service unavailable. Please try the document option.');
    } finally {
      setVerifyLoading(false);
    }
  }

  function addProduct() {
    if (products.length >= 10) return;
    setProducts([...products, { url: '', description: '', quantity: 1, estimatedPrice: 0, currency }]);
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
          notes,
          customerName: verifiedName,
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

  return (
    <PublicLayout>
      <div className="bg-[#0A2540] text-white py-14 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold mb-3">Procurement Service</h1>
          <p className="text-slate-300">
            Can&apos;t ship to our warehouse yourself? We&apos;ll buy it for you — just 5% fee.
          </p>
        </div>
      </div>

      <div className="container mx-auto max-w-2xl px-4 py-14">
        {/* Step 1: Verify */}
        {step === 'verify' && (
          <div className="bg-white border border-slate-200 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-5">
              <ShieldCheck className="h-6 w-6 text-[#0A2540]" />
              <h2 className="text-xl font-bold text-[#0A2540]">Identity Verification</h2>
            </div>
            {!useDocFallback ? (
              <form onSubmit={handleVerify} className="space-y-4">
                <div>
                  <Label htmlFor="nin">National Identification Number (NIN)</Label>
                  <Input
                    id="nin"
                    type="text"
                    maxLength={11}
                    placeholder="11-digit NIN"
                    value={nin}
                    onChange={(e) => setNin(e.target.value.replace(/\D/g, ''))}
                    className="mt-1"
                  />
                </div>
                {verifyError && (
                  <p className="text-red-600 text-sm flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" /> {verifyError}
                  </p>
                )}
                <Button type="submit" className="w-full" disabled={verifyLoading || nin.length !== 11}>
                  {verifyLoading ? 'Verifying...' : 'Verify NIN'}
                </Button>
                <button
                  type="button"
                  onClick={() => { setUseDocFallback(true); setVerifyError(''); }}
                  className="w-full text-sm text-slate-500 hover:text-[#0A2540]"
                >
                  Use ID document instead
                </button>
              </form>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setVerifiedName(fullName); setStep('form'); }} className="space-y-4">
                <div>
                  <Label htmlFor="fullname">Full Name (as on ID)</Label>
                  <Input
                    id="fullname"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your legal name"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Government ID</Label>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    className="mt-1 w-full text-sm file:mr-3 file:py-2 file:px-3 file:rounded-md file:border-0 file:bg-[#0A2540] file:text-white"
                  />
                </div>
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
                  <Info className="h-3 w-3 inline mr-1" />
                  Manual review takes 24–48 hours.
                </div>
                <Button type="submit" className="w-full" disabled={!fullName.trim()}>Submit for Review</Button>
                <button type="button" onClick={() => setUseDocFallback(false)} className="w-full text-sm text-slate-500">
                  Back to NIN
                </button>
              </form>
            )}
          </div>
        )}

        {/* Step 2: Procurement Form */}
        {step === 'form' && (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
              <div>
                <p className="font-semibold text-green-800">Identity Verified</p>
                <p className="text-sm text-green-600">Welcome, {verifiedName}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-xl p-6 space-y-6">
              <h2 className="text-xl font-bold text-[#0A2540]">Product Details</h2>

              {/* Origin */}
              <div>
                <Label>Where should we buy from?</Label>
                <div className="flex gap-2 mt-1">
                  {origins.map((o) => (
                    <button
                      key={o}
                      type="button"
                      onClick={() => setOrigin(o)}
                      className={cn(
                        'flex-1 py-2 px-3 rounded-md text-sm font-medium border-2 transition-all',
                        origin === o ? 'border-[#0A2540] bg-[#0A2540] text-white' : 'border-slate-200'
                      )}
                    >
                      {o === 'USA' ? '🇺🇸' : o === 'UK' ? '🇬🇧' : '🇨🇳'} {o}
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Links */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Product Links ({products.length}/10)</Label>
                  {products.length < 10 && (
                    <button type="button" onClick={addProduct} className="flex items-center gap-1 text-sm text-[#F97316] font-medium hover:underline">
                      <Plus className="h-4 w-4" /> Add item
                    </button>
                  )}
                </div>

                {products.map((p, i) => (
                  <div key={i} className="p-4 bg-slate-50 rounded-lg border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700">Item {i + 1}</span>
                      {products.length > 1 && (
                        <button type="button" onClick={() => removeProduct(i)} className="text-red-400 hover:text-red-600">
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
                        placeholder="https://amazon.com/..."
                        value={p.url}
                        onChange={(e) => updateProduct(i, 'url', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor={`desc-${i}`}>Description</Label>
                        <Input
                          id={`desc-${i}`}
                          type="text"
                          placeholder="e.g. Size 42, Black"
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
                  </div>
                ))}
              </div>

              {/* Live Cost Preview */}
              {subtotal > 0 && (
                <div className="bg-[#0A2540] text-white rounded-xl p-5">
                  <h3 className="font-semibold mb-3">Cost Estimate Preview</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-300">Products Subtotal</span>
                      <span>{symbol}{subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-300">Procurement Fee (5%)</span>
                      <span className="text-[#F97316]">{symbol}{procurementFee.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-white/20 pt-2 flex justify-between font-bold">
                      <span>Estimated Total</span>
                      <span className="text-[#F97316] text-lg">{symbol}{total.toFixed(2)}</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 mt-3">
                    * Shipping cost invoiced separately after item weighing. Final procurement cost confirmed by our team.
                  </p>
                </div>
              )}

              {/* Delivery */}
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

              {/* Notes */}
              <div>
                <Label htmlFor="notes">Additional Notes</Label>
                <textarea
                  id="notes"
                  rows={2}
                  placeholder="Specific colour, size, variant, or any special instructions"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="mt-1 w-full rounded-md border border-input px-3 py-2 text-sm"
                />
              </div>

              {formError && <p className="text-red-600 text-sm">{formError}</p>}

              <Button type="submit" className="w-full" size="lg" disabled={formLoading}>
                {formLoading ? 'Submitting...' : 'Submit Procurement Request'}
              </Button>

              <p className="text-xs text-slate-500 text-center">
                Our team will review your request and send a cost estimate within 24 hours.
              </p>
            </form>
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
