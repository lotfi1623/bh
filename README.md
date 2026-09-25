# Brother Hood

Premium calisthenics / streetwear e-commerce storefront.

## Stack

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Telegram order notifications

Local: set `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` in `.env.local`.

Production: prefer the same variables in your host (Vercel → **Settings → Environment Variables** → Production → redeploy). They override the built-in defaults used when env vars are missing.

## Scripts

- `npm run dev` — development server
- `npm run build` — production build
- `npm start` — serve production build
