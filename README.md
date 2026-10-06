# NextGen Kadamtoli
1. Supabase প্রজেক্ট খুলুন → SQL Editor-এ `supabase/schema.sql` Run করুন
2. `.env.example` কপি করে `.env.local` বানান, Supabase URL ও anon key বসান
3. `npm install` তারপর `npm run dev` → http://localhost:3000
4. GitHub-এ পুশ করে Vercel-এ Import করুন, একই দুটি Environment Variable দিন
5. PWA: `app/manifest.js`, `public/sw.js`, `public/offline.html`, `components/PWA.js`, `public/icons/*` — HTTPS (Vercel) এ স্বয়ংক্রিয়ভাবে ইন্সটলযোগ্য হবে
