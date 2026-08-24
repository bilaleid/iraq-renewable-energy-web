# طاقة العراق المتجددة | Iraq Renewable Energy

Bilingual (Arabic / English), responsive marketing website for an Iraqi
solar energy company specializing in **industrial** and **commercial**
solar power projects. Built with Next.js (App Router), TypeScript, Tailwind
CSS, `next-intl` for i18n/RTL, and Stripe Checkout for paid consultation
bookings.

## Pages

- **Home** (`/`) — hero, industrial/commercial sectors, services preview, why-us, featured projects preview, CTA.
- **Services** (`/services`) — full service list + "how we work" process.
- **Projects** (`/projects`) — filterable grid of featured projects (industrial / commercial).
- **Contact** (`/contact`) — contact info + inquiry form.
- **Consultation** (`/consultation`) — paid technical consultation booking form, wired to **Stripe Checkout**.

Every page exists in both `/ar/...` (default, RTL) and `/en/...` (LTR) via `next-intl` locale routing.

## Getting Started

```bash
npm install
cp .env.example .env.local   # then fill in the values below
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — it redirects to `/ar`.

## Configuration

All configuration is via environment variables (see `.env.example`):

| Variable | Required | Description |
| --- | --- | --- |
| `STRIPE_SECRET_KEY` | Yes, for payments | Your Stripe secret key. Without it, the consultation form will show a friendly "payments not configured" error instead of crashing. |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Your production domain, used to build Stripe's success/cancel redirect URLs. |
| `NEXT_PUBLIC_CONSULTATION_FEE_USD` | No (defaults to `100`) | The consultation booking fee, in USD. Stripe does not support IQD directly, so pricing is in USD. |
| `CONTACT_WEBHOOK_URL` | No | If set, the "Contact us" form POSTs each submission as JSON to this URL (e.g. a Slack incoming webhook or a Zapier/Make.com hook). If unset, submissions are simply logged server-side. |

### Stripe setup

1. Create a Stripe account and grab the secret key from the [Stripe Dashboard](https://dashboard.stripe.com/apikeys).
2. Set `STRIPE_SECRET_KEY` (test key while developing, live key in production).
3. The `/consultation` booking form creates a Stripe Checkout Session for the configured fee and redirects the visitor to Stripe's hosted, secure payment page — no card data ever touches this app's server.
4. On success/cancel, Stripe redirects back to `/{locale}/consultation/success` or `/{locale}/consultation/cancel`.

## Brand / logo

No logo file was available in this environment, so the site currently uses
a placeholder mark (a simple sun-on-panel icon) and a green + gold color
palette typical of solar/renewable branding. All brand colors are defined
as CSS variables in `app/globals.css` (`--brand-green-*`, `--brand-gold-*`)
and the mark lives in `components/Logo.tsx` — replace both once the
official logo is available.

## Content placeholders

The featured projects on `/projects` and the home page (capacities,
locations, descriptions) are illustrative placeholders for the site
template. Replace `lib/projects.ts` and the `projectsSection.items.*` /
`projectsPage` keys in `messages/ar.json` and `messages/en.json` with the
company's real project data and photos.

## Tech stack

- Next.js 16 (App Router, Turbopack)
- TypeScript
- Tailwind CSS v4
- `next-intl` (Arabic/English routing, RTL/LTR)
- Stripe (Checkout Sessions)
- `lucide-react` icons
