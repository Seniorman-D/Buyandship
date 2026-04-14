'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Eye, EyeOff } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const supabase = supabaseBrowser();
    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError('Invalid credentials');
      setLoading(false);
      return;
    }

    const { data: adminData } = await supabase
      .from('admins')
      .select('id')
      .eq('id', data.user.id)
      .single();

    if (!adminData) {
      await supabase.auth.signOut();
      setError('Access denied. This account does not have admin privileges.');
      setLoading(false);
      return;
    }

    document.cookie = 'is_admin=true; path=/; max-age=86400';
    router.push('/admin/dashboard');
  }

  return (
    <div className="min-h-screen bg-[#0A2540] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl">
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-10 h-10 bg-[#0A2540] rounded-xl flex items-center justify-center">
            <Shield className="h-5 w-5 text-[#F97316]" />
          </div>
          <div>
            <p className="font-bold text-[#0A2540]">Admin Panel</p>
            <p className="text-xs text-slate-500">BuyandShip Nigeria</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              placeholder="admin@buyandshiptonigeria.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <div className="relative mt-1">
              <Input
                id="password"
                type={showPw ? 'text' : 'password'}
                required
                placeholder="Admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              >
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <Button type="submit" className="w-full" size="lg" disabled={loading}>
            {loading ? 'Signing in...' : 'Admin Sign In'}
          </Button>
        </form>
      </div>
    </div>
  );
}
