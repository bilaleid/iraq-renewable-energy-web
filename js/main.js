/* ==========================================================================
   Maslak Koru — Marketing site logic
   ========================================================================== */

/* ============================================================
   إعدادات قابلة للتعديل — عدّل القيم التالية قبل نشر الموقع
   ============================================================ */
const SITE_CONFIG = {
  // رقم واتساب فريق المبيعات، بصيغة دولية بدون علامة + وبدون فراغات (مثال: "905XXXXXXXXX")
  WHATSAPP_NUMBER: "905000000000",

  // رسالة افتراضية تُرسل تلقائياً عند الضغط على أزرار واتساب في الموقع
  WHATSAPP_DEFAULT_MESSAGE: "مرحباً، أرغب بالاستفسار عن مشروع ماسلاك كورو (Maslak Koru).",

  // البريد الإلكتروني وهاتف التواصل الظاهران في الموقع
  CONTACT_EMAIL: "info@example.com",
  CONTACT_PHONE_DISPLAY: "+90 5XX XXX XX XX",
  CONTACT_PHONE_TEL: "+905000000000",

  // ============================================================
  // نقطة الربط مع وكيل الذكاء الاصطناعي / نظام إدارة العملاء (CRM)
  // ============================================================
  // ضع هنا رابط الـ Webhook الخاص بوكيل الذكاء الاصطناعي أو نظام CRM
  // (مثال: رابط من n8n، Make، Zapier، أو نقطة API خاصة بك).
  // سيتم إرسال بيانات كل نموذج وكل رسالة محادثة إلى هذا الرابط بصيغة JSON عبر POST.
  // اتركه فارغاً "" إن لم يكن جاهزاً بعد — سيستمر الموقع بالعمل عبر واتساب كخطة بديلة.
  LEAD_WEBHOOK_URL: "",

  // رابط Webhook منفصل لرسائل مربع المحادثة (اتركه فارغاً لاستخدام نفس LEAD_WEBHOOK_URL)
  CHAT_WEBHOOK_URL: "",
};

/* ============================================================
   أدوات مساعدة
   ============================================================ */
function buildWhatsAppLink(message) {
  const text = encodeURIComponent(message || SITE_CONFIG.WHATSAPP_DEFAULT_MESSAGE);
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
    console.warn("تعذّر الوصول إلى نقطة الربط (webhook):", err);
    return { ok: false, error: err };
  }
}

/* ============================================================
   تهيئة روابط واتساب والتواصل
   ============================================================ */
function wireContactLinks() {
  const waLink = buildWhatsAppLink();
  document.querySelectorAll("#hero-whatsapp, #floating-whatsapp, #contact-whatsapp-link").forEach((el) => {
    el.href = waLink;
  });

  const phoneLink = document.getElementById("contact-phone-link");
  if (phoneLink) {
    phoneLink.href = `tel:${SITE_CONFIG.CONTACT_PHONE_TEL}`;
    phoneLink.textContent = SITE_CONFIG.CONTACT_PHONE_DISPLAY;
  }
  const emailLink = document.getElementById("contact-email-link");
  if (emailLink) {
    emailLink.href = `mailto:${SITE_CONFIG.CONTACT_EMAIL}`;
    emailLink.textContent = SITE_CONFIG.CONTACT_EMAIL;
  }
}

/* ============================================================
   الهيدر: ظل عند التمرير + قائمة الجوال
   ============================================================ */
function initHeader() {
  const header = document.getElementById("site-header");
  const toggle = document.getElementById("nav-toggle");
  const nav = document.getElementById("main-nav");

  window.addEventListener("scroll", () => {
    header.classList.toggle("scrolled", window.scrollY > 10);
  });

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

/* ============================================================
   ظهور العناصر عند التمرير (Scroll reveal)
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
   عدّاد الأرقام في قسم الإحصائيات
   ============================================================ */
function initCounters() {
  const counters = document.querySelectorAll(".stat-num");
  if (!counters.length) return;

  const animate = (el) => {
    const target = parseInt(el.dataset.count, 10) || 0;
    const duration = 1400;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased).toLocaleString("en-US");
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target.toLocaleString("en-US");
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
   نافذة عرض الصور (Lightbox)
   ============================================================ */
function initLightbox() {
  const lightbox = document.getElementById("lightbox");
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
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) close();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !lightbox.hidden) close();
  });
}

/* ============================================================
   نموذج التواصل (Lead Form)
   ============================================================ */
function initLeadForm() {
  const form = document.getElementById("lead-form");
  const status = document.getElementById("form-status");
  const submitBtn = document.getElementById("lead-submit");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const data = {
      source: "maslak-koru-website",
      type: "lead_form",
      name: form.name.value.trim(),
      phone: form.phone.value.trim(),
      email: form.email.value.trim(),
      unit_type: form.unit_type.value,
      message: form.message.value.trim(),
      page_url: window.location.href,
      submitted_at: new Date().toISOString(),
    };

    if (!data.name || !data.phone || !form.consent.checked) {
      status.textContent = "يرجى تعبئة الاسم ورقم الهاتف والموافقة على التواصل قبل الإرسال.";
      status.className = "form-note error";
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "جارٍ الإرسال...";

    // 1) نحاول إرسال الطلب مباشرة إلى وكيل الذكاء الاصطناعي / نظام CRM (إن كان مُفعّلاً)
    await postToWebhook(SITE_CONFIG.LEAD_WEBHOOK_URL, data);

    // 2) كخطة بديلة مضمونة، نفتح محادثة واتساب معبأة ببيانات الطلب حتى لا تُفقد أي فرصة عميل
    const waMessage =
      `طلب استفسار جديد عن ماسلاك كورو:\n` +
      `الاسم: ${data.name}\n` +
      `الهاتف: ${data.phone}\n` +
      (data.email ? `البريد: ${data.email}\n` : "") +
      (data.unit_type ? `نوع الشقة: ${data.unit_type}\n` : "") +
      (data.message ? `الرسالة: ${data.message}` : "");

    status.textContent = "تم استلام طلبك بنجاح، سيتواصل معك فريقنا في أقرب وقت. سيتم فتح واتساب لتأكيد استفسارك.";
    status.className = "form-note success";
    submitBtn.disabled = false;
    submitBtn.textContent = "إرسال الطلب";
    form.reset();

    window.open(buildWhatsAppLink(waMessage), "_blank", "noopener");
  });
}

/* ============================================================
   مربع محادثة المساعد الذكي (واجهة جاهزة للربط بوكيل ذكاء اصطناعي)
   ============================================================ */
function initChatWidget() {
  const toggle = document.getElementById("chat-toggle");
  const panel = document.getElementById("chat-panel");
  const messages = document.getElementById("chat-messages");
  const chatForm = document.getElementById("chat-form");
  const chatInput = document.getElementById("chat-input");
  if (!toggle) return;

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
      source: "maslak-koru-website",
      type: "chat_message",
      message: text,
      page_url: window.location.href,
      submitted_at: new Date().toISOString(),
    };

    // نرسل رسالة المستخدم إلى وكيل الذكاء الاصطناعي عبر الـ webhook المخصص للمحادثة
    const webhookUrl = SITE_CONFIG.CHAT_WEBHOOK_URL || SITE_CONFIG.LEAD_WEBHOOK_URL;
    const result = await postToWebhook(webhookUrl, payload);

    // TODO عند ربط وكيل الذكاء الاصطناعي: استبدل الرد التالي بالرد الفعلي القادم من الوكيل
    // (سواء عبر استجابة الـ fetch أعلاه، أو عبر WebSocket/Server-Sent Events لاحقاً).
    if (result.ok) {
      appendMessage("تم إرسال رسالتك، سيتم الرد عليك خلال لحظات.", "bot");
    } else {
      appendMessage(
        "شكراً لتواصلك! سيتم تفعيل الرد الفوري هنا قريباً. بإمكانك أيضاً التواصل معنا مباشرة عبر واتساب لتلقي رد أسرع.",
        "bot"
      );
    }
  });
}

/* ============================================================
   التهيئة العامة
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
