const http = require("node:http");
const path = require("node:path");
const { readFile, stat } = require("node:fs/promises");

const rootDir = __dirname;
const port = Number(process.env.PORT || 3000);
const isProduction = process.env.NODE_ENV === "production";
const maxBodyBytes = 64 * 1024;
const rateWindowMs = 15 * 60 * 1000;
const rateMax = 5;
const rateHits = new Map();

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon",
  ".webp": "image/webp",
  ".txt": "text/plain; charset=utf-8",
  ".md": "text/markdown; charset=utf-8"
};

function send(res, status, body, headers = {}) {
  const payload = Buffer.isBuffer(body) ? body : Buffer.from(String(body));
  res.writeHead(status, {
    "Content-Length": payload.length,
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    ...headers
  });
  res.end(payload);
}

function json(res, status, payload) {
  send(res, status, JSON.stringify(payload), {
    "Content-Type": "application/json; charset=utf-8"
  });
}

function redirect(res, target) {
  res.writeHead(303, {
    Location: target,
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin"
  });
  res.end();
}

function getClientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.trim()) {
    return forwarded.split(",")[0].trim();
  }
  return req.socket.remoteAddress || "unknown";
}

function isRateLimited(ip) {
  const now = Date.now();
  const current = rateHits.get(ip) || [];
  const recent = current.filter((timestamp) => now - timestamp < rateWindowMs);
  recent.push(now);
  rateHits.set(ip, recent);
  return recent.length > rateMax;
}

async function readBody(req) {
  const chunks = [];
  let size = 0;

  for await (const chunk of req) {
    size += chunk.length;
    if (size > maxBodyBytes) {
      const error = new Error("Request body is too large.");
      error.status = 413;
      throw error;
    }
    chunks.push(chunk);
  }

  return Buffer.concat(chunks).toString("utf8");
}

function parseBody(req, rawBody) {
  const contentType = String(req.headers["content-type"] || "").split(";")[0];

  if (contentType === "application/json") {
    return JSON.parse(rawBody || "{}");
  }

  const params = new URLSearchParams(rawBody);
  return Object.fromEntries(params.entries());
}

function clean(value, maxLength = 1000) {
  return String(value || "").replace(/\s+/g, " ").trim().slice(0, maxLength);
}

function getAcceptsJson(req) {
  return String(req.headers.accept || "").includes("application/json");
}

function getLeadPayload(body) {
  return {
    name: clean(body.name || body.Nombre, 120),
    phone: clean(body.phone || body.Telefono, 80),
    email: clean(body.email || body.Correo, 180),
    message: clean(body.message || body.Mensaje || body.field, 4000),
    source: clean(body.source || reqSafePath(body._source), 180),
    company: clean(body.company, 120)
  };
}

function reqSafePath(value) {
  if (!value) return "";
  return String(value).replace(/[^\w./#-]/g, "").slice(0, 180);
}

function getRedirectTarget(value) {
  const fallback = "/pages/gracias.html";
  const target = reqSafePath(value);
  if (!target || !target.startsWith("/") || target.startsWith("//")) {
    return fallback;
  }
  return target;
}

function validateLead(lead) {
  const errors = [];
  if (!lead.name) errors.push("El nombre es requerido.");
  if (!lead.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) {
    errors.push("Un correo valido es requerido.");
  }
  if (!lead.message) errors.push("El mensaje es requerido.");
  return errors;
}

function buildEmailText(lead) {
  return [
    "Nuevo mensaje desde thepointcr.com",
    "",
    `Nombre: ${lead.name}`,
    `Correo: ${lead.email}`,
    `Telefono: ${lead.phone || "No indicado"}`,
    `Pagina: ${lead.source || "No indicada"}`,
    "",
    "Mensaje:",
    lead.message
  ].join("\n");
}

async function deliverLead(lead) {
  const to = process.env.CONTACT_TO || "info@thepointcr.com";
  const subject = `Nuevo contacto web: ${lead.name}`;

  if (process.env.RESEND_API_KEY) {
    const from = process.env.CONTACT_FROM;
    if (!from) {
      throw new Error("CONTACT_FROM is required when RESEND_API_KEY is set.");
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: lead.email,
        subject,
        text: buildEmailText(lead)
      })
    });

    if (!response.ok) {
      const detail = await response.text();
      throw new Error(`Resend delivery failed: ${response.status} ${detail}`);
    }

    return "resend";
  }

  if (process.env.CONTACT_WEBHOOK_URL) {
    const response = await fetch(process.env.CONTACT_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to, subject, lead })
    });

    if (!response.ok) {
      throw new Error(`Webhook delivery failed: ${response.status}`);
    }

    return "webhook";
  }

  if (isProduction) {
    throw new Error("No contact delivery provider configured.");
  }

  console.log("[contact:dev]", { to, subject, lead });
  return "dev-log";
}

async function handleContact(req, res) {
  const wantsJson = getAcceptsJson(req);
  const ip = getClientIp(req);

  try {
    if (isRateLimited(ip)) {
      if (wantsJson) return json(res, 429, { ok: false, error: "rate_limited" });
      return send(res, 429, "Demasiados intentos. Intente de nuevo mas tarde.", {
        "Content-Type": "text/plain; charset=utf-8"
      });
    }

    const rawBody = await readBody(req);
    const body = parseBody(req, rawBody);
    const lead = getLeadPayload(body);
    const redirectTarget = getRedirectTarget(body._redirect);

    if (lead.company) {
      if (wantsJson) return json(res, 200, { ok: true });
      return redirect(res, redirectTarget);
    }

    const errors = validateLead(lead);
    if (errors.length) {
      if (wantsJson) return json(res, 400, { ok: false, errors });
      return send(res, 400, errors.join(" "), {
        "Content-Type": "text/plain; charset=utf-8"
      });
    }

    const delivery = await deliverLead(lead);
    if (wantsJson) return json(res, 200, { ok: true, delivery });
    return redirect(res, redirectTarget);
  } catch (error) {
    const status = error.status || 500;
    console.error("[contact:error]", error);
    if (wantsJson) {
      return json(res, status, {
        ok: false,
        error: status === 500 ? "delivery_failed" : error.message
      });
    }
    return send(res, status, "No pudimos enviar el mensaje. Intente de nuevo en unos minutos.", {
      "Content-Type": "text/plain; charset=utf-8"
    });
  }
}

async function serveStatic(req, res) {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  let pathname = decodeURIComponent(url.pathname);

  if (pathname === "/") pathname = "/index.html";
  if (pathname.endsWith("/")) pathname += "index.html";

  const filePath = path.resolve(rootDir, `.${pathname}`);
  if (!filePath.startsWith(rootDir)) {
    return send(res, 403, "Forbidden", { "Content-Type": "text/plain; charset=utf-8" });
  }

  try {
    const info = await stat(filePath);
    if (!info.isFile()) throw new Error("Not a file");

    const file = await readFile(filePath);
    const extension = path.extname(filePath).toLowerCase();
    const isAsset = pathname.startsWith("/assets/");
    send(res, 200, file, {
      "Content-Type": mimeTypes[extension] || "application/octet-stream",
      "Cache-Control": isAsset ? "public, max-age=31536000, immutable" : "no-cache"
    });
  } catch {
    send(res, 404, "Not Found", { "Content-Type": "text/plain; charset=utf-8" });
  }
}

const server = http.createServer(async (req, res) => {
  if (req.method === "GET" && req.url === "/health") {
    return json(res, 200, { ok: true });
  }

  if (req.url && req.url.startsWith("/api/contact")) {
    if (req.method === "POST") return handleContact(req, res);
    return send(res, 405, "Method Not Allowed", {
      Allow: "POST",
      "Content-Type": "text/plain; charset=utf-8"
    });
  }

  if (req.method === "GET" || req.method === "HEAD") {
    return serveStatic(req, res);
  }

  return send(res, 405, "Method Not Allowed", {
    "Content-Type": "text/plain; charset=utf-8"
  });
});

server.listen(port, () => {
  console.log(`The Point website running on http://localhost:${port}`);
});
