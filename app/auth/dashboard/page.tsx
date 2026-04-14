'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabaseBrowser } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Package, Plus, LogOut, Copy, CheckCircle, User, Bell,
} from 'lucide-react';
import { cn, STATUS_LABELS, PROCUREMENT_STATUS_LABELS } from '@/lib/utils';
import { formatDate } from '@/lib/utils';
import { getWarehouseAddress, type Origin } from '@/lib/rates';

interface CustomerProfile {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  nin_verified: boolean;
}

interface ShippingRequest {
  id: string;
  origin: string;
  item_name: string;
  tracking_number: string;
  status: string;
  payment_status: string;
  estimated_cost: number;
  estimated_currency: string;
  created_at: string;
}

interface ProcurementRequest {
  id: string;
  origin: string;
  status: string;
  payment_status: string;
  total_estimate: number;
  created_at: string;
}

function CustomerDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [shippingRequests, setShippingRequests] = useState<ShippingRequest[]>([]);
  const [procurements, setProcurements] = useState<ProcurementRequest[]>([]);
  const [activeTab, setActiveTab] = useState<'shipping' | 'procurement' | 'addresses'>('shipping');
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<Origin | null>(null);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    const success = searchParams.get('success');
    if (success === 'shipping') setSuccessMsg('Shipping request submitted successfully!');
    if (success === 'procurement') setSuccessMsg('Procurement request submitted successfully!');

    async function load() {
      const supabase = supabaseBrowser();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/auth/login'); return; }

      const [profileRes, shippingRes, procurementRes] = await Promise.all([
        supabase.from('customers').select('*').eq('id', user.id).single(),
        supabase.from('shipping_requests').select('*').eq('customer_id', user.id).order('created_at', { ascending: false }),
        supabase.from('procurement_requests').select('*').eq('customer_id', user.id).order('created_at', { ascending: false }),
      ]);

      setProfile(profileRes.data);
      setShippingRequests(shippingRes.data || []);
      setProcurements(procurementRes.data || []);
      setLoading(false);
    }
    load();
  }, [router, searchParams]);

  async function handleLogout() {
    const supabase = supabaseBrowser();
    await supabase.auth.signOut();
    router.push('/');
  }

  function handleCopy(origin: Origin) {
    if (!profile) return;
    const addr = getWarehouseAddress(origin, profile.full_name);
    navigator.clipboard.writeText(addr);
    setCopied(origin);
    setTimeout(() => setCopied(null), 2000);
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#0A2540] border-t-transparent rounded-full" />
      </div>
    );
  }

  const origins: Origin[] = ['USA', 'UK', 'CHINA'];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-[#0A2540] text-white px-4 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Package className="h-6 w-6 text-[#F97316]" />
            <span className="font-bold">BuyandShip<span className="text-[#F97316]">Nigeria</span></span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-slate-300 text-sm hidden sm:block">{profile?.full_name}</span>
            <button onClick={handleLogout} className="flex items-center gap-1 text-slate-300 hover:text-white text-sm">
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Success banner */}
        {successMsg && (
          <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-xl mb-6">
            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
            <p className="text-green-800 font-medium">{successMsg}</p>
          </div>
        )}

        {/* Profile Summary */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 mb-6">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#0A2540] rounded-full flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-bold text-[#0A2540] text-lg">{profile?.full_name}</p>
                <p className="text-slate-500 text-sm">{profile?.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {profile?.nin_verified ? (
                <Badge variant="success" className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" /> ID Verified
                </Badge>
              ) : (
                <Badge variant="warning">ID Pending</Badge>
              )}
              <Link href="/ship-yourself">
                <Button size="sm" variant="accent">
                  <Plus className="h-4 w-4 mr-1" /> New Request
                </Button>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-slate-100">
            <div className="text-center">
              <p className="text-2xl font-bold text-[#0A2540]">{shippingRequests.length}</p>
              <p className="text-xs text-slate-500">Shipments</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-[#0A2540]">{procurements.length}</p>
              <p className="text-xs text-slate-500">Procurements</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {shippingRequests.filter((r) => r.status === 'delivered').length}
              </p>
              <p className="text-xs text-slate-500">Delivered</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-xl p-1 border border-slate-200 mb-6 w-fit">
          {(['shipping', 'procurement', 'addresses'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                activeTab === tab ? 'bg-[#0A2540] text-white' : 'text-slate-600 hover:text-[#0A2540]'
              )}
            >
              {tab === 'shipping' ? 'Shipments' : tab === 'procurement' ? 'Procurement' : 'Warehouse Addresses'}
            </button>
          ))}
        </div>

        {/* Shipping Tab */}
        {activeTab === 'shipping' && (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <h2 className="font-semibold text-[#0A2540]">Shipping Requests</h2>
              <Link href="/ship-yourself">
                <Button size="sm" variant="accent"><Plus className="h-4 w-4 mr-1" /> New</Button>
              </Link>
            </div>
            {shippingRequests.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <Package className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p>No shipping requests yet</p>
                <Link href="/ship-yourself"><Button size="sm" className="mt-3">Submit your first request</Button></Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3 text-left">Item</th>
                      <th className="px-4 py-3 text-left">Origin</th>
                      <th className="px-4 py-3 text-left">Status</th>
                      <th className="px-4 py-3 text-left">Payment</th>
                      <th className="px-4 py-3 text-left">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {shippingRequests.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3">
                          <p className="font-medium text-[#0A2540] text-sm">{r.item_name}</p>
                          <p className="text-xs text-slate-400">{r.tracking_number}</p>
                        </td>
                        <td className="px-4 py-3 text-sm">{r.origin}</td>
                        <td className="px-4 py-3">
                          <span className={cn('text-xs px-2 py-1 rounded-full font-medium',
                            r.status === 'delivered' ? 'bg-green-100 text-green-700' :
                            r.status === 'in_transit' ? 'bg-blue-100 text-blue-700' :
                            'bg-yellow-100 text-yellow-700'
                          )}>
                            {STATUS_LABELS[r.status] || r.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={cn('text-xs px-2 py-1 rounded-full font-medium',
                            r.payment_status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          )}>
                            {r.payment_status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-400">{formatDate(r.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Procurement Tab */}
        {activeTab === 'procurement' && (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <h2 className="font-semibold text-[#0A2540]">Procurement Requests</h2>
              <Link href="/procure">
                <Button size="sm" variant="accent"><Plus className="h-4 w-4 mr-1" /> New</Button>
              </Link>
            </div>
            {procurements.length === 0 ? (
              <div className="text-center py-12 text-slate-400">
                <Package className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p>No procurement requests yet</p>
                <Link href="/procure"><Button size="sm" className="mt-3">Request procurement</Button></Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3 text-left">Request ID</th>
                      <th className="px-4 py-3 text-left">Origin</th>
                      <th className="px-4 py-3 text-left">Status</th>
                      <th className="px-4 py-3 text-left">Total</th>
                      <th className="px-4 py-3 text-left">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {procurements.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-mono text-xs text-slate-500">{r.id.substring(0, 8)}...</td>
                        <td className="px-4 py-3 text-sm">{r.origin}</td>
                        <td className="px-4 py-3">
                          <span className="text-xs px-2 py-1 rounded-full font-medium bg-blue-100 text-blue-700">
                            {PROCUREMENT_STATUS_LABELS[r.status] || r.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm font-medium text-[#0A2540]">
                          {r.total_estimate ? `$${r.total_estimate.toFixed(2)}` : 'TBD'}
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-400">{formatDate(r.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Addresses Tab */}
        {activeTab === 'addresses' && profile && (
          <div className="space-y-4">
            {origins.map((origin) => (
              <div key={origin} className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-[#0A2540] flex items-center gap-2">
                    {origin === 'USA' ? '🇺🇸' : origin === 'UK' ? '🇬🇧' : '🇨🇳'} {origin} Warehouse
                  </h3>
                  <button
                    onClick={() => handleCopy(origin)}
                    className="flex items-center gap-1 text-sm text-[#F97316] hover:underline"
                  >
                    {copied === origin ? <><CheckCircle className="h-4 w-4" /> Copied!</> : <><Copy className="h-4 w-4" /> Copy</>}
                  </button>
                </div>
                <div className="bg-slate-50 rounded-lg p-4 font-mono text-sm whitespace-pre-line text-slate-700">
                  {getWarehouseAddress(origin, profile.full_name)}
                </div>
                {origin === 'CHINA' && (
                  <p className="mt-2 text-xs text-red-600 font-medium">
                    ⚠️ +2348029155825 MUST appear on your China shipping label
                  </p>
                )}
                {origin === 'UK' && (
                  <p className="mt-2 text-xs text-amber-600 font-medium">
                    ⚠️ No gadgets/electronics allowed from UK
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function CustomerDashboard() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#0A2540] border-t-transparent rounded-full" />
      </div>
    }>
      <CustomerDashboardContent />
    </Suspense>
  );
}
