import { supabaseAdmin } from './supabase';

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

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

export function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}
