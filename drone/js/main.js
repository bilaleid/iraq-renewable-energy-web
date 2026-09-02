/* ==========================================================================
   FLYZONE — HUR-UAV-01 marketing site logic
   ========================================================================== */

/* ============================================================
   Editable settings — update before/after publishing
   ============================================================ */
const SITE_CONFIG = {
  WHATSAPP_NUMBER: "905366976222",
  CONTACT_EMAIL: "flyzoneproteam@gmail.com",
  CONTACT_PHONE_DISPLAY: "+90 536 697 62 22",
  CONTACT_PHONE_TEL: "+905366976222",

  // ============================================================
  // AI sales agent / CRM connection point
  // ============================================================
  // Paste the AI agent's / CRM's webhook URL here once it is ready
  // (e.g. from n8n, Make, Zapier, or your own API endpoint).
  // Every form submission and chat-widget message will be POSTed here as JSON.
  // Leave empty "" until then — the site keeps working via WhatsApp as the fallback.
  LEAD_WEBHOOK_URL: "",
  CHAT_WEBHOOK_URL: "",
};

const WHATSAPP_MESSAGES = {
  ar: "مرحباً فلاي زون، أرغب بالاستفسار عن منظومة الدرون HUR-UAV-01.",
  tr: "Merhaba FLYZONE, HUR-UAV-01 insansız hava aracı hakkında bilgi almak istiyorum.",
  en: "Hello FLYZONE, I'd like to learn more about the HUR-UAV-01 UAV.",
};

function currentLang() {
  return document.documentElement.lang === "tr" ? "tr" : document.documentElement.lang === "en" ? "en" : "ar";
}

function buildWhatsAppLink(message) {
  const text = encodeURIComponent(message || WHATSAPP_MESSAGES[currentLang()]);
  return `https://wa.me/${SITE_CONFIG.WHATSAPP_NUMBER}?text=${text}`;
}

async function postToWebhook(url, payload) {
  if (!url) return { ok: false, skipped: true };
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return { ok: res.ok };
  } catch (err) {
    console.warn("Webhook unreachable:", err);
    return { ok: false, error: err };
  }
}

/* ============================================================
   Contact links
   ============================================================ */
function wireContactLinks() {
  const waLink = buildWhatsAppLink();
  document.querySelectorAll("[data-whatsapp-link]").forEach((el) => { el.href = waLink; });

  document.querySelectorAll("[data-phone-link]").forEach((el) => {
    el.href = `tel:${SITE_CONFIG.CONTACT_PHONE_TEL}`;
    if (el.dataset.phoneLink === "text") el.textContent = SITE_CONFIG.CONTACT_PHONE_DISPLAY;
  });
  document.querySelectorAll("[data-email-link]").forEach((el) => {
    el.href = `mailto:${SITE_CONFIG.CONTACT_EMAIL}`;
    if (el.dataset.emailLink === "text") el.textContent = SITE_CONFIG.CONTACT_EMAIL;
  });
}

/* ============================================================
   Header: scroll shadow + mobile nav
   ============================================================ */
function initHeader() {
  const header = document.getElementById("site-header");
  const toggle = document.getElementById("nav-toggle");
  const nav = document.getElementById("main-nav");
  if (!header) return;

  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 10);
  });

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!expanded));
      nav.classList.toggle("open", !expanded);
    });
    nav.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        toggle.setAttribute("aria-expanded", "false");
        nav.classList.remove("open");
      });
    });
  }
}

/* ============================================================
   Scroll reveal
   ============================================================ */
function initReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("in-view"));
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  items.forEach((el) => observer.observe(el));
}

/* ============================================================
   Number counters — supports decimals via data-decimals
   ============================================================ */
function initCounters() {
  const counters = document.querySelectorAll("[data-count]");
  if (!counters.length) return;

  const animate = (el) => {
    const target = parseFloat(el.dataset.count) || 0;
    const decimals = parseInt(el.dataset.decimals || "0", 10);
    const duration = 1200;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = (target * eased).toFixed(decimals);
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target.toFixed(decimals);
    }
    requestAnimationFrame(tick);
  };

  if (!("IntersectionObserver" in window)) {
    counters.forEach(animate);
    return;
  }
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );
  counters.forEach((el) => observer.observe(el));
}

/* ============================================================
   Gallery lightbox
   ============================================================ */
function initLightbox() {
  const lightbox = document.getElementById("lightbox");
  if (!lightbox) return;
  const img = document.getElementById("lightbox-img");
  const caption = document.getElementById("lightbox-caption");
  const closeBtn = document.getElementById("lightbox-close");

  document.querySelectorAll(".gallery-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      img.src = btn.dataset.full;
      img.alt = btn.querySelector("img")?.alt || "";
      caption.textContent = btn.dataset.caption || "";
      lightbox.hidden = false;
      document.body.style.overflow = "hidden";
    });
  });

  function close() {
    lightbox.hidden = true;
    img.src = "";
    document.body.style.overflow = "";
  }

  closeBtn.addEventListener("click", close);
  lightbox.addEventListener("click", (e) => { if (e.target === lightbox) close(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !lightbox.hidden) close(); });
}

/* ============================================================
   Lead form
   ============================================================ */
function initLeadForm() {
  const form = document.getElementById("lead-form");
  const status = document.getElementById("form-status");
  const submitBtn = document.getElementById("lead-submit");
  if (!form) return;

  const t = form.dataset.i18n ? JSON.parse(form.dataset.i18n) : {};

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      source: "flyzone-hur-uav-01-website",
      type: "lead_form",
      lang: currentLang(),
      name: form.name.value.trim(),
      organization_type: form.organization_type.value,
      phone: form.phone.value.trim(),
      email: form.email.value.trim(),
      message: form.message.value.trim(),
      page_url: window.location.href,
      submitted_at: new Date().toISOString(),
    };

    if (!data.name || !data.phone || !form.consent.checked) {
      status.textContent = t.formError || "Please fill in your name and phone, and accept to be contacted.";
      status.className = "form-note error";
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = t.sending || "Sending...";

    await postToWebhook(SITE_CONFIG.LEAD_WEBHOOK_URL, data);

    const waMessage =
      `${t.waHeader || "New inquiry about HUR-UAV-01:"}\n` +
      `${t.waName || "Name"}: ${data.name}\n` +
      `${t.waOrg || "Organization"}: ${data.organization_type}\n` +
      `${t.waPhone || "Phone"}: ${data.phone}\n` +
      (data.email ? `${t.waEmail || "Email"}: ${data.email}\n` : "") +
      (data.message ? `${t.waMessage || "Message"}: ${data.message}` : "");

    status.textContent = t.formSuccess || "Your request has been received. Our team will contact you shortly — opening WhatsApp to confirm.";
    status.className = "form-note success";
    submitBtn.disabled = false;
    submitBtn.textContent = t.submit || "Send request";
    form.reset();

    window.open(buildWhatsAppLink(waMessage), "_blank", "noopener");
  });
}

/* ============================================================
   Chat widget stub — ready for the AI sales agent
   ============================================================ */
function initChatWidget() {
  const toggle = document.getElementById("chat-toggle");
  const panel = document.getElementById("chat-panel");
  const messages = document.getElementById("chat-messages");
  const chatForm = document.getElementById("chat-form");
  const chatInput = document.getElementById("chat-input");
  if (!toggle) return;

  const t = toggle.dataset.i18n ? JSON.parse(toggle.dataset.i18n) : {};

  toggle.addEventListener("click", () => {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!expanded));
    panel.hidden = expanded;
    if (!expanded) chatInput.focus();
  });

  function appendMessage(text, role) {
    const div = document.createElement("div");
    div.className = `chat-msg ${role}`;
    div.textContent = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  chatForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (!text) return;

    appendMessage(text, "user");
    chatInput.value = "";

    const payload = {
      source: "flyzone-hur-uav-01-website",
      type: "chat_message",
      lang: currentLang(),
      message: text,
      page_url: window.location.href,
      submitted_at: new Date().toISOString(),
    };

    const webhookUrl = SITE_CONFIG.CHAT_WEBHOOK_URL || SITE_CONFIG.LEAD_WEBHOOK_URL;
    const result = await postToWebhook(webhookUrl, payload);

    if (result.ok) {
      appendMessage(t.sent || "Message sent — we'll reply shortly.", "bot");
    } else {
      appendMessage(
        t.fallback || "Thanks for reaching out! Instant replies here are coming soon. You can also message us directly on WhatsApp for a faster response.",
        "bot"
      );
    }
  });
}

/* ============================================================
   Init
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  wireContactLinks();
  initHeader();
  initReveal();
  initCounters();
  initLightbox();
  initLeadForm();
  initChatWidget();

  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
