# To-Do: Replace HostFast Email Services

## Current Safe State

The website and contact form no longer depend on HostFast.

- Website hosting: Vercel
- Domain/DNS: Namecheap BasicDNS
- Contact form sending: Resend
- Vercel contact recipient: `infothepoints@gmail.com`
- Resend sender: `The Point CR <hello@thepointcr.com>`

This means contact form submissions are sent directly to Gmail through Resend, instead of relying on `info@thepointcr.com` forwarding through HostFast/cPanel.

## What Still Depends On HostFast

HostFast/cPanel still has old email accounts/forwarders:

- `info@thepointcr.com`
- `facturas@thepointcr.com`

Those should eventually be replaced before the HostFast plan expires.

## Why Namecheap Free Redirect Email Was Not Used

Namecheap free Redirect Email requires switching Mail Settings to `Email Forwarding`.

That conflicts with the current custom mail DNS setup needed to keep Resend fully verified, especially the Resend MX record for the `send.thepointcr.com` subdomain:

```txt
MX send -> feedback-smtp.us-east-1.amazonses.com
```

For now, keep Mail Settings as `Custom MX` and keep the Resend records in place.

## Clean Replacement Options

### Option A: Namecheap Private Email

Best low-cost replacement if the business wants real domain inboxes.

Use for:

- `info@thepointcr.com`
- `facturas@thepointcr.com`

Then keep Resend only for website/contact-form sending.

### Option B: Google Workspace

Best professional long-term option.

Use for full mailbox hosting, better deliverability, calendars, shared access, and business account management.

Then keep Resend only for transactional/contact-form sending.

### Option C: Gmail Destinations Only

Cheapest setup.

Keep using Gmail addresses directly:

- Contact form -> `infothepoints@gmail.com`
- Invoice/accounting messages -> `thepointfacturas@gmail.com`

This avoids HostFast but does not provide real `@thepointcr.com` inboxes.

## Recommended Future Step

Before HostFast expires, choose either:

1. Namecheap Private Email for a simple/low-cost replacement.
2. Google Workspace for a more robust business email setup.

After choosing the new mailbox provider, update Namecheap DNS MX records according to that provider's instructions and test:

- Incoming mail to `info@thepointcr.com`
- Incoming mail to `facturas@thepointcr.com`
- Replies from website contact messages
- Resend domain verification status
