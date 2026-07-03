# The Point Website

Brochure website for The Point, a Liberia printshop and signage studio.

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Contact Form

The contact forms post to `POST /api/contact`. In development, if no delivery provider is configured, submissions are validated and logged to the terminal.

For production, configure one delivery option:

- Resend: `RESEND_API_KEY`, `CONTACT_FROM`, and optionally `CONTACT_TO`.
- Webhook: `CONTACT_WEBHOOK_URL`, and optionally `CONTACT_TO`.

Copy `.env.example` to `.env` for local testing.

## Railway

Railway can deploy this folder as a Node app. The start command is:

```bash
npm start
```

The health endpoint is `/health`.

## Project Context

- `PRODUCT.md` defines the audience, purpose, brand personality, and modernization guardrails.
- `DESIGN.md` captures the visual direction and existing design tokens.
