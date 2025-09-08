// animation.js — Unified Animation Controller
// ====================================================

// Global ScrollReveal instance (reused everywhere)
const sr = typeof ScrollReveal !== "undefined"
  ? ScrollReveal({
      distance: "50px",
      duration: 300,
      easing: "ease-out",
      opacity: 0,
      reset: false
    })
  : null;

// ====================================================
// Helpers
// ====================================================

// Grid reveal utility
function revealGrid(selector, origin = "bottom") {
  if (!sr) return;
  if (!document.querySelector(selector)) return;

  sr.reveal(`${selector} > div, ${selector} .card`, {
    origin,
    interval: 100,
    scale: 0.95
  });
}

// Testimonials reveal (previously missing!)
function revealTestimonials() {
  if (!sr) return;
  const section = document.querySelector("#testimonials");
  if (!section) return;

  sr.reveal("#testimonials .card", {
    origin: "bottom",
    interval: 120,
    scale: 0.96
  });
}

// ====================================================
// Page-Specific Animations
// ====================================================

// Main pages (Nav + Hero + Footer + Grids)
function initMainAnimations() {
  // Navbar
  if (document.querySelector("nav.navbar")) {
    gsap.from("nav.navbar", {
      y: -80,
      opacity: 0,
      duration: 1,
      ease: "power3.out"
    });
  }

  // Hero
  if (document.getElementById("heroTitle")) {
    gsap.from("#heroTitle", {
      y: 60,
      opacity: 0,
      duration: 1,
      delay: 0.3,
      ease: "power3.out"
    });
  }
  if (document.getElementById("heroSub")) {
    gsap.from("#heroSub", {
      y: 40,
      opacity: 0,
      duration: 1,
      delay: 0.6,
      ease: "power3.out"
    });
  }
  const heroBtn = document.querySelector(".hero .btn");
  if (heroBtn) {
    gsap.from(heroBtn, {
      y: 30,
      opacity: 0,
      duration: 1,
      delay: 0.9,
      ease: "power3.out"
    });
  }

  // Footer
  if (sr && document.querySelector("footer")) {
    sr.reveal("footer .col-md-4, footer .col-md-2", {
      origin: "bottom",
      distance: "40px",
      duration: 900,
      interval: 200
    });
    sr.reveal("footer hr, footer .d-flex", {
      origin: "bottom",
      distance: "20px",
      duration: 800,
      delay: 400
    });
  }

  // Grids
  revealGrid("#designsGrid");
  revealGrid("#productsGrid");
  revealGrid("#designersGrid");
  revealGrid("#blogsGrid");
  revealTestimonials();
}

// About page
function initAboutAnimations() {
  if (!sr) return;

  sr.reveal("#heroTitle", { origin: "top", delay: 80 });
  sr.reveal("#heroSub", { origin: "top", delay: 160 });

  sr.reveal(".row.align-items-center.g-5 .col-md-6:first-child", {
    origin: "left"
  });
  sr.reveal(".row.align-items-center.g-5 .col-md-6:last-child", {
    origin: "right"
  });

  sr.reveal(".bg-light .card", { origin: "bottom", interval: 100, scale: 0.95 });
  sr.reveal(".container.text-center .card", {
    origin: "bottom",
    interval: 120,
    scale: 0.96
  });
  sr.reveal(".why .p-4", {
    origin: "bottom",
    interval: 120,
    scale: 0.96
  });

  sr.reveal(".why h2", { origin: "top", delay: 80 });
  sr.reveal(".why a.btn", { origin: "bottom", interval: 120, delay: 120 });
}

// Feedback page
function initFeedbackAnimations() {
  if (!sr) return;

  sr.reveal("#heroTitle", { origin: "top", delay: 60 });
  sr.reveal("#heroSub", { origin: "top", delay: 140 });

  if (document.querySelector(".form .card")) {
    sr.reveal(".form .card", { origin: "bottom", delay: 100, scale: 0.97 });
    sr.reveal(
      ".form .form-label, .form .form-control, .form select, .form textarea, .form button",
      { origin: "left", interval: 80, distance: "25px" }
    );
    sr.reveal("section.bg-light p, section.bg-light a", {
      origin: "bottom",
      interval: 100
    });
  }
}

// Contact page
function initContactAnimations() {
  if (!sr) return;

  sr.reveal("#heroTitle", { origin: "top", delay: 60 });
  sr.reveal("#heroSub", { origin: "top", delay: 140 });

  if (document.querySelector(".contact-layout")) {
    sr.reveal(
      ".contact-form label, .contact-form input, .contact-form textarea, .contact-form button",
      { origin: "left", interval: 90, distance: "25px" }
    );
    sr.reveal(".social-panel h2", { origin: "top", delay: 80 });
    sr.reveal(".social-panel li", {
      origin: "right",
      interval: 70,
      distance: "30px"
    });
  }
}

// Docs pages (Privacy / Terms / Cookies)
function initDocsAnimations() {
  const items = document.querySelectorAll("section ol li");
  if (!items.length) return;

  items.forEach((li, i) => {
    li.style.opacity = 0;
    li.style.transform = "translateX(-20px)";
    li.style.transition = "opacity 0.4s ease, transform 0.4s ease";
    li.style.transitionDelay = `${i * 0.1}s`;
  });

  requestAnimationFrame(() => {
    items.forEach(li => {
      li.style.opacity = 1;
      li.style.transform = "translateX(0)";
    });
  });
}

// ====================================================
// Init Controller
// ====================================================
document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page || "";

  switch (page) {
    case "about":
      initAboutAnimations();
      break;
    case "feedback":
      initFeedbackAnimations();
      break;
    case "contact":
      initContactAnimations();
      break;
    case "docs":
      initDocsAnimations();
      break;
    default:
      initMainAnimations();
      break;
  }
});
