# BuyandShip Nigeria

**Shop Anywhere. Ship to Nigeria.**

Full-stack shipping logistics platform for [buyandshiptonigeria.com](https://buyandshiptonigeria.com) — helping Nigerians ship goods from the USA, UK, and China.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Storage | Supabase Storage |
| Email | Resend + React Email |
| Payments | Paystack |
| ID Verification | Prembly (Identitypass) |
| Deployment | Netlify |

---

## Prerequisites

- Node.js 20+ and npm 10+
- [Supabase](https://supabase.com) account (free tier works)
- [Netlify](https://netlify.com) account
- [GitHub](https://github.com) account
- [Resend](https://resend.com) account (for emails)
- [Paystack](https://paystack.com) account (for payments)
- [Prembly](https://prembly.com) account (for NIN verification)

---

## Local Development Setup

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/buyandship-nigeria.git
cd buyandship-nigeria
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

```bash
cp .env.local.example .env.local
```

Edit `.env.local` and fill in all values. See the **Environment Variables** section below.

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Supabase Setup

### 1. Create a Supabase project

Go to [supabase.com](https://supabase.com) → New Project → choose a name and region.

### 2. Run the SQL migration

Go to **Supabase Dashboard → SQL Editor → New Query**, paste the contents of:

```
supabase/migrations/001_initial_schema.sql
```

Click **Run**. This creates all tables, RLS policies, indexes, and seed settings.

### 3. Create the Storage bucket

Go to **Supabase Dashboard → Storage → New Bucket**:

- **Name:** `id-documents`
- **Public:** No (private)

Then add this storage policy (SQL Editor):

```sql
CREATE POLICY "users_upload_own_doc" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'id-documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

### 4. Configure Auth email templates

Go to **Supabase Dashboard → Authentication → Email Templates**.

Update the **Confirm signup** template redirect URL to:
```
https://buyandshiptonigeria.com/auth/dashboard
```

### 5. Get your API keys

Go to **Supabase Dashboard → Project Settings → API**:

- Copy **URL** → `NEXT_PUBLIC_SUPABASE_URL`
- Copy **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Copy **service_role** → `SUPABASE_SERVICE_ROLE_KEY`

---

## Seed the First Admin

After Supabase is set up and `.env.local` is configured:

```bash
npx ts-node scripts/seed-admin.ts
```

Follow the prompts to enter the admin email, password, and name.
This creates the user in Supabase Auth and inserts a record into the `admins` table.

Admin login URL: [/admin/login](/admin/login)

---

## Netlify Deployment (10 Steps)

1. Push this repository to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/buyandship-nigeria.git
   git push -u origin main
   ```

2. Go to [netlify.com](https://netlify.com) → **"Add new site"** → **"Import from Git"**

3. Connect GitHub → select repository: `buyandship-nigeria`

4. Set build settings:
   - **Branch to deploy:** `main`
   - **Build command:** `npm run build`
   - **Publish directory:** `.next`

5. Click **"Add environment variables"** and add ALL variables from the table below

6. Click **"Deploy site"**

7. After deploy: go to **Domain settings** → add custom domain: `buyandshiptonigeria.com`

8. Enable Netlify's automatic **HTTPS** (Let's Encrypt — automatic)

9. Enable **"Asset optimisation"** in Site settings for CSS/JS minification

10. Set Paystack webhook URL at [dashboard.paystack.com](https://dashboard.paystack.com) → **Settings → API Keys & Webhooks**:
    ```
    https://buyandshiptonigeria.com/api/payment/verify
    ```

---

## GitHub → Netlify Auto-Deploy

| Branch | Environment | Behaviour |
|---|---|---|
| `main` | Production | Auto-deploys to `buyandshiptonigeria.com` |
| `develop` | Preview | Auto-deploys to a preview URL |

Push to `main` → Netlify builds and deploys automatically.

---

## Environment Variables

Set ALL of these in **Netlify Dashboard → Site Settings → Environment Variables**.

| Variable | Description | Scope |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | All scopes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key | All scopes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (secret) | Runtime only |
| `RESEND_API_KEY` | Resend API key for emails | Runtime only |
| `PREMBLY_SECRET_KEY` | Prembly secret key for NIN verification | Runtime only |
| `PREMBLY_PUBLIC_KEY` | Prembly public/app-id key | Runtime only |
| `PREMBLY_BASE_URL` | `https://api.prembly.com` | Runtime only |
| `PAYSTACK_SECRET_KEY` | Paystack secret key (keep secret!) | Runtime only |
| `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` | Paystack public key | All scopes |
| `NEXT_PUBLIC_SITE_URL` | `https://buyandshiptonigeria.com` | All scopes |
| `ADMIN_EMAIL` | `admin@buyandshiptonigeria.com` | Runtime only |
| `NEXT_PUBLIC_WHATSAPP` | `2348029155825` | All scopes |

---

## Before Go-Live Checklist

- [ ] **Prembly:** Swap test keys for live keys in Netlify env vars
  - `test_sk_...` → live secret key
  - `test_pk_...` → live public key
- [ ] **Paystack:** Regenerate and set a fresh `PAYSTACK_SECRET_KEY`
- [ ] **Paystack Webhook:** Set to `https://buyandshiptonigeria.com/api/payment/verify`
- [ ] **Resend:** Verify your sending domain `buyandshiptonigeria.com` in Resend dashboard
- [ ] **DNS:** Point `buyandshiptonigeria.com` A record to Netlify load balancer IP
  - Find IP in: Netlify → Domain settings → DNS instructions
- [ ] **og-image.png:** Create and place a 1200×630px OG image at `/public/og-image.png`
- [ ] **Supabase:** Run SQL migration in production project
- [ ] **Supabase:** Create `id-documents` storage bucket
- [ ] **First admin:** Run `npx ts-node scripts/seed-admin.ts`
- [ ] **Test payments:** Make a test payment end-to-end in staging
- [ ] **Test NIN:** Verify NIN flow works with live Prembly keys

---

## Project Structure

```
/
├── app/                    # Next.js App Router pages
│   ├── page.tsx            # Homepage
│   ├── rates/              # Rates + calculator
│   ├── ship-yourself/      # Ship request flow
│   ├── procure/            # Procurement request flow
│   ├── track/              # Shipment tracking
│   ├── policies/           # Terms, privacy, policies
│   ├── faqs/               # FAQ accordion
│   ├── contact/            # Contact form (Netlify Forms)
│   ├── auth/               # Login, signup, customer dashboard
│   ├── admin/              # Admin panel (protected)
│   ├── payment/callback/   # Paystack return handler
│   ├── api/                # API routes (Next.js Route Handlers)
│   └── sitemap.ts          # Dynamic sitemap
├── components/
│   ├── ui/                 # Button, Input, Badge, Accordion, etc.
│   ├── layout/             # Navbar, Footer, WhatsApp button
│   └── admin/              # AdminLayout sidebar
├── emails/                 # React Email templates (9 templates)
├── lib/                    # Utilities: supabase, rates, paystack, prembly, email
├── public/                 # robots.txt, og-image.png
├── scripts/                # seed-admin.ts
├── supabase/migrations/    # SQL schema
├── middleware.ts            # Edge auth guard
├── netlify.toml            # Netlify build + plugin config
└── next.config.js          # Next.js config (Netlify-optimised)
```

---

## Key Features

| Feature | Implementation |
|---|---|
| Public site | Hero, rates, how-it-works, why us |
| Rate calculator | Interactive — USA/UK/China estimator |
| Ship Yourself | NIN verification → warehouse address → form |
| Procurement | ID gate → product links → 5% fee preview |
| Shipment tracking | By request ID or tracking number |
| Customer dashboard | Shipments, procurements, warehouse addresses |
| Admin panel | Full CRUD on all requests, status updates |
| Payments | Paystack (NGN, card + bank transfer) |
| Emails | 7 transactional emails via Resend |
| ID Verification | Prembly NIN + doc upload fallback |
| SEO | JSON-LD, meta tags, sitemap, targeted keywords |
| Contact form | Netlify Forms (zero backend) |

---

## Support

- WhatsApp: [08029155825](https://wa.me/2348029155825)
- Email: admin@buyandshiptonigeria.com
- Hours: Mon–Fri, 9am–5pm WAT
