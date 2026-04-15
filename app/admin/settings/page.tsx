'use client';

import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle, AlertCircle } from 'lucide-react';

export default function AdminSettings() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function load() {
      const res = await fetch('/api/admin/settings');
      const data = await res.json();
      if (data.settings) setSettings(data.settings);
      setLoading(false);
    }
    load();
  }, []);

  async function handleSave() {
    setSaving(true);
    setError('');
    setSaved(false);
    const res = await fetch('/api/admin/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ settings }),
    });
    const data = await res.json();
    if (data.error) {
      setError(data.error);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 4000);
    }
    setSaving(false);
  }

  function set(key: string, value: string) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  const val = (key: string, fallback: string) => settings[key] ?? fallback;

  return (
    <AdminLayout>
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold text-[#0A2540] mb-6">Settings</h1>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin w-6 h-6 border-4 border-[#0A2540] border-t-transparent rounded-full" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Business Info */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
              <h2 className="font-semibold text-[#0A2540]">Business Information</h2>
              <div>
                <Label>WhatsApp Number</Label>
                <Input
                  value={val('whatsapp', '2348029155825')}
                  onChange={(e) => set('whatsapp', e.target.value)}
                  className="mt-1"
                  placeholder="2348029155825"
                />
              </div>
              <div>
                <Label>Admin Email</Label>
                <Input
                  value={val('admin_email', 'admin@buyandshiptonigeria.com')}
                  onChange={(e) => set('admin_email', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Business Hours</Label>
                <Input
                  value={val('business_hours', 'Mon–Fri, 9am–5pm WAT')}
                  onChange={(e) => set('business_hours', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            {/* Shipping Rates */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
              <h2 className="font-semibold text-[#0A2540]">Shipping Rates</h2>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>USA Rate ($/lb)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={val('usa_rate_per_lb', '9')}
                    onChange={(e) => set('usa_rate_per_lb', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>UK Rate (£/kg)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={val('uk_rate_per_kg', '9')}
                    onChange={(e) => set('uk_rate_per_kg', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>China Rate ($/kg)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={val('china_rate_per_kg', '10')}
                    onChange={(e) => set('china_rate_per_kg', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            {/* Exchange Rates */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
              <h2 className="font-semibold text-[#0A2540]">Payment &amp; Exchange Rates</h2>
              <p className="text-sm text-slate-500">
                Paystack charges in Nigerian Naira (NGN). Set the exchange rates used to convert foreign currency costs before charging customers.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>USD → NGN Rate</Label>
                  <div className="relative mt-1">
                    <Input
                      type="number"
                      step="1"
                      value={val('usd_to_ngn', '1600')}
                      onChange={(e) => set('usd_to_ngn', e.target.value)}
                      placeholder="1600"
                      className="pr-16"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">₦ per $1</span>
                  </div>
                </div>
                <div>
                  <Label>GBP → NGN Rate</Label>
                  <div className="relative mt-1">
                    <Input
                      type="number"
                      step="1"
                      value={val('gbp_to_ngn', '2050')}
                      onChange={(e) => set('gbp_to_ngn', e.target.value)}
                      placeholder="2050"
                      className="pr-16"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">₦ per £1</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Notifications */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
              <h2 className="font-semibold text-[#0A2540]">Notifications</h2>
              <div>
                <Label>Maintenance Mode Message</Label>
                <textarea
                  rows={3}
                  value={val('maintenance_message', '')}
                  onChange={(e) => set('maintenance_message', e.target.value)}
                  className="mt-1 w-full rounded-md border border-input px-3 py-2 text-sm"
                  placeholder="Leave empty to disable maintenance mode"
                />
              </div>
            </div>

            {/* Save */}
            <div className="flex items-center gap-4">
              <Button onClick={handleSave} disabled={saving} size="lg">
                {saving ? 'Saving...' : 'Save Settings'}
              </Button>
              {saved && (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">Settings saved successfully!</span>
                </div>
              )}
              {error && (
                <div className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">{error}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
