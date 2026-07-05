# Project Progress

Last updated: July 5, 2026

## Overview

The old Webflow-era brochure website for The Point was modernized, moved into GitHub, deployed to Vercel, connected to the custom domain, and wired to send contact form submissions through Resend.

Current live site:

- Production domain: `https://www.thepointcr.com`
- Apex redirect: `https://thepointcr.com` -> `https://www.thepointcr.com`
- Vercel preview/origin: `https://thepointcr.vercel.app`
- GitHub repository: `marcosjsendra/thepointcr`

## Completed Work

### Website Refactor

- Cleaned up the legacy Webflow export while preserving the original visual identity.
- Added project documentation:
  - `PRODUCT.md`
  - `DESIGN.md`
  - README deployment notes
- Replaced the old Webflow runtime dependency with a small local `main.js`.
- Improved navigation behavior, mobile menu behavior, form behavior, and accessibility states.
- Reworked the portfolio/showcase section:
  - Five visible cards on desktop
  - Smooth expansion on hover/focus
  - Fully visible stacked cards on smaller/touch screens
- Added responsive and accessibility polish while keeping the existing brand direction.

### Backend Contact Endpoint

- Added a small contact endpoint for form submissions.
- Local Node server supports:
  - Static file serving
  - `/api/contact`
  - `/health`
- Vercel deployment uses a platform-native serverless function:
  - `api/contact.js`
- Contact form validates required fields and basic email format.
- Bot honeypot protection is included.
- Rate limiting is included.

### GitHub

- Initialized Git in `web/`.
- Added `.gitignore` and `.gitattributes`.
- Pushed the project to:
  - `https://github.com/marcosjsendra/thepointcr`

### Vercel Deployment

- Deployed the project to Vercel.
- Fixed the initial static asset issue by switching to the correct Vercel-native shape:
  - Static files served from repo root
  - `api/contact.js` handles contact submissions
  - `vercel.json` controls deployment behavior
- Verified:
  - HTML loads
  - CSS loads
  - JS loads
  - Assets load
  - `/api/contact` validates input

### Domain And DNS

- Connected Namecheap-managed domain to Vercel.
- Added Vercel DNS records in Namecheap:

```txt
A @ -> 216.198.79.1
CNAME www -> ffdf77e53a074dd7.vercel-dns-017.com
```

- Verified both custom domains in Vercel:
  - `thepointcr.com`
  - `www.thepointcr.com`
- Confirmed apex redirects to `www`.

### Resend

- Configured Resend for `thepointcr.com`.
- Domain verified in Resend.
- Namecheap DNS includes Resend records for sending:
  - DKIM TXT
  - SPF TXT for `send`
  - MX for `send.thepointcr.com`
  - DMARC TXT
- Vercel environment variables were configured:

```env
RESEND_API_KEY=...
CONTACT_FROM=The Point CR <hello@thepointcr.com>
CONTACT_TO=infothepoints@gmail.com
```

- Contact form test reached Resend successfully.
- Resend showed the email as sent.

### Vercel Analytics

- Installed `@vercel/analytics`.
- Added Vercel Web Analytics script to:
  - `index.html`
  - `que-hacemos.html`
  - `pages/gracias.html`
  - `pages/politica.html`
- Verified the analytics script loads from the live domain.

## Current Safe State

The website and contact form no longer depend on HostFast.

Current production flow:

```txt
Visitor -> thepointcr.com -> Vercel -> /api/contact -> Resend -> infothepoints@gmail.com
```

This bypasses HostFast/cPanel for website hosting and contact form delivery.

## Still Missing

HostFast/cPanel still appears to contain the old email accounts/forwarders:

- `info@thepointcr.com`
- `facturas@thepointcr.com`

Those should be replaced before the HostFast hosting plan expires.

## Recommended Email Replacement

Best recommendation: buy **Namecheap Private Email** for the real domain mailboxes.

Suggested mailboxes:

- `info@thepointcr.com`
- `facturas@thepointcr.com`

Why this is the best next step:

- Lower cost than Google Workspace.
- Clean replacement for HostFast/cPanel email.
- Keeps domain email under the same provider already managing DNS.
- Allows Resend to remain dedicated to website/contact-form sending.

Alternative: Google Workspace, if the business wants a more robust long-term suite with Gmail, Calendar, Drive, and account management.

Temporary lowest-cost state: continue sending the website form directly to `infothepoints@gmail.com`, but this does not replace real `@thepointcr.com` inboxes.

More detail is documented in:

- `docs/To-Dos/replace-hostfast-email.md`

## Suggested Next Steps

1. Keep current Vercel + Resend setup as-is.
2. Buy Namecheap Private Email when ready to fully leave HostFast email.
3. Create the real mailboxes:
   - `info@thepointcr.com`
   - `facturas@thepointcr.com`
4. Update Namecheap MX records according to Namecheap Private Email instructions.
5. Test incoming mail to both addresses.
6. Confirm Resend still shows the sending domain as verified.
7. Once email is verified, cancel/let expire the HostFast hosting service.

## Simple Client Explanation

We updated the website so it is no longer just an old exported Webflow/static site sitting on traditional hosting. The design and identity were preserved, but the underlying code was cleaned, organized, and made easier to maintain.

The website was moved into GitHub, which gives us a proper version history and a safer way to keep improving it over time. Any future changes can now be tracked, reviewed, and restored if needed.

The site was then deployed to Vercel, a modern hosting platform. This makes the website faster to deploy, easier to maintain, and less dependent on the old HostFast/cPanel hosting environment.

The contact form was also modernized. Instead of relying on old hosting mail behavior, the form now sends messages through Resend, a dedicated email delivery service. This gives us a cleaner and more reliable setup for receiving website inquiries.

We also added project documentation:

- `PRODUCT.md` explains what the website is for, who it serves, and what business goals it supports.
- `DESIGN.md` documents the design direction and visual identity.

These documents make the project easier to continue in the future, even with another developer or another AI/LLM tool, because the product context and design rules are clearly written down.

In short, the website now has a more modern technical foundation, cleaner deployment, better contact-form delivery, and clearer documentation for future growth.
