'use client';

import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Package, Users, ShoppingBag, AlertCircle } from 'lucide-react';

interface Stats {
  totalCustomers: number;
  totalShipping: number;
  totalProcurement: number;
  pendingPayments: number;
  unverifiedIDs: number;
  revenueThisMonth: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentShipping, setRecentShipping] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      setStats({
        totalCustomers: data.stats?.totalCustomers || 0,
        totalShipping: data.stats?.totalShipping || 0,
        totalProcurement: data.stats?.totalProcurement || 0,
        pendingPayments: data.stats?.pendingPayments || 0,
        unverifiedIDs: 0,
        revenueThisMonth: 0,
      });
      setRecentShipping(data.recentShipping || []);
      setLoading(false);
    }
    load();
  }, []);

  const cards = [
    { label: 'Total Customers', value: stats?.totalCustomers || 0, icon: Users, color: 'bg-blue-500' },
    { label: 'Shipping Requests', value: stats?.totalShipping || 0, icon: Package, color: 'bg-indigo-500' },
    { label: 'Procurement Requests', value: stats?.totalProcurement || 0, icon: ShoppingBag, color: 'bg-purple-500' },
    { label: 'Unpaid Invoices', value: stats?.pendingPayments || 0, icon: AlertCircle, color: 'bg-orange-500' },
  ];

  return (
    <AdminLayout>
      <div className="max-w-6xl">
        <h1 className="text-2xl font-bold text-[#0A2540] mb-6">Dashboard</h1>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin w-8 h-8 border-4 border-[#0A2540] border-t-transparent rounded-full" />
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {cards.map((card) => (
                <div key={card.label} className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-4">
                  <div className={`w-12 h-12 ${card.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <card.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#0A2540]">{card.value}</p>
                    <p className="text-xs text-slate-500">{card.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Shipping */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <div className="p-4 border-b border-slate-100">
                <h2 className="font-semibold text-[#0A2540]">Recent Shipping Requests</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 text-xs text-slate-500 uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3 text-left">Customer</th>
                      <th className="px-4 py-3 text-left">Item</th>
                      <th className="px-4 py-3 text-left">Origin</th>
                      <th className="px-4 py-3 text-left">Status</th>
                      <th className="px-4 py-3 text-left">Payment</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recentShipping.map((r: any) => (
                      <tr key={r.id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 text-sm font-medium text-[#0A2540]">
                          {r.customers?.full_name || 'Unknown'}
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-600">{r.item_name}</td>
                        <td className="px-4 py-3 text-sm">{r.origin}</td>
                        <td className="px-4 py-3">
                          <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">
                            {r.status.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                            r.payment_status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {r.payment_status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
