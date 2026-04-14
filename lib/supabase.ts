import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// Browser client — use in 'use client' components only
export const supabaseBrowser = () => createClientComponentClient();
