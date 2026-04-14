'use client';

import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabaseBrowser } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, ChevronLeft, ChevronRight, Edit2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { PROCUREMENT_STATUS_LABELS } from '@/lib/utils';

const PAGE_SIZE = 20;
const PROC_STATUSES = ['pending', 'reviewing', 'cost_sent', 'approved', 'purchased', 'shipped', 'delivered'];

export default function AdminProcurement() {
  const [requests, setRequests] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState('');
  const [adminNotes, setAdminNotes] = useState('');
  const [estimatedCost, setEstimatedCost] = useState('');
  const [procFee, setProcFee] = useState('');
  const [totalEst, setTotalEst] = useState('');
  const [updating, setUpdating] = useState(false);

  async function load() {
    setLoading(true);
    const supabase = supabaseBrowser();
    const { data, count } = await supabase
      .from('procurement_requests')
      .select('*,customers(full_name,email)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);
    setRequests(data || []);
    setTotal(count || 0);
    setLoading(false);
  }

  useEffect(() => { load(); }, [page]);

  async function handleUpdate(id: string) {
    setUpdating(true);
    const supabase = supabaseBrowser();
    const req = requests.find((r) => r.id === id);
    const history = req?.status_history || [];
    history.push({ status: newStatus, timestamp: new Date().toISOString() });

    const updateData: Record<string, unknown> = { status: newStatus, status_history: history };
    if (adminNotes) updateData.admin_notes = adminNotes;
    if (estimatedCost) updateData.estimated_cost = parseFloat(estimatedCost);
    if (procFee) updateData.procurement_fee = parseFloat(procFee);
    if (totalEst) updateData.total_estimate = parseFloat(totalEst);

    await supabase.from('procurement_requests').update(updateData).eq('id', id);
    setEditingId(null);
    setUpdating(false);
    load();
  }

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <AdminLayout>
      <div className="max-w-6xl">
        <h1 className="text-2xl font-bold text-[#0A2540] mb-6">Procurement Requests ({total})</h1>

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
                    <th className="px-4 py-3 text-left">Origin</th>
                    <th className="px-4 py-3 text-left">Items</th>
                    <th className="px-4 py-3 text-left">Total Estimate</th>
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
                        <td className="px-4 py-3 text-sm">{r.origin}</td>
                        <td className="px-4 py-3 text-sm text-slate-500">
                          {Array.isArray(r.product_links) ? r.product_links.length : 0} item(s)
                        </td>
                        <td className="px-4 py-3 text-sm font-medium">
                          {r.total_estimate ? `$${r.total_estimate.toFixed(2)}` : '—'}
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-700 font-medium">
                            {PROCUREMENT_STATUS_LABELS[r.status] || r.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                            r.payment_status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {r.payment_status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-400">{formatDate(r.created_at)}</td>
                        <td className="px-4 py-3">
                          <button
                            onClick={() => {
                              setEditingId(r.id === editingId ? null : r.id);
                              setNewStatus(r.status);
                              setAdminNotes(r.admin_notes || '');
                            }}
                            className="p-1.5 rounded-md hover:bg-slate-100"
                          >
                            <Edit2 className="h-4 w-4 text-slate-500" />
                          </button>
                        </td>
                      </tr>
                      {editingId === r.id && (
                        <tr>
                          <td colSpan={8} className="px-4 py-4 bg-purple-50">
                            <div className="space-y-3">
                              <div className="flex items-center gap-3 flex-wrap">
                                <select
                                  value={newStatus}
                                  onChange={(e) => setNewStatus(e.target.value)}
                                  className="h-9 rounded-md border border-slate-300 px-3 text-sm"
                                >
                                  {PROC_STATUSES.map((s) => (
                                    <option key={s} value={s}>{PROCUREMENT_STATUS_LABELS[s]}</option>
                                  ))}
                                </select>
                              </div>
                              <div className="grid grid-cols-3 gap-3">
                                <input
                                  type="number"
                                  placeholder="Item Cost ($)"
                                  value={estimatedCost}
                                  onChange={(e) => setEstimatedCost(e.target.value)}
                                  className="h-9 rounded-md border border-slate-300 px-3 text-sm"
                                />
                                <input
                                  type="number"
                                  placeholder="Proc. Fee ($)"
                                  value={procFee}
                                  onChange={(e) => setProcFee(e.target.value)}
                                  className="h-9 rounded-md border border-slate-300 px-3 text-sm"
                                />
                                <input
                                  type="number"
                                  placeholder="Total ($)"
                                  value={totalEst}
                                  onChange={(e) => setTotalEst(e.target.value)}
                                  className="h-9 rounded-md border border-slate-300 px-3 text-sm"
                                />
                              </div>
                              <input
                                type="text"
                                placeholder="Admin notes"
                                value={adminNotes}
                                onChange={(e) => setAdminNotes(e.target.value)}
                                className="w-full h-9 rounded-md border border-slate-300 px-3 text-sm"
                              />
                              <div className="flex gap-2">
                                <Button size="sm" onClick={() => handleUpdate(r.id)} disabled={updating}>
                                  {updating ? 'Saving...' : 'Save Updates'}
                                </Button>
                                <button onClick={() => setEditingId(null)} className="text-sm text-slate-500">Cancel</button>
                              </div>
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
