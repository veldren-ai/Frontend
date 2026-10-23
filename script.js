document.querySelectorAll(".toggle-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".toggle-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const plan = btn.dataset.plan;
    document.querySelectorAll(".price").forEach((p) => {
      const amount = Number(p.dataset[plan]);
      p.textContent = "$" + amount.toLocaleString("en-US");
    });
    document.querySelectorAll(".period").forEach((p) => {
      p.textContent = "per month";
    });
    document.querySelectorAll(".price-note[data-annual]").forEach((note) => {
      const text = note.dataset[plan] || "";
      note.textContent = text;
      note.hidden = text.length === 0;
    });
    document.querySelectorAll(".pay-link").forEach((link) => {
      const next = link.dataset[plan];
      if (next) link.href = next;
    });
  });
});

const testimonials = [
  {
    name: "Emily Johnson",
    role: "Plant Manager, discrete manufacturing",
    avatar: "emily-johnson.png",
    text: "We finally have one record for the line: which assets are healthy, which alerts are still open, and which work order is already in motion.",
  },
  {
    name: "Sophia Williams",
    role: "Reliability Engineer",
    avatar: "sophia-williams.png",
    text: "Anomalies get reviewed before they become downtime. The finding, the asset history, and the maintenance action stay together.",
  },
  {
    name: "James Anderson",
    role: "IoT Engineer",
    avatar: "james-anderson.png",
    text: "Signal summaries and model outputs are tied to a real asset, so a detection can be checked instead of lost in another tool.",
  },
];
let current = 0;
const card = document.getElementById("testimonialCard");
function showTestimonial(i) {
  current = (i + testimonials.length) % testimonials.length;
  card.style.opacity = 0;
  setTimeout(() => {
    const t = testimonials[current];
    document.getElementById("tName").textContent = t.name;
    document.getElementById("tRole").textContent = t.role;
    const avatar = document.getElementById("tAvatar");
    avatar.src = t.avatar;
    avatar.alt = t.name;
    document.getElementById("tText").textContent = t.text;
    card.style.opacity = 1;
  }, 250);
}
document.getElementById("prevBtn").addEventListener("click", () => showTestimonial(current - 1));
document.getElementById("nextBtn").addEventListener("click", () => showTestimonial(current + 1));

const navWrap = document.getElementById("navWrap");
const siteNav = document.getElementById("siteNav");
const siteLinks = document.getElementById("siteLinks");
const siteToggle = document.getElementById("siteToggle");
const progress = document.getElementById("scrollProgress");
const navAnchors = [...document.querySelectorAll(".site-links a[data-nav]")];
const navSections = navAnchors
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

function setActiveNav() {
  const mark = window.scrollY + 140;
  let current = navSections[0];
  navSections.forEach((section) => {
    if (section.offsetTop <= mark) current = section;
  });
  navAnchors.forEach((link) => {
    link.classList.toggle("is-active", current && link.getAttribute("href") === `#${current.id}`);
  });
}

function onScroll() {
  navWrap?.classList.toggle("scrolled", window.scrollY > 40);
  siteNav?.classList.toggle("is-scrolled", window.scrollY > 12);
  setActiveNav();
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = (window.scrollY / max) * 100 + "%";
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

siteToggle?.addEventListener("click", () => {
  const open = siteLinks.classList.toggle("is-open");
  siteToggle.setAttribute("aria-expanded", String(open));
  siteToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  siteToggle.innerHTML = `<i class="fa-solid ${open ? "fa-xmark" : "fa-bars"}"></i>`;
});
siteLinks?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", (event) => {
    if (link.getAttribute("href") === "#") event.preventDefault();
    siteLinks.classList.remove("is-open");
    siteToggle?.setAttribute("aria-expanded", "false");
    siteToggle?.setAttribute("aria-label", "Open menu");
    if (siteToggle) siteToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
  });
});

function animateCounter(el) {
  const target = +el.dataset.target;
  const start = performance.now();
  const duration = 1800;
  function tick(now) {
    const p = Math.min((now - start) / duration, 1);
    el.textContent = Math.floor(target * (1 - Math.pow(1 - p, 3)));
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      setTimeout(() => (entry.target.style.transitionDelay = "0s"), 1400);
      entry.target.querySelectorAll(".counter").forEach(animateCounter);
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.15 }
);
document.querySelectorAll(".faq-item").forEach((item) => {
  const btn = item.querySelector(".faq-q");
  btn.addEventListener("click", () => {
    const willOpen = !item.classList.contains("open");
    document.querySelectorAll(".faq-item").forEach((el) => {
      el.classList.remove("open");
      el.querySelector(".faq-q").setAttribute("aria-expanded", "false");
    });
    if (willOpen) {
      item.classList.add("open");
      btn.setAttribute("aria-expanded", "true");
    }
  });
});

const contactForm = document.getElementById("contactForm");
const contactNote = document.getElementById("contactNote");
const contactCaptcha = document.getElementById("contactCaptcha");
const FORMSPREE_URL = "https://formspree.io/f/mnpjgyby";
const RECAPTCHA_SITE_KEY = "6LfC5e4tAAAAAEJ9dIthAZn47DGnrlhVKPNLu2QX";
let contactCaptchaId = null;

function mountContactCaptcha() {
  if (!contactCaptcha || contactCaptchaId !== null || !window.grecaptcha) return;
  window.grecaptcha.ready(() => {
    if (contactCaptchaId !== null) return;
    contactCaptchaId = window.grecaptcha.render(contactCaptcha, {
      sitekey: RECAPTCHA_SITE_KEY,
    });
  });
}

if (contactCaptcha) {
  window.addEventListener("contact-captcha-ready", mountContactCaptcha);
  mountContactCaptcha();
}

contactForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const fields = [...contactForm.querySelectorAll("input, textarea, select")].filter(
    (field) => field.name !== "g-recaptcha-response"
  );
  let valid = true;
  fields.forEach((field) => {
    const emptyRequired = field.required && !field.value.trim();
    const badEmail = field.type === "email" && field.value && !field.checkValidity();
    field.classList.toggle("invalid", emptyRequired || badEmail);
    if (emptyRequired || badEmail) valid = false;
  });
  const captchaToken = contactCaptchaId === null ? "" : window.grecaptcha.getResponse(contactCaptchaId);
  if (!valid || !captchaToken) {
    contactNote.hidden = false;
    contactNote.classList.add("is-error");
    contactNote.textContent = !valid
      ? "Please complete the required fields with a valid email."
      : "Please confirm you are not a robot.";
    return;
  }

  const submitButton = contactForm.querySelector('button[type="submit"]');
  if (submitButton) submitButton.disabled = true;
  contactNote.hidden = true;

  try {
    const response = await fetch(FORMSPREE_URL, {
      method: "POST",
      body: new FormData(contactForm),
      headers: { Accept: "application/json" },
    });
    if (!response.ok) {
      throw new Error("Formspree rejected the submission");
    }
    contactForm.reset();
    if (contactCaptchaId !== null) window.grecaptcha.reset(contactCaptchaId);
    fields.forEach((field) => field.classList.remove("invalid"));
    contactNote.hidden = false;
    contactNote.classList.remove("is-error");
    contactNote.textContent = "Thanks, we received your message and will get back to you shortly.";
  } catch {
    if (contactCaptchaId !== null) window.grecaptcha.reset(contactCaptchaId);
    contactNote.hidden = false;
    contactNote.classList.add("is-error");
    contactNote.textContent = "Something went wrong sending your message. Please try again or email info@veldren.net.";
  } finally {
    if (submitButton) submitButton.disabled = false;
  }
});
contactForm?.addEventListener("input", (event) => {
  if (event.target.classList) event.target.classList.remove("invalid");
});

const newsletterForm = document.getElementById("newsletterForm");
const newsletterNote = document.getElementById("newsletterNote");
const NEWSLETTER_URL = "https://formspree.io/f/xbgdzepb";
newsletterForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  const emailField = newsletterForm.querySelector('input[type="email"]');
  const valid = emailField && emailField.value.trim() && emailField.checkValidity();
  if (!valid) {
    newsletterNote.hidden = false;
    newsletterNote.classList.add("is-error");
    newsletterNote.textContent = "Enter a valid work email.";
    return;
  }

  const submitButton = newsletterForm.querySelector('button[type="submit"]');
  if (submitButton) submitButton.disabled = true;
  newsletterNote.hidden = true;

  try {
    const response = await fetch(NEWSLETTER_URL, {
      method: "POST",
      body: new FormData(newsletterForm),
      headers: { Accept: "application/json" },
    });
    if (!response.ok) {
      throw new Error("Formspree rejected the subscription");
    }
    newsletterForm.reset();
    newsletterNote.hidden = false;
    newsletterNote.classList.remove("is-error");
    newsletterNote.textContent = "Thanks, you are on the list.";
  } catch {
    newsletterNote.hidden = false;
    newsletterNote.classList.add("is-error");
    newsletterNote.textContent = "Something went wrong. Please try again or email info@veldren.net.";
  } finally {
    if (submitButton) submitButton.disabled = false;
  }
});

const caseDialog = document.getElementById("caseDialog");
if (caseDialog) {
  const casePanels = [...caseDialog.querySelectorAll("[data-case]")];
  document.querySelectorAll("[data-case-open]").forEach((tile) => {
    tile.addEventListener("click", () => {
      const id = tile.dataset.caseOpen;
      let labelId = "";
      casePanels.forEach((panel) => {
        const open = panel.dataset.case === id;
        panel.hidden = !open;
        if (open) labelId = panel.getAttribute("aria-labelledby") || "";
      });
      if (labelId) caseDialog.setAttribute("aria-labelledby", labelId);
      caseDialog.showModal();
    });
  });
  caseDialog.addEventListener("click", (event) => {
    if (event.target === caseDialog || event.target.closest("[data-case-close]")) caseDialog.close();
  });
  caseDialog.querySelectorAll('a[href="#contact"]').forEach((link) => {
    link.addEventListener("click", () => caseDialog.close());
  });
  caseDialog.addEventListener("close", () => {
    casePanels.forEach((panel) => {
      panel.hidden = true;
    });
  });
}

document.querySelectorAll(".reveal").forEach((el, i) => {
  if (el.classList.contains("program-card") || el.classList.contains("price-card")) {
    el.style.transitionDelay = (i % 4) * 0.12 + "s";
  }
  observer.observe(el);
});
