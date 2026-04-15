'use client';

import { useState } from 'react';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { calculateShippingCost, type Origin } from '@/lib/rates';
import { Calculator, Info } from 'lucide-react';

const origins: Origin[] = ['USA', 'UK', 'CHINA'];
const flags: Record<Origin, string> = { USA: '🇺🇸', UK: '🇬🇧', CHINA: '🇨🇳' };

export default function RatesPage() {
  const [origin, setOrigin] = useState<Origin>('USA');
  const [weightKg, setWeightKg] = useState('');
  const [result, setResult] = useState<{ currency: string; amount: number; note: string } | null>(null);

  function handleCalculate() {
    const kg = parseFloat(weightKg);
    if (!kg || kg <= 0) return;
    const r = calculateShippingCost(origin, kg);
    setResult(r);
  }

  return (
    <PublicLayout>
      <div className="bg-[#0A2540] text-white py-14 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold mb-3">Shipping Rates</h1>
          <p className="text-slate-300">Transparent pricing. No hidden fees. Pay only for what you ship.</p>
        </div>
      </div>

      <div className="container mx-auto max-w-5xl px-4 py-14">
        {/* Rate Table */}
        <h2 className="text-2xl font-bold text-[#0A2540] mb-6">Rate Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          {/* USA */}
          <div className="border-2 border-blue-500 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-3">🇺🇸</div>
            <h3 className="text-xl font-bold text-[#0A2540] mb-3">USA</h3>
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b"><td className="py-1.5 text-slate-500">Rate</td><td className="py-1.5 font-semibold text-[#F97316]">$9/lb</td></tr>
                <tr className="border-b"><td className="py-1.5 text-slate-500">Minimum</td><td className="py-1.5 font-semibold">$35 (0–4 lbs)</td></tr>
                <tr><td className="py-1.5 text-slate-500">Currency</td><td className="py-1.5 font-semibold">USD</td></tr>
              </tbody>
            </table>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg text-xs text-blue-800">
              <Info className="h-3 w-3 inline mr-1" />
              All US stores accepted — Amazon, eBay, Walmart, and more.
            </div>
          </div>

          {/* UK */}
          <div className="border-2 border-red-500 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-3">🇬🇧</div>
            <h3 className="text-xl font-bold text-[#0A2540] mb-3">United Kingdom</h3>
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b"><td className="py-1.5 text-slate-500">Rate</td><td className="py-1.5 font-semibold text-[#F97316]">£9/kg</td></tr>
                <tr className="border-b"><td className="py-1.5 text-slate-500">Minimum</td><td className="py-1.5 font-semibold">£45 (5kg min)</td></tr>
                <tr><td className="py-1.5 text-slate-500">Currency</td><td className="py-1.5 font-semibold">GBP</td></tr>
              </tbody>
            </table>
            <div className="mt-4 p-3 bg-amber-50 rounded-lg text-xs text-amber-800">
              <Info className="h-3 w-3 inline mr-1" />
              ⚠️ Gadgets &amp; electronics from UK allowed — receipt &amp; invoice must match your registered account name.
            </div>
          </div>

          {/* China */}
          <div className="border-2 border-yellow-500 rounded-xl p-6 hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-3">🇨🇳</div>
            <h3 className="text-xl font-bold text-[#0A2540] mb-3">China</h3>
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b"><td className="py-1.5 text-slate-500">Rate</td><td className="py-1.5 font-semibold text-[#F97316]">$10/kg</td></tr>
                <tr className="border-b"><td className="py-1.5 text-slate-500">Minimum</td><td className="py-1.5 font-semibold">$100 (10kg min)</td></tr>
                <tr><td className="py-1.5 text-slate-500">Currency</td><td className="py-1.5 font-semibold">USD</td></tr>
              </tbody>
            </table>
            <div className="mt-4 p-3 bg-yellow-50 rounded-lg text-xs text-yellow-800">
              <Info className="h-3 w-3 inline mr-1" />
              Phone number +2348029155825 must appear on China labels.
            </div>
          </div>
        </div>

        {/* Rate Calculator */}
        <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#F97316] rounded-lg flex items-center justify-center">
              <Calculator className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#0A2540]">Interactive Rate Calculator</h2>
              <p className="text-sm text-slate-500">Enter your shipment weight to get an instant estimate</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <Label className="mb-2 block">Shipping Origin</Label>
              <div className="flex gap-2">
                {origins.map((o) => (
                  <button
                    key={o}
                    onClick={() => { setOrigin(o); setResult(null); }}
                    className={`flex-1 py-2 px-3 rounded-md border-2 text-sm font-medium transition-all ${
                      origin === o
                        ? 'border-[#0A2540] bg-[#0A2540] text-white'
                        : 'border-slate-200 hover:border-[#0A2540]'
                    }`}
                  >
                    {flags[o]} {o}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="weight" className="mb-2 block">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                min="0.1"
                step="0.1"
                placeholder="e.g. 2.5"
                value={weightKg}
                onChange={(e) => { setWeightKg(e.target.value); setResult(null); }}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={handleCalculate} className="w-full" size="lg">
                Calculate
              </Button>
            </div>
          </div>

          {result && (
            <div className="bg-[#0A2540] text-white rounded-xl p-6 animate-fade-in">
              <p className="text-slate-400 text-sm mb-1">Estimated Shipping Cost</p>
              <p className="text-4xl font-bold text-[#F97316]">
                {result.currency === 'GBP' ? '£' : '$'}{result.amount.toFixed(2)}
              </p>
              <p className="text-slate-300 text-sm mt-2">{result.note}</p>
              <p className="text-xs text-slate-500 mt-3">
                * Estimate only. Final cost based on actual/dimensional weight, whichever is greater.
                Shipping cost excludes procurement fees if applicable.
              </p>
            </div>
          )}
        </div>

        {/* Additional Notes */}
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 bg-amber-50 border border-amber-200 rounded-xl">
            <h3 className="font-bold text-amber-900 mb-3">Important Notes</h3>
            <ul className="text-sm text-amber-800 space-y-2">
              <li>• Weight is charged at actual or dimensional weight, whichever is greater</li>
              <li>• UK minimum charge is 5kg (£45) even for lighter packages</li>
              <li>• China minimum charge is 10kg ($100) even for lighter packages</li>
              <li>• Declare accurate item values to avoid customs delays</li>
              <li>• Items over £200 (UK) or $300 (USA/China) require a declaration</li>
            </ul>
          </div>
          <div className="p-6 bg-blue-50 border border-blue-200 rounded-xl">
            <h3 className="font-bold text-blue-900 mb-3">Delivery Timeframes</h3>
            <ul className="text-sm text-blue-800 space-y-2">
              <li>• <strong>USA:</strong> 7–14 business days from warehouse receipt</li>
              <li>• <strong>UK:</strong> 7–14 business days from warehouse receipt</li>
              <li>• <strong>China:</strong> 14–21 business days from warehouse receipt</li>
              <li>• Timeframes are estimates and may vary with customs</li>
              <li>• Express options available on request via WhatsApp</li>
            </ul>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
