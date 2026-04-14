'use client';

import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabaseBrowser } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle } from 'lucide-react';

export default function AdminSettings() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = supabaseBrowser();
      const { data } = await supabase.from('settings').select('*');
      const map: Record<string, string> = {};
      (data || []).forEach((row: { key: string; value: string }) => { map[row.key] = row.value; });
      setSettings(map);
      setLoading(false);
    }
    load();
  }, []);

  async function handleSave() {
    setSaving(true);
    const supabase = supabaseBrowser();
    const upserts = Object.entries(settings).map(([key, value]) => ({ key, value }));
    await supabase.from('settings').upsert(upserts);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  function set(key: string, value: string) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

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
            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
              <h2 className="font-semibold text-[#0A2540]">Business Information</h2>
              <div>
                <Label>WhatsApp Number</Label>
                <Input
                  value={settings.whatsapp || '2348029155825'}
                  onChange={(e) => set('whatsapp', e.target.value)}
                  className="mt-1"
                  placeholder="2348029155825"
                />
              </div>
              <div>
                <Label>Admin Email</Label>
                <Input
                  value={settings.admin_email || 'admin@buyandshiptonigeria.com'}
                  onChange={(e) => set('admin_email', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Business Hours</Label>
                <Input
                  value={settings.business_hours || 'Mon–Fri, 9am–5pm WAT'}
                  onChange={(e) => set('business_hours', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
              <h2 className="font-semibold text-[#0A2540]">Shipping Rates</h2>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>USA Rate ($/lb)</Label>
                  <Input
                    type="number"
                    value={settings.usa_rate_per_lb || '9'}
                    onChange={(e) => set('usa_rate_per_lb', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>UK Rate (£/kg)</Label>
                  <Input
                    type="number"
                    value={settings.uk_rate_per_kg || '9'}
                    onChange={(e) => set('uk_rate_per_kg', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>China Rate ($/kg)</Label>
                  <Input
                    type="number"
                    value={settings.china_rate_per_kg || '10'}
                    onChange={(e) => set('china_rate_per_kg', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
              <h2 className="font-semibold text-[#0A2540]">Notifications</h2>
              <div>
                <Label>Maintenance Mode Message</Label>
                <textarea
                  rows={3}
                  value={settings.maintenance_message || ''}
                  onChange={(e) => set('maintenance_message', e.target.value)}
                  className="mt-1 w-full rounded-md border border-input px-3 py-2 text-sm"
                  placeholder="Leave empty to disable maintenance mode"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button onClick={handleSave} disabled={saving} size="lg">
                {saving ? 'Saving...' : 'Save Settings'}
              </Button>
              {saved && (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm">Settings saved!</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
