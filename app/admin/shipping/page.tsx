'use client';

import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ChevronLeft, ChevronRight, Edit2 } from 'lucide-react';
import { formatDate, STATUS_LABELS, cn } from '@/lib/utils';

const PAGE_SIZE = 20;
const STATUSES = ['pending', 'received_at_warehouse', 'in_transit', 'out_for_delivery', 'delivered'];

export default function AdminShipping() {
  const [requests, setRequests] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState('');
  const [statusNote, setStatusNote] = useState('');
  const [updating, setUpdating] = useState(false);

  async function load() {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), search });
    const res = await fetch(`/api/admin/shipping?${params}`);
    const data = await res.json();
    setRequests(data.requests || []);
    setTotal(data.total || 0);
    setLoading(false);
  }

  useEffect(() => { load(); }, [page, search]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleStatusUpdate(id: string) {
    if (!newStatus) return;
    setUpdating(true);
    const req = requests.find((r) => r.id === id);
    const history = [...(req?.status_history || [])];
    history.push({ status: newStatus, timestamp: new Date().toISOString(), note: statusNote });

    await fetch('/api/admin/shipping', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: newStatus, status_history: history }),
    });

    // Send email notification (fire and forget)
    fetch('/api/email/status-update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        requestId: id,
        status: newStatus,
        customerEmail: req?.customers?.email,
        customerName: req?.customers?.full_name,
      }),
    }).catch(() => {});

    setEditingId(null);
    setNewStatus('');
    setStatusNote('');
    setUpdating(false);
    load();
  }

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <AdminLayout>
      <div className="max-w-6xl">
        <h1 className="text-2xl font-bold text-[#0A2540] mb-6">Shipping Requests ({total})</h1>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search by item or tracking number..."
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
                    <th className="px-4 py-3 text-left">Customer</th>
                    <th className="px-4 py-3 text-left">Item</th>
                    <th className="px-4 py-3 text-left">Tracking</th>
                    <th className="px-4 py-3 text-left">Origin</th>
                    <th className="px-4 py-3 text-left">Cost</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Payment</th>
                    <th className="px-4 py-3 text-left">Date</th>
                    <th className="px-4 py-3 text-left">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {requests.map((r) => (
                    <>
                      <tr key={r.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 text-sm font-medium">{r.customers?.full_name}</td>
                        <td className="px-4 py-3 text-sm">{r.item_name}</td>
                        <td className="px-4 py-3 text-xs font-mono">{r.tracking_number}</td>
                        <td className="px-4 py-3 text-sm">{r.origin}</td>
                        <td className="px-4 py-3 text-sm">
                          {r.estimated_cost
                            ? `${r.estimated_currency === 'GBP' ? '£' : '$'}${r.estimated_cost.toFixed(2)}`
                            : '—'}
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">
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
                        <td className="px-4 py-3">
                          <button
                            onClick={() => { setEditingId(r.id === editingId ? null : r.id); setNewStatus(r.status); }}
                            className="p-1.5 rounded-md hover:bg-slate-100"
                          >
                            <Edit2 className="h-4 w-4 text-slate-500" />
                          </button>
                        </td>
                      </tr>
                      {editingId === r.id && (
                        <tr key={`edit-${r.id}`}>
                          <td colSpan={9} className="px-4 py-3 bg-blue-50">
                            <div className="flex items-center gap-3 flex-wrap">
                              <select
                                value={newStatus}
                                onChange={(e) => setNewStatus(e.target.value)}
                                className="h-9 rounded-md border border-slate-300 px-3 text-sm"
                              >
                                {STATUSES.map((s) => (
                                  <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                                ))}
                              </select>
                              <input
                                type="text"
                                placeholder="Status note (optional)"
                                value={statusNote}
                                onChange={(e) => setStatusNote(e.target.value)}
                                className="h-9 rounded-md border border-slate-300 px-3 text-sm flex-1 min-w-48"
                              />
                              <Button size="sm" onClick={() => handleStatusUpdate(r.id)} disabled={updating}>
                                {updating ? 'Updating...' : 'Update Status'}
                              </Button>
                              <button onClick={() => setEditingId(null)} className="text-sm text-slate-500">Cancel</button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-slate-500">Page {page + 1} of {totalPages}</p>
            <div className="flex gap-2">
              <button onClick={() => setPage(page - 1)} disabled={page === 0} className="p-2 rounded-lg border border-slate-200 disabled:opacity-40">
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button onClick={() => setPage(page + 1)} disabled={page >= totalPages - 1} className="p-2 rounded-lg border border-slate-200 disabled:opacity-40">
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
