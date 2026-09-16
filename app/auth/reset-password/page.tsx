'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { supabaseBrowser } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, CheckCircle } from 'lucide-react';

function ResetPasswordForm() {
  const [checkingLink, setCheckingLink] = useState(true);
  const [linkValid, setLinkValid] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const supabase = supabaseBrowser();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setLinkValid(!!session);
      setCheckingLink(false);
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    setError('');

    const supabase = supabaseBrowser();
    const { error: updateError } = await supabase.auth.updateUser({ password });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    const { data: userData } = await supabase.auth.getUser();
    if (userData.user) {
      const { data: adminData } = await supabase
        .from('admins')
        .select('id')
        .eq('id', userData.user.id)
        .single();
      setIsAdmin(!!adminData);
    }

    setSuccess(true);
    setLoading(false);
  }

  if (success) {
    return (
      <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-lg">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-[#0A2540] mb-2">Password updated</h2>
        <p className="text-slate-600 mb-6">Your password has been changed successfully.</p>
        <Button
          className="w-full"
          onClick={() => {
            window.location.href = isAdmin ? '/admin/dashboard' : '/auth/dashboard';
          }}
        >
          Continue
        </Button>
      </div>
    );
  }

  if (!checkingLink && !linkValid) {
    return (
      <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-lg">
        <h2 className="text-2xl font-bold text-[#0A2540] mb-2">Link expired</h2>
        <p className="text-slate-600 mb-6">
          This password reset link is invalid or has expired. Please request a new one from the login page.
        </p>
        <Link href="/admin/login">
          <Button className="w-full">Back to Login</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-lg">
      <Link href="/" className="flex items-center justify-center mb-8">
        <Image src="/logo.png" alt="BuyandShip Nigeria" width={240} height={72} className="h-16 w-auto" />
      </Link>

      <h1 className="text-2xl font-bold text-[#0A2540] mb-1">Set a new password</h1>
      <p className="text-slate-500 text-sm mb-6">Choose a new password for your account.</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="password">New Password</Label>
          <div className="relative mt-1">
            <Input
              id="password"
              type={showPw ? 'text' : 'password'}
              required
              placeholder="Min 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pr-10"
              disabled={checkingLink}
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div>
          <Label htmlFor="confirmPassword">Confirm New Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            required
            placeholder="Repeat your new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-1"
            disabled={checkingLink}
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <Button type="submit" className="w-full" size="lg" disabled={loading || checkingLink}>
          {checkingLink ? 'Verifying link...' : loading ? 'Updating...' : 'Update Password'}
        </Button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <Suspense fallback={
        <div className="animate-spin w-8 h-8 border-4 border-[#0A2540] border-t-transparent rounded-full" />
      }>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
