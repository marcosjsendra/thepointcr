# Resend + Namecheap DNS Handoff

## Context

We configured **Resend** for the domain:

```txt
thepointcr.com
```

The domain is registered / DNS-managed in **Namecheap**.

Resend was added to allow the project/app to send transactional or contact-form emails using the domain.

---

## Current Status

✅ **Domain verified in Resend**

Resend now shows:

```txt
Domain verified: Your domain is ready to send emails.
```

Timeline shown in Resend:

```txt
Domain added: Jul 04, 7:33 AM
DNS verified: Jul 04, 7:48 AM
Domain verified: Jul 04, 7:50 AM
```

So the DNS setup is working.

---

## DNS Records Added

### 1. DKIM Record

Added in Namecheap under:

```txt
Advanced DNS → Host Records
```

Record:

```txt
Type: TXT Record
Host: resend._domainkey
Value: Resend-generated DKIM public key
TTL: Automatic
```

Resend shows this record as verified.

---

### 2. SPF Record

Added in Namecheap under:

```txt
Advanced DNS → Host Records
```

Record:

```txt
Type: TXT Record
Host: send
Value: v=spf1 include:amazonses.com ~all
TTL: Automatic
```

Resend shows this record as verified.

This authorizes Amazon SES / Resend to send email for the `send.thepointcr.com` subdomain.

---

### 3. MX Record

This was the confusing part.

In Namecheap, the MX record is **not added from the normal Host Records dropdown**. It is added under:

```txt
Advanced DNS → Mail Settings
```

The Mail Settings dropdown was changed to:

```txt
Custom MX
```

Then this record was added:

```txt
Type: MX Record
Host: send
Value: Resend-generated feedback-smtp...ses.com value
Priority: 10
TTL: Automatic
```

Important detail:

```txt
Host should be: send
```

Not:

```txt
send.thepointcr.com
```

Namecheap appends the domain automatically.

Resend shows the MX record as verified.

---

### 4. DMARC Record

Added in Namecheap under:

```txt
Advanced DNS → Host Records
```

Record:

```txt
Type: TXT Record
Host: _dmarc
Value: v=DMARC1; p=none;
TTL: Automatic
```

Resend shows this record as verified.

This is currently a permissive monitoring-style DMARC policy.

---

## Important Notes

### Resend can now send emails

The domain is ready to send emails through Resend.

Example sender addresses that can be used:

```txt
hello@thepointcr.com
info@thepointcr.com
noreply@thepointcr.com
```

However, these are only valid for **sending** through Resend.

---

### Resend does not create inboxes

This setup does **not** create mailboxes/inboxes.

For example:

```txt
hello@thepointcr.com
```

can be used as a `from` address in Resend, but replies will not be received unless there is actual mailbox hosting configured for that address/domain.

Recommended app setup:

```txt
From: The Point CR <hello@thepointcr.com>
Reply-To: real-inbox@example.com
```

Replace `real-inbox@example.com` with the actual inbox that should receive replies.

---

## Suggested App / Codex Implementation

### This Project's Environment Variables

This repository already expects these names in `server.js`:

```env
CONTACT_TO=info@thepointcr.com
RESEND_API_KEY=your_resend_api_key_here
CONTACT_FROM=The Point CR <hello@thepointcr.com>
```

Add those values in Vercel for **Production and Preview**.

Do not use `EMAIL_FROM` or `EMAIL_REPLY_TO` unless the application code is changed later to read those names.

### Environment Variables

Add something like this to the project `.env`:

```env
RESEND_API_KEY=your_resend_api_key_here
EMAIL_FROM="The Point CR <hello@thepointcr.com>"
EMAIL_REPLY_TO="your-real-inbox@example.com"
```

Use the real inbox for `EMAIL_REPLY_TO`.

---

## Suggested Resend Sending Setup

Example expected email configuration:

```ts
from: process.env.EMAIL_FROM,
replyTo: process.env.EMAIL_REPLY_TO,
to: recipientEmail,
subject: "Message from The Point CR",
```

The important part is that `from` uses the verified domain:

```txt
@thepointcr.com
```

---

## Recommended Next Steps

1. Send a test email from Resend.
2. Test delivery to:
   - Gmail
   - Outlook / Hotmail
   - One personal or business inbox
3. Check if it lands in inbox or spam.
4. Confirm replies go to the correct `Reply-To` inbox.
5. If deliverability looks good, connect Resend to the app/contact form.

---

## Current Risk / Watch Item

Because Namecheap Mail Settings is now set to:

```txt
Custom MX
```

make sure this does not interfere with any existing mailbox setup for the root domain.

The Resend MX is for:

```txt
send.thepointcr.com
```

not:

```txt
thepointcr.com
```

So the Resend record itself should not conflict with root-domain email.

But if the domain previously used Namecheap Private Email, Gmail Workspace, DreamHost mail, etc., verify that the root domain mail records are still configured correctly.

---

## Final Status

```txt
Domain: thepointcr.com
Provider: Namecheap
Email service: Resend
Region: North Virginia / us-east-1
Status: Verified
Ready to send: Yes
Inbox hosting configured: Not confirmed
```
