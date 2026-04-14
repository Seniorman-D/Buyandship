'use client';

import { useState } from 'react';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, Package, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const STATUS_STEPS = [
  { key: 'pending', label: 'Request Received', icon: Package },
  { key: 'received_at_warehouse', label: 'Arrived at Warehouse', icon: CheckCircle },
  { key: 'in_transit', label: 'In Transit to Nigeria', icon: Package },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: Package },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle },
];

const STATUS_INDEX: Record<string, number> = {
  pending: 0,
  received_at_warehouse: 1,
  in_transit: 2,
  out_for_delivery: 3,
  delivered: 4,
};

interface TrackResult {
  id: string;
  tracking_number: string;
  item_name: string;
  origin: string;
  status: string;
  created_at: string;
  status_history: Array<{ status: string; timestamp: string; note?: string }>;
}

export default function TrackPage() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TrackResult | null>(null);
  const [error, setError] = useState('');

  async function handleTrack(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch(`/api/track?q=${encodeURIComponent(query.trim())}`);
      const data = await res.json();
      if (data.error || !data.shipment) {
        setError('No shipment found with that ID or tracking number. Please check and try again.');
      } else {
        setResult(data.shipment);
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const currentStep = result ? STATUS_INDEX[result.status] ?? 0 : 0;

  return (
    <PublicLayout>
      <div className="bg-[#0A2540] text-white py-14 px-4">
        <div className="container mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold mb-3">Track Your Shipment</h1>
          <p className="text-slate-300">Enter your Request ID or tracking number to see real-time status</p>
        </div>
      </div>

      <div className="container mx-auto max-w-2xl px-4 py-14">
        <form onSubmit={handleTrack} className="mb-10">
          <Label htmlFor="track-input" className="text-base font-semibold mb-3 block text-[#0A2540]">
            Request ID or Tracking Number
          </Label>
          <div className="flex gap-3">
            <Input
              id="track-input"
              type="text"
              placeholder="e.g. BAS-1234567890-ABC or your tracking number"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 h-12 text-base"
            />
            <Button type="submit" size="lg" disabled={loading} className="px-6">
              {loading ? (
                <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5" />
              ) : (
                <Search className="h-5 w-5" />
              )}
            </Button>
          </div>
        </form>

        {error && (
          <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 mb-6">
            <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {result && (
          <div className="animate-fade-in">
            {/* Shipment Summary */}
            <div className="bg-[#0A2540] text-white rounded-xl p-6 mb-6">
              <div className="flex items-start justify-between flex-wrap gap-3">
                <div>
                  <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Shipment</p>
                  <p className="font-bold text-lg">{result.item_name}</p>
                  <p className="text-slate-400 text-sm mt-1">From: {result.origin}</p>
                </div>
                <div className="text-right">
                  <p className="text-slate-400 text-xs">Tracking #</p>
                  <p className="font-mono text-sm text-[#F97316]">{result.tracking_number}</p>
                </div>
              </div>
            </div>

            {/* Status Stepper */}
            <div className="space-y-0 mb-8">
              {STATUS_STEPS.map((step, i) => {
                const done = i <= currentStep;
                const active = i === currentStep;
                return (
                  <div key={step.key} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={cn(
                        'w-10 h-10 rounded-full border-2 flex items-center justify-center flex-shrink-0',
                        done ? 'bg-[#0A2540] border-[#0A2540] text-white' : 'bg-white border-slate-300 text-slate-400'
                      )}>
                        <step.icon className="h-5 w-5" />
                      </div>
                      {i < STATUS_STEPS.length - 1 && (
                        <div className={cn('w-0.5 h-10', done ? 'bg-[#0A2540]' : 'bg-slate-200')} />
                      )}
                    </div>
                    <div className="pb-6 pt-2">
                      <p className={cn('font-medium', done ? 'text-[#0A2540]' : 'text-slate-400')}>
                        {step.label}
                        {active && <span className="ml-2 text-xs bg-[#F97316] text-white px-2 py-0.5 rounded-full">Current</span>}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* History */}
            {result.status_history && result.status_history.length > 0 && (
              <div>
                <h3 className="font-semibold text-[#0A2540] mb-3 flex items-center gap-2">
                  <Clock className="h-4 w-4" /> Status History
                </h3>
                <div className="space-y-2">
                  {[...result.status_history].reverse().map((h, i) => (
                    <div key={i} className="flex gap-3 p-3 bg-slate-50 rounded-lg text-sm">
                      <span className="text-slate-400 text-xs whitespace-nowrap">
                        {new Date(h.timestamp).toLocaleDateString('en-GB')}
                      </span>
                      <span className="text-slate-700">{h.status.replace(/_/g, ' ')}</span>
                      {h.note && <span className="text-slate-500">— {h.note}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {!result && !error && (
          <div className="text-center py-12 text-slate-400">
            <Search className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p>Enter your request ID or tracking number above to track your shipment</p>
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
