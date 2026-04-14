// Server-side auth utilities — do not import in 'use client' components
import { supabaseAdmin } from './supabase-admin';

export async function isAdminUser(userId: string): Promise<boolean> {
  const { data, error } = await supabaseAdmin
    .from('admins')
    .select('id')
    .eq('id', userId)
    .single();

  return !error && !!data;
}

export async function getCustomerProfile(userId: string) {
  const { data, error } = await supabaseAdmin
    .from('customers')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) return null;
  return data;
}
