'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabaseBrowser } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import {
  Package, Plus, LogOut, Copy, CheckCircle, User, Edit2, KeyRound, Eye, EyeOff,
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
  const [activeTab, setActiveTab] = useState<'shipping' | 'procurement' | 'addresses' | 'profile'>('shipping');
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState<Origin | null>(null);
  const [successMsg, setSuccessMsg] = useState('');

  // Profile editing
  const [editProfile, setEditProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ full_name: '', phone: '' });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');

  // Password change
  const [pwForm, setPwForm] = useState({ current: '', next: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const [pwSaving, setPwSaving] = useState(false);
  const [pwMsg, setPwMsg] = useState('');

  // Success banner — reacts to URL query params independently
  useEffect(() => {
    const success = searchParams.get('success');
    if (success === 'shipping') setSuccessMsg('Shipping request submitted successfully!');
    if (success === 'procurement') setSuccessMsg('Procurement request submitted successfully!');
  }, [searchParams]);

  // Auth check + data loading — runs ONCE on mount only
  useEffect(() => {
    const supabase = supabaseBrowser();
    let isMounted = true;

    async function load() {
      // getSession() reads from cookies — no network call, never returns null mid-refresh
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/auth/login');
        return;
      }

      const user = session.user;
      const [profileRes, shippingRes, procurementRes] = await Promise.all([
        supabase.from('customers').select('*').eq('id', user.id).single(),
        supabase.from('shipping_requests').select('*').eq('customer_id', user.id).order('created_at', { ascending: false }),
        supabase.from('procurement_requests').select('*').eq('customer_id', user.id).order('created_at', { ascending: false }),
      ]);

      if (!isMounted) return;

      // Fallback to auth metadata when the customers row doesn't exist yet
      // (e.g. users who registered before the profile-save fix)
      const profileData: CustomerProfile = profileRes.data ?? {
        id: user.id,
        full_name: (user.user_metadata?.full_name as string) || user.email || 'User',
        email: user.email || '',
        phone: (user.user_metadata?.phone as string) || '',
        nin_verified: false,
      };

      setProfile(profileData);
      setShippingRequests(shippingRes.data || []);
      setProcurements(procurementRes.data || []);
      setLoading(false);
    }

    load();

    // Only redirect on an explicit sign-out — not on token refresh
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isMounted) return;
      if (event === 'SIGNED_OUT' && !session) {
        router.push('/auth/login');
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  function validateNgPhone(p: string) {
    return /^(0[7-9][01]\d{8}|\+234[7-9][01]\d{8})$/.test(p.replace(/\s/g, ''));
  }

  async function handleProfileSave() {
    if (!profileForm.full_name.trim()) { setProfileMsg('Name cannot be empty.'); return; }
    if (profileForm.phone && !validateNgPhone(profileForm.phone)) {
      setProfileMsg('Enter a valid Nigerian phone number (e.g. 08012345678).');
      return;
    }
    setProfileSaving(true);
    setProfileMsg('');
    const supabase = supabaseBrowser();
    const { error } = await supabase
      .from('customers')
      .update({ full_name: profileForm.full_name.trim(), phone: profileForm.phone.trim() || null })
      .eq('id', profile!.id);
    if (error) {
      setProfileMsg('Failed to save. Please try again.');
    } else {
      setProfile((p) => p ? { ...p, full_name: profileForm.full_name.trim(), phone: profileForm.phone.trim() } : p);
      setEditProfile(false);
      setProfileMsg('Profile updated successfully.');
      setTimeout(() => setProfileMsg(''), 4000);
    }
    setProfileSaving(false);
  }

  async function handlePasswordChange() {
    if (pwForm.next.length < 8) { setPwMsg('New password must be at least 8 characters.'); return; }
    if (pwForm.next !== pwForm.confirm) { setPwMsg('Passwords do not match.'); return; }
    setPwSaving(true);
    setPwMsg('');
    const supabase = supabaseBrowser();
    const { error } = await supabase.auth.updateUser({ password: pwForm.next });
    if (error) {
      setPwMsg(error.message);
    } else {
      setPwMsg('Password changed successfully.');
      setPwForm({ current: '', next: '', confirm: '' });
      setTimeout(() => setPwMsg(''), 4000);
    }
    setPwSaving(false);
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
      <header className="bg-[#0A2540] text-white px-4 py-2">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <Image src="/logo-white.png" alt="BuyandShip Nigeria" width={200} height={60} className="h-14 w-auto" />
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
        <div className="flex flex-wrap gap-1 bg-white rounded-xl p-1 border border-slate-200 mb-6">
          {([
            ['shipping', 'Shipments'],
            ['procurement', 'Procurement'],
            ['addresses', 'Addresses'],
            ['profile', 'My Profile'],
          ] as const).map(([tab, label]) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                activeTab === tab ? 'bg-[#0A2540] text-white' : 'text-slate-600 hover:text-[#0A2540]'
              )}
            >
              {label}
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
                      <th className="px-4 py-3 text-left">Payment</th>
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
                          {r.total_estimate ? `$${r.total_estimate.toFixed(2)}` : 'Pending review'}
                        </td>
                        <td className="px-4 py-3">
                          {r.total_estimate && r.payment_status === 'unpaid' && ['cost_sent','approved'].includes(r.status) ? (
                            <button
                              onClick={async () => {
                                const res = await fetch('/api/payment/initialize', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ requestId: r.id, requestType: 'procurement' }),
                                });
                                const d = await res.json();
                                if (d.authorization_url) window.location.href = d.authorization_url;
                              }}
                              className="inline-flex items-center gap-1 text-xs px-3 py-1.5 rounded-full font-semibold bg-[#F97316] text-white hover:bg-[#F97316]/90"
                            >
                              Pay ${r.total_estimate.toFixed(2)}
                            </button>
                          ) : (
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                              r.payment_status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                            }`}>
                              {r.payment_status === 'paid' ? 'Paid' : r.total_estimate ? 'Awaiting approval' : '—'}
                            </span>
                          )}
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

        {/* Profile Tab */}
        {activeTab === 'profile' && profile && (
          <div className="space-y-6 max-w-lg">
            {/* Edit Profile */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-[#0A2540] flex items-center gap-2">
                  <User className="h-4 w-4" /> Personal Details
                </h2>
                {!editProfile && (
                  <button
                    onClick={() => { setEditProfile(true); setProfileForm({ full_name: profile.full_name, phone: profile.phone || '' }); setProfileMsg(''); }}
                    className="flex items-center gap-1 text-sm text-[#F97316] hover:underline"
                  >
                    <Edit2 className="h-3.5 w-3.5" /> Edit
                  </button>
                )}
              </div>

              {!editProfile ? (
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500">Full Name</span>
                    <span className="font-medium text-[#0A2540]">{profile.full_name}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500">Email</span>
                    <span className="font-medium text-[#0A2540]">{profile.email}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500">Phone</span>
                    <span className="font-medium text-[#0A2540]">{profile.phone || '—'}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-slate-500">ID Status</span>
                    <span className={`font-medium ${profile.nin_verified ? 'text-green-600' : 'text-amber-600'}`}>
                      {profile.nin_verified ? 'Verified' : 'Pending'}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="edit-name">Full Name</Label>
                    <Input
                      id="edit-name"
                      value={profileForm.full_name}
                      onChange={(e) => setProfileForm((f) => ({ ...f, full_name: e.target.value }))}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="edit-phone">Phone Number</Label>
                    <Input
                      id="edit-phone"
                      type="tel"
                      placeholder="08012345678"
                      value={profileForm.phone}
                      onChange={(e) => setProfileForm((f) => ({ ...f, phone: e.target.value }))}
                      className="mt-1"
                    />
                    <p className="text-xs text-slate-400 mt-1">Nigerian number — e.g. 08012345678</p>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input value={profile.email} disabled className="mt-1 opacity-60" />
                    <p className="text-xs text-slate-400 mt-1">Email cannot be changed here.</p>
                  </div>
                  {profileMsg && (
                    <p className={`text-sm ${profileMsg.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>{profileMsg}</p>
                  )}
                  <div className="flex gap-3">
                    <Button onClick={handleProfileSave} disabled={profileSaving} size="sm">
                      {profileSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <button onClick={() => { setEditProfile(false); setProfileMsg(''); }} className="text-sm text-slate-500 hover:text-slate-700">
                      Cancel
                    </button>
                  </div>
                </div>
              )}
              {profileMsg && !editProfile && (
                <p className="text-sm text-green-600 mt-3">{profileMsg}</p>
              )}
            </div>

            {/* Change Password */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
              <h2 className="font-semibold text-[#0A2540] flex items-center gap-2 mb-4">
                <KeyRound className="h-4 w-4" /> Change Password
              </h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="pw-new">New Password</Label>
                  <div className="relative mt-1">
                    <Input
                      id="pw-new"
                      type={showPw ? 'text' : 'password'}
                      placeholder="Min 8 characters"
                      value={pwForm.next}
                      onChange={(e) => setPwForm((f) => ({ ...f, next: e.target.value }))}
                      className="pr-10"
                    />
                    <button type="button" onClick={() => setShowPw(!showPw)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                      {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="pw-confirm">Confirm New Password</Label>
                  <Input
                    id="pw-confirm"
                    type="password"
                    placeholder="Repeat new password"
                    value={pwForm.confirm}
                    onChange={(e) => setPwForm((f) => ({ ...f, confirm: e.target.value }))}
                    className="mt-1"
                  />
                </div>
                {pwMsg && (
                  <p className={`text-sm ${pwMsg.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>{pwMsg}</p>
                )}
                <Button onClick={handlePasswordChange} disabled={pwSaving || !pwForm.next || !pwForm.confirm} size="sm">
                  {pwSaving ? 'Updating...' : 'Update Password'}
                </Button>
              </div>
            </div>
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
