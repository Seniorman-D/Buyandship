'use client';

import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, CheckCircle, XCircle, ChevronLeft, ChevronRight, RefreshCw, Mail } from 'lucide-react';
import { formatDate } from '@/lib/utils';

const PAGE_SIZE = 20;

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState('');
  const [blasting, setBlasting] = useState(false);
  const [blastMsg, setBlastMsg] = useState('');

  async function load() {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), search });
    const res = await fetch(`/api/admin/customers?${params}`);
    const data = await res.json();
    setCustomers(data.customers || []);
    setTotal(data.total || 0);
    setLoading(false);
  }

  useEffect(() => { load(); }, [page, search]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleSync() {
    setSyncing(true);
    setSyncMsg('');
    const res = await fetch('/api/admin/sync-customers', { method: 'POST' });
    const data = await res.json();
    setSyncMsg(data.message || 'Sync complete.');
    await load();
    setSyncing(false);
  }

  async function handleVerificationBlast() {
    // Dry run first to show count
    const preview = await fetch('/api/admin/verification-blast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dryRun: true }),
    });
    const previewData = await preview.json();
    if (!window.confirm(`Send verification nudge email to ${previewData.count} unverified customer(s)? This cannot be undone.`)) return;

    setBlasting(true);
    setBlastMsg('');
    const res = await fetch('/api/admin/verification-blast', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ dryRun: false }),
    });
    const data = await res.json();
    setBlastMsg(`✅ Sent ${data.sent} of ${data.total} verification emails.${data.failed ? ` (${data.failed} failed)` : ''}`);
    setBlasting(false);
  }

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <AdminLayout>
      <div className="max-w-6xl">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-[#0A2540]">Customers ({total})</h1>
          <div className="flex gap-2">
            <Button onClick={handleVerificationBlast} disabled={blasting} size="sm" variant="outline" className="flex items-center gap-2 border-orange-300 text-orange-700 hover:bg-orange-50">
              <Mail className="h-4 w-4" />
              {blasting ? 'Sending...' : 'Email Unverified Users'}
            </Button>
            <Button onClick={handleSync} disabled={syncing} size="sm" variant="outline" className="flex items-center gap-2">
              <RefreshCw className={`h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? 'Syncing...' : 'Sync All Customers'}
            </Button>
          </div>
        </div>
        {syncMsg && (
          <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-2 mb-3">{syncMsg}</p>
        )}
        {blastMsg && (
          <p className="text-sm text-orange-700 bg-orange-50 border border-orange-200 rounded-lg px-4 py-2 mb-3">{blastMsg}</p>
        )}

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="pl-9"
          />
        </div>

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin w-6 h-6 border-4 border-[#0A2540] border-t-transparent rounded-full" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-left">Phone</th>
                    <th className="px-4 py-3 text-left">ID Verified</th>
                    <th className="px-4 py-3 text-left">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {customers.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-sm text-[#0A2540]">{c.full_name}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{c.email}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{c.phone || '—'}</td>
                      <td className="px-4 py-3">
                        {c.nin_verified ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-400" />
                        )}
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-400">{formatDate(c.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-slate-500">
              Page {page + 1} of {totalPages} — {total} total
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 0}
                className="p-2 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page >= totalPages - 1}
                className="p-2 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
