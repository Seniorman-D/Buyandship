'use client';

import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { ChevronLeft, ChevronRight, CreditCard } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';

const PAGE_SIZE = 20;

export default function AdminPayments() {
  const [payments, setPayments] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await fetch(`/api/admin/payments?page=${page}`);
      const data = await res.json();
      setPayments(data.payments || []);
      setTotal(data.total || 0);
      setLoading(false);
    }
    load();
  }, [page]);

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const totalRevenue = payments.reduce((sum, p) => sum + (p.estimated_cost || 0), 0);

  return (
    <AdminLayout>
      <div className="max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-[#0A2540]">Payments</h1>
          <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-2">
            <p className="text-xs text-green-600">Page Revenue</p>
            <p className="text-lg font-bold text-green-700">${totalRevenue.toFixed(2)}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin w-6 h-6 border-4 border-[#0A2540] border-t-transparent rounded-full" />
            </div>
          ) : payments.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <CreditCard className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>No confirmed payments yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="px-4 py-3 text-left">Customer</th>
                    <th className="px-4 py-3 text-left">Item</th>
                    <th className="px-4 py-3 text-left">Amount</th>
                    <th className="px-4 py-3 text-left">Reference</th>
                    <th className="px-4 py-3 text-left">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {payments.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-[#0A2540]">{p.customers?.full_name}</p>
                        <p className="text-xs text-slate-400">{p.customers?.email}</p>
                      </td>
                      <td className="px-4 py-3 text-sm">{p.item_name}</td>
                      <td className="px-4 py-3 text-sm font-bold text-green-700">
                        {p.estimated_currency === 'GBP' ? '£' : '$'}{p.estimated_cost?.toFixed(2) || '—'}
                      </td>
                      <td className="px-4 py-3 text-xs font-mono text-slate-500">{p.paystack_reference || '—'}</td>
                      <td className="px-4 py-3 text-xs text-slate-400">{formatDateTime(p.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-slate-500">Page {page + 1} of {totalPages} — {total} payments</p>
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
