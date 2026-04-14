// Server-only — do not import this in client components
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const supabaseServer = () =>
  createServerComponentClient({ cookies });
