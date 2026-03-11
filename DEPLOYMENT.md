# Deployment Guide: 에어컨의 수다방

## Prerequisites

- Node.js 18+
- [Supabase](https://supabase.com) account
- [Vercel](https://vercel.com) account (or use Vercel CLI)

---

## 1. Supabase Setup

### 1.1 Create project

1. Go to [Supabase Dashboard](https://app.supabase.com) and create a new project.
2. Note your **Project URL** and **anon public** key (Settings → API).

### 1.2 Create tables

In Supabase SQL Editor, run:

```sql
-- Requests (접수)
create table public.requests (
  id uuid primary key default gen_random_uuid(),
  address text not null,
  phone text not null,
  symptom text not null,
  photo_url text,
  created_at timestamptz default now()
);

-- Reviews (고객후기)
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  image_url text,
  created_at timestamptz default now()
);

-- Posts (일반 글)
create table public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  content text not null,
  created_at timestamptz default now()
);

-- Allow public insert for requests (form submission)
alter table public.requests enable row level security;
create policy "Allow insert requests" on public.requests for insert with check (true);

-- Allow public read for reviews
alter table public.reviews enable row level security;
create policy "Allow read reviews" on public.reviews for select using (true);

-- Allow insert/update for reviews (admin will use service role or add auth later)
create policy "Allow all for reviews" on public.reviews for all using (true) with check (true);

-- Allow public read for posts
alter table public.posts enable row level security;
create policy "Allow read posts" on public.posts for select using (true);
-- Inserts/updates/deletes via API with service role
create policy "Allow all for posts" on public.posts for all using (true) with check (true);
```

### 1.3 Storage buckets

1. Go to **Storage** in Supabase.
2. Create bucket **`review-images`** (public).
3. Create bucket **`request-photos`** (public, for optional form photo upload).
4. In **Policies**, add:
   - `review-images`: allow public read; allow insert/update with your policy (e.g. `true` for anon if you rely on API route with service key).
   - `request-photos`: allow public read; allow insert (so API can upload).

If you use **service role key** in the API (recommended), you can keep bucket policies minimal and let the server upload with the service role.

### 1.4 Environment variables (for app)

You will need:

- `NEXT_PUBLIC_SUPABASE_URL` = Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = anon key
- `SUPABASE_SERVICE_ROLE_KEY` = service_role key (Settings → API) — use only in server/API; do not expose to client.

---

## 2. Local development

```bash
# Install dependencies
npm install

# Copy env and fill in values
cp .env.example .env.local

# Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## 3. Vercel deployment

### 3.1 Connect repository

1. Push this project to GitHub/GitLab/Bitbucket.
2. In [Vercel](https://vercel.com), **Add New Project** and import the repo.
3. Framework: **Next.js** (auto-detected). Root: `./`. Build command: `npm run build`. Output: default.

### 3.2 Environment variables (Vercel)

In Project → **Settings → Environment Variables**, add:

| Name                         | Value                    | Env    |
|-----------------------------|--------------------------|--------|
| `NEXT_PUBLIC_SUPABASE_URL`  | Your Supabase URL        | All    |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your anon key        | All    |
| `SUPABASE_SERVICE_ROLE_KEY` | Your service role key    | All    |
| `NEXT_PUBLIC_SITE_URL`      | `https://your-app.vercel.app` | All |
| `ADMIN_PASSWORD`           | Admin panel password (server-side) | All |
| `GOOGLE_SITE_VERIFICATION`  | (optional) Google code   | All    |

Redeploy after changing env vars.

### 3.3 Deploy

- **Git**: push to main; Vercel builds and deploys.
- **CLI**: `npx vercel` (login if needed), then `npx vercel --prod` for production.

---

## 4. Post-deploy checklist

- [ ] Homepage loads; phone and blog links work.
- [ ] **접수폼**: submit form; check Supabase `requests` table and SMS open on device.
- [ ] **고객후기**: add a review from **관리자페이지**; confirm it appears on 고객후기.
- [ ] **관리자페이지**: log in with `ADMIN_PASSWORD`; manage reviews (create/delete) and posts (create/delete).
- [ ] Set `NEXT_PUBLIC_SITE_URL` to your real domain and redeploy.
- [ ] Add Google Search Console verification in env and/or layout if needed.

---

## 5. SEO

- Default meta title/description are set in `app/layout.tsx`.
- Sitemap: `NEXT_PUBLIC_SITE_URL/sitemap.xml`.
- Robots: `NEXT_PUBLIC_SITE_URL/robots.txt` (disallows `/admin` and `/api/`).
- Set `GOOGLE_SITE_VERIFICATION` for Google Search Console.

---

## 6. Custom domain (optional)

In Vercel: Project → **Settings → Domains** → add your domain and follow DNS instructions. Update `NEXT_PUBLIC_SITE_URL` to that domain and redeploy.
