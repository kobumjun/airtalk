# 에어컨의 수다방

에어컨 설치, 수리, 가스충전, 철거, 청소 전문업체 소개 및 접수 웹사이트.

## Tech stack

- **Next.js 14** (App Router)
- **TypeScript**
- **TailwindCSS**
- **Supabase** (DB + image storage)
- **Vercel** deployment

## Pages

| Path     | 설명         |
|----------|--------------|
| `/`      | 홈           |
| `/request` | 접수폼     |
| `/reviews`  | 고객후기   |
| `/admin`    | 관리자페이지 |

## Quick start

```bash
npm install
cp .env.example .env.local
# Edit .env.local with your Supabase and optional env vars
npm run dev
```

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for Supabase table setup, storage buckets, and Vercel deployment.

## Environment variables

- `NEXT_PUBLIC_SUPABASE_URL` – Supabase project URL  
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` – Supabase anon key  
- `SUPABASE_SERVICE_ROLE_KEY` – (optional) For API uploads  
- `NEXT_PUBLIC_SITE_URL` – Full site URL for sitemap/SEO  
- `ADMIN_PASSWORD` – Admin panel password (server-side session cookie)  
- `GOOGLE_SITE_VERIFICATION` – (optional) Google Search Console  

## Contact

- **대표번호**: 010-5816-4415  
- **블로그**: [m.blog.naver.com/han082755](https://m.blog.naver.com/han082755)
