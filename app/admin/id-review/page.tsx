'use client';

import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { supabaseBrowser } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, FileText } from 'lucide-react';
import { formatDate } from '@/lib/auth';

export default function AdminIDReview() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    const supabase = supabaseBrowser();
    const { data } = await supabase
      .from('customers')
      .select('*')
      .eq('nin_verified', false)
      .not('id_document_url', 'is', null)
      .order('created_at', { ascending: false });
    setCustomers(data || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function handleVerify(id: string, approve: boolean) {
    setActionId(id);
    const supabase = supabaseBrowser();
    await supabase.from('customers').update({ nin_verified: approve }).eq('id', id);

    if (approve) {
      const customer = customers.find((c) => c.id === id);
      if (customer) {
        fetch('/api/email/id-verified', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: customer.email, name: customer.full_name }),
        }).catch(() => {});
      }
    }

    setActionId(null);
    load();
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl">
        <h1 className="text-2xl font-bold text-[#0A2540] mb-2">ID Document Review</h1>
        <p className="text-slate-500 text-sm mb-6">
          Customers who uploaded a document as an alternative to NIN verification.
        </p>

        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin w-6 h-6 border-4 border-[#0A2540] border-t-transparent rounded-full" />
            </div>
          ) : customers.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-400" />
              <p className="font-medium">All caught up!</p>
              <p className="text-sm">No pending ID reviews.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {customers.map((c) => (
                <div key={c.id} className="p-5 flex items-start justify-between gap-4 hover:bg-slate-50">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <FileText className="h-5 w-5 text-slate-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#0A2540]">{c.full_name}</p>
                      <p className="text-sm text-slate-500">{c.email}</p>
                      <p className="text-xs text-slate-400 mt-1">Submitted: {formatDate(c.created_at)}</p>
                      {c.id_document_url && (
                        <a
                          href={c.id_document_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-[#F97316] hover:underline mt-1 inline-block"
                        >
                          View ID Document →
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-200 text-red-600 hover:bg-red-50"
                      onClick={() => handleVerify(c.id, false)}
                      disabled={actionId === c.id}
                    >
                      <XCircle className="h-4 w-4 mr-1" /> Reject
                    </Button>
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleVerify(c.id, true)}
                      disabled={actionId === c.id}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" /> Approve
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
