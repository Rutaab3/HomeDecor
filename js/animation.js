// ====================================================
// GSAP Animations for Nav + Hero + Footer
// ====================================================
document.addEventListener("DOMContentLoaded", () => {
  // --- Navbar animation ---
  gsap.from("nav.navbar", {
    y: -80,
    opacity: 0,
    duration: 1,
    ease: "power3.out"
  });

  // --- Hero title + subtitle + button ---
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

  // --- Footer reveal with ScrollReveal ---
  if (typeof ScrollReveal !== "undefined") {
    ScrollReveal().reveal("footer .col-md-4, footer .col-md-2", {
      origin: "bottom",
      distance: "40px",
      duration: 900,
      interval: 200
    });
    ScrollReveal().reveal("footer hr, footer .d-flex", {
      origin: "bottom",
      distance: "20px",
      duration: 800,
      delay: 400
    });
  }
});

// ====================================================
// ScrollReveal Animations (per section, staggered cards)
// ====================================================
document.addEventListener("DOMContentLoaded", () => {
  if (typeof ScrollReveal === "undefined") return;

  const sr = ScrollReveal({
    distance: "50px",
    duration: 200,
    easing: "ease-out",
    opacity: 0,
    reset: false
  });

  // Generic stagger for grid sections
  function revealGrid(selector, origin = "bottom") {
    sr.reveal(`${selector} > div, ${selector} .card`, {
      origin,
      interval: 100,
      scale: 0.95
    });
  }


  // Run after fetch() injects content
  setTimeout(() => {
    revealGrid("#designsGrid");
    revealGrid("#productsGrid");
    revealGrid("#designersGrid");
    revealGrid("#blogsGrid");
    revealTestimonials();
  }, 800);
});

// animation.js — About Us page animations (no nav/footer)

document.addEventListener("DOMContentLoaded", () => {
  if (typeof ScrollReveal === "undefined") return;

  const sr = ScrollReveal({
    distance: "40px",
    duration: 300,   // fast but visible
    easing: "ease-out",
    opacity: 0,
    reset: false
  });

  // === Hero ===
  sr.reveal("#heroTitle", { origin: "top", delay: 80 });
  sr.reveal("#heroSub", { origin: "top", delay: 160 });

  // === Our Story ===
  sr.reveal(".row.align-items-center.g-5 .col-md-6:first-child", {
    origin: "left"
  });
  sr.reveal(".row.align-items-center.g-5 .col-md-6:last-child", {
    origin: "right"
  });

  // === Mission & Values (3 cards) ===
  sr.reveal(".bg-light .card", {
    origin: "bottom",
    interval: 100,
    scale: 0.95
  });

  // === Meet the Team (4 cards) ===
  sr.reveal(".container.text-center .card", {
    origin: "bottom",
    interval: 120,
    scale: 0.96
  });

  // === Why Choose Us (3 feature boxes) ===
  sr.reveal(".why .p-4", {
    origin: "bottom",
    interval: 120,
    scale: 0.96
  });

  // === Call-to-Action Section ===
  sr.reveal(".why h2", { origin: "top", delay: 80 });
  sr.reveal(".why a.btn", { origin: "bottom", interval: 120, delay: 120 });
});

// animation.js — Feedback & Contact pages (no nav/footer)

document.addEventListener("DOMContentLoaded", () => {
  if (typeof ScrollReveal === "undefined") return;

  const sr = ScrollReveal({
    distance: "35px",
    duration: 280,   // quick animation
    easing: "ease-out",
    opacity: 0,
    reset: false
  });

  // === Hero shared (both pages) ===
  sr.reveal("#heroTitle", { origin: "top", delay: 60 });
  sr.reveal("#heroSub", { origin: "top", delay: 140 });

  // -----------------------
  // Feedback page specifics
  // -----------------------
  if (document.querySelector(".form .card")) {
    // Feedback form card
    sr.reveal(".form .card", { origin: "bottom", delay: 100, scale: 0.97 });

    // Inside form: fields stagger in
    sr.reveal(".form .form-label, .form .form-control, .form select, .form textarea, .form button", {
      origin: "left",
      interval: 80,
      distance: "25px"
    });

    // Contact info section at bottom
    sr.reveal("section.bg-light p, section.bg-light a", {
      origin: "bottom",
      interval: 100
    });
  }

  // -----------------------
  // Contact page specifics
  // -----------------------
  if (document.querySelector(".contact-layout")) {
    // Left form
    sr.reveal(".contact-form label, .contact-form input, .contact-form textarea, .contact-form button", {
      origin: "left",
      interval: 90,
      distance: "25px"
    });

    // Right social panel
    sr.reveal(".social-panel h2", { origin: "top", delay: 80 });
    sr.reveal(".social-panel li", {
      origin: "right",
      interval: 70,
      distance: "30px"
    });
  }
});

// js/docs-anim.js
document.addEventListener("DOMContentLoaded", () => {
  const items = document.querySelectorAll("section ol li");
  if (!items.length) return;

  items.forEach((li, i) => {
    li.style.opacity = 0;
    li.style.transform = "translateX(-20px)";
    li.style.transition = "opacity 0.4s ease, transform 0.4s ease";
    li.style.transitionDelay = `${i * 0.1}s`; // stagger
  });

  // trigger animation slightly after page load
  setTimeout(() => {
    items.forEach(li => {
      li.style.opacity = 1;
      li.style.transform = "translateX(0)";
    });
  }, 100);
});

