const maxBodyBytes = 64 * 1024;
const rateWindowMs = 15 * 60 * 1000;
const rateMax = 5;
const rateHits = new Map();

function getClientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.trim()) {
    return forwarded.split(",")[0].trim();
  }
  return req.socket?.remoteAddress || "unknown";
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

function reqSafePath(value) {
  if (!value) return "";
  return String(value).replace(/[^\w./#-]/g, "").slice(0, 180);
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
  const from = process.env.CONTACT_FROM;
  const subject = `Nuevo contacto web: ${lead.name}`;

  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is required.");
  }

  if (!from) {
    throw new Error("CONTACT_FROM is required.");
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

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).send("Method Not Allowed");
  }

  const wantsJson = String(req.headers.accept || "").includes("application/json");
  const redirectJson = (status, payload) => res.status(status).json(payload);

  try {
    if (isRateLimited(getClientIp(req))) {
      if (wantsJson) return redirectJson(429, { ok: false, error: "rate_limited" });
      return res.status(429).send("Demasiados intentos. Intente de nuevo mas tarde.");
    }

    const rawBody = await readBody(req);
    const body = parseBody(req, rawBody);
    const lead = getLeadPayload(body);
    const redirectTarget = getRedirectTarget(body._redirect);

    if (lead.company) {
      if (wantsJson) return redirectJson(200, { ok: true });
      res.writeHead(303, { Location: redirectTarget });
      return res.end();
    }

    const errors = validateLead(lead);
    if (errors.length) {
      if (wantsJson) return redirectJson(400, { ok: false, errors });
      return res.status(400).send(errors.join(" "));
    }

    const delivery = await deliverLead(lead);
    if (wantsJson) return redirectJson(200, { ok: true, delivery });
    res.writeHead(303, { Location: redirectTarget });
    return res.end();
  } catch (error) {
    console.error("[contact:error]", error);
    if (wantsJson) return redirectJson(500, { ok: false, error: "delivery_failed" });
    return res.status(500).send("No pudimos enviar el mensaje. Intente de nuevo en unos minutos.");
  }
};
