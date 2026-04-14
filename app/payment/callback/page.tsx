'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

function PaymentCallbackContent() {
  const searchParams = useSearchParams();
  const reference = searchParams.get('reference') || searchParams.get('trxref');
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [message, setMessage] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    if (!reference) {
      setStatus('failed');
      setMessage('No payment reference found.');
      return;
    }

    fetch(`/api/payment/verify?reference=${reference}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.paid) {
          setStatus('success');
          setAmount(data.amount ? `₦${Number(data.amount).toLocaleString()}` : '');
          setMessage('Your payment has been confirmed and your shipment is being processed.');
        } else {
          setStatus('failed');
          setMessage(data.error || 'Payment verification failed. Please contact support.');
        }
      })
      .catch(() => {
        setStatus('failed');
        setMessage('Could not verify payment. Please contact support with your reference number.');
      });
  }, [reference]);

  return (
    <PublicLayout>
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-20">
        <div className="text-center max-w-md">
          {status === 'loading' && (
            <>
              <Loader2 className="h-16 w-16 text-[#0A2540] animate-spin mx-auto mb-6" />
              <h1 className="text-2xl font-bold text-[#0A2540] mb-2">Verifying Payment</h1>
              <p className="text-slate-500">Please wait while we confirm your payment...</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-[#0A2540] mb-2">Payment Successful!</h1>
              {amount && <p className="text-3xl font-bold text-[#F97316] mb-3">{amount}</p>}
              <p className="text-slate-600 mb-2">{message}</p>
              <p className="text-sm text-slate-400 mb-8">Reference: {reference}</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/auth/dashboard">
                  <Button>View Dashboard</Button>
                </Link>
                <Link href="/track">
                  <Button variant="outline">Track Shipment</Button>
                </Link>
              </div>
            </>
          )}

          {status === 'failed' && (
            <>
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <XCircle className="h-10 w-10 text-red-500" />
              </div>
              <h1 className="text-2xl font-bold text-[#0A2540] mb-2">Payment Issue</h1>
              <p className="text-slate-600 mb-2">{message}</p>
              {reference && <p className="text-sm text-slate-400 mb-8">Reference: {reference}</p>}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a href="https://wa.me/2348029155825" target="_blank" rel="noopener noreferrer">
                  <Button variant="accent">Contact Support</Button>
                </a>
                <Link href="/auth/dashboard">
                  <Button variant="outline">Go to Dashboard</Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}

export default function PaymentCallbackPage() {
  return (
    <Suspense fallback={
      <PublicLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-[#0A2540]" />
        </div>
      </PublicLayout>
    }>
      <PaymentCallbackContent />
    </Suspense>
  );
}
