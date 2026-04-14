/**
 * Seed Admin Script
 * Usage: npx ts-node scripts/seed-admin.ts
 *
 * Run this ONCE after setting up Supabase to create the first admin user.
 * Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local
 */

import { createClient } from '@supabase/supabase-js';
import * as readline from 'readline';

require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌  Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const ask = (q: string) => new Promise<string>((res) => rl.question(q, res));

async function main() {
  console.log('\n🚀  BuyandShip Nigeria — Admin Seed Script\n');

  const email = await ask('Admin email address: ');
  const password = await ask('Admin password (min 8 chars): ');
  const fullName = await ask('Admin full name: ');

  if (!email || !password || password.length < 8) {
    console.error('❌  Invalid input. Password must be at least 8 characters.');
    process.exit(1);
  }

  console.log('\n⏳  Creating admin user...');

  // Create auth user
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authError) {
    console.error('❌  Auth error:', authError.message);
    process.exit(1);
  }

  const userId = authData.user.id;
  console.log(`✅  Auth user created: ${userId}`);

  // Insert into admins table
  const { error: adminError } = await supabase.from('admins').insert({
    id: userId,
    email,
    full_name: fullName,
  });

  if (adminError) {
    console.error('❌  Admin table error:', adminError.message);
    process.exit(1);
  }

  console.log(`✅  Admin record created in admins table`);
  console.log(`\n✨  Done! Admin user created successfully.`);
  console.log(`   Email:    ${email}`);
  console.log(`   Name:     ${fullName}`);
  console.log(`   Login at: https://buyandshiptonigeria.com/admin/login\n`);

  rl.close();
}

main().catch((err) => {
  console.error('❌  Unexpected error:', err);
  process.exit(1);
});
