// ====================================================
// Helper Functions
// ====================================================

// Format price
function formatCost(val) {
  if (!val) return "";
  const num = parseFloat((val + "").replace(/[^\d.]/g, "")) || 0;
  return "PKR " + num.toLocaleString();
}

// Build modal details dynamically
function buildDetails(obj) {
  let html = "";

  function formatValue(val) {
    if (Array.isArray(val)) {
      return val.map(v => (typeof v === "object" ? formatValue(v) : v)).join(", ");
    } else if (typeof val === "object" && val !== null) {
      return Object.entries(val)
        .map(([kk, vv]) => `<div><em>${kk}:</em> ${formatValue(vv)}</div>`)
        .join("");
    } else {
      return val;
    }
  }

  for (const [k, v] of Object.entries(obj)) {
    if (["id", "image"].includes(k)) continue;
    const label = k.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
    html += `
      <div class="detail-row mb-2">
        <strong>${label}</strong>
        <div>${formatValue(v)}</div>
      </div>
    `;
  }

  return html || "<p class='text-muted'>No details available.</p>";
}


// ====================================================
// Render Functions
// ====================================================

// Designs / Products
function renderCards(data, gridId, type) {
  const grid = document.getElementById(gridId);
  if (!grid) return;
  grid.innerHTML = "";

  data.slice(0, 3).forEach((item, i) => {
    const col = document.createElement("div");
    col.className = "col-md-6 col-lg-4";
    col.dataset.type = type;

    const title = item.name || item.title || "Untitled";
    const image = item.image || "images/placeholder.jpg";

    col.innerHTML = `
      <div class="card h-100 shadow-sm rounded-4 overflow-hidden">
        <div class="position-relative">
          <div class="position-absolute top-0 start-0 m-2">
            <span class="badge bg-primary">${item.trend || "New"}</span>
            <span class="badge bg-secondary">${item.category || ""}</span>
          </div>
          <img src="${image}" class="card-img-top" alt="${title}">
          <button class="wishlist-btn position-absolute top-0 end-0 m-2 rounded-circle shadow-sm">
            <i class="bi bi-heart"></i>
          </button>
        </div>
        <div class="card-body">
          <h5 class="card-title mb-2">${title}</h5>
          ${item.rating ? `<span class="text-warning"><i class="bi bi-star-fill"></i> ${item.rating}</span>` : ""}
          <p class="card-text text-secondary small">${item.description || ""}</p>
          <div class="d-flex justify-content-between align-items-center">
            ${item.cost ? `<span class="fw-bold text-brand fs-5">${formatCost(item.cost)}</span>` : ""}
            <button class="btn btn-sm btn-brand" 
              data-bs-toggle="modal" data-bs-target="#detailModal"
              data-title="${title}" data-image="${image}" 
              data-details='${JSON.stringify(item)}'>
              View Details
            </button>
          </div>
        </div>
      </div>
    `;

    grid.appendChild(col);

    // Hook wishlist button → delegate to wishlist.js
    const btn = col.querySelector(".wishlist-btn");
    const payload = { type, id: item.id, title, image, cost: item.cost };
    btn.addEventListener("click", () => toggleWishlist(btn, payload));
  });
}

// Designers
function renderDesigners(data) {
  const grid = document.getElementById("designersGrid");
  if (!grid) return;
  grid.innerHTML = "";

  data.slice(0, 3).forEach((item, i) => {
    const col = document.createElement("div");
    col.className = "col-md-6 col-lg-4";
    col.dataset.type = "designer";

    const title = item.name || "Untitled";
    const image = item.image || "images/placeholder.jpg";
    const desc = item.bio || "";

    col.innerHTML = `
      <div class="card h-100 shadow-sm rounded-4 overflow-hidden text-center p-3 position-relative">
        <button class="wishlist-btn position-absolute top-0 end-0 m-2 rounded-circle shadow-sm">
          <i class="bi bi-heart"></i>
        </button>
        <img src="${image}" class="rounded-circle mx-auto d-block mb-3" width="120" height="120" alt="${title}" style="object-fit: cover;">
        <div class="card-body">
          <h5 class="card-title mb-1">${title}</h5>
          ${item.rating ? `<div class="text-warning mb-2"><i class="bi bi-star-fill"></i> ${item.rating}</div>` : ""}
          <p class="card-text text-secondary small mb-3">${desc}</p>
          <div class="d-flex justify-content-between align-items-center">
            ${item.cost ? `<span class="fw-bold text-brand fs-5">${formatCost(item.cost)}</span>` : ""}
            <button class="btn btn-sm btn-brand"
              data-bs-toggle="modal" data-bs-target="#detailModal"
              data-title="${title}" data-image="${image}" 
              data-details='${JSON.stringify(item)}'>
              View Details
            </button>
          </div>
        </div>
      </div>
    `;

    grid.appendChild(col);

    // Hook wishlist button → delegate to wishlist.js
    const btn = col.querySelector(".wishlist-btn");
    const payload = { type: "designer", id: item.id, title, image };
    btn.addEventListener("click", () => toggleWishlist(btn, payload));
  });
}

// Testimonials
function renderTestimonials(data) {
  const grid = document.getElementById("testimonialsGrid");
  if (!grid) return;
  grid.innerHTML = "";

  data.forEach((item) => {
    const slide = document.createElement("div");
    slide.className = "swiper-slide";
    slide.innerHTML = `
      <div class="testimonial-card">
        <p>“${item.message.substring(0, 140)}...”</p>
        <img src="${item.image}" class="rounded-circle" width="70" height="70" style="object-fit:cover;">
        <h6>${item.name}</h6>
        <small>${item.role}, ${item.location}</small>
        <div class="stars">${"★".repeat(Math.floor(item.rating))}</div>
        <button class="btn btn-sm mt-2"
          data-bs-toggle="modal" data-bs-target="#testimonialModal"
          data-name="${item.name}" data-role="${item.role}, ${item.location}"
          data-image="${item.image}" data-message="${item.message}" data-rating="${item.rating}">
          View Details
        </button>
      </div>
    `;
    grid.appendChild(slide);
  });

  new Swiper(".testimonialSwiper", {
    slidesPerView: 1,
    spaceBetween: 30,
    loop: true,
    pagination: { el: ".swiper-pagination", clickable: true },
    navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
    autoplay: { delay: 4000, disableOnInteraction: true },
  });
}

// Blogs
function renderBlogs(data) {
  const grid = document.getElementById("blogsGrid");
  if (!grid) return;
  grid.innerHTML = "";

  data.forEach((item) => {
    const col = document.createElement("div");
    col.className = "col-md-4";
    col.innerHTML = `
      <div class="card h-100 shadow-sm rounded-4 overflow-hidden">
        <img src="${item.image}" class="card-img-top" alt="${item.title}">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${item.title}</h5>
          <p class="card-text text-secondary small flex-grow-1">${item.excerpt}</p>
          <button class="btn btn-sm btn-brand mt-auto"
            data-bs-toggle="modal" data-bs-target="#blogModal"
            data-title="${item.title}" data-author="${item.author}" data-date="${item.date}"
            data-image="${item.image}" data-content="${item.content}">
            View Details
          </button>
        </div>
      </div>
    `;
    grid.appendChild(col);
  });
}


// ====================================================
// Modal Handlers
// ====================================================

// Detail Modal
document.getElementById("detailModal")
  ?.addEventListener("show.bs.modal", ev => {
    const btn = ev.relatedTarget;
    if (!btn) return;
    document.querySelector("#detailModal .modal-title").textContent = btn.dataset.title || "";
    document.getElementById("modalImg").src = btn.dataset.image || "";
    document.getElementById("modalDetails").innerHTML = buildDetails(JSON.parse(btn.dataset.details));
  });

// Testimonial Modal
document.getElementById("testimonialModal")
  ?.addEventListener("show.bs.modal", ev => {
    const card = ev.relatedTarget;
    if (!card) return;
    document.getElementById("testimonialModalTitle").textContent = "Client Testimonial";
    document.getElementById("testimonialModalImg").src = card.dataset.image;
    document.getElementById("testimonialModalMessage").textContent = card.dataset.message;
    document.getElementById("testimonialModalName").textContent = card.dataset.name;
    document.getElementById("testimonialModalRole").textContent = card.dataset.role;
    document.getElementById("testimonialModalRating").innerHTML = "★".repeat(Math.floor(card.dataset.rating));
  });

// Blog Modal
document.getElementById("blogModal")
  ?.addEventListener("show.bs.modal", ev => {
    const card = ev.relatedTarget;
    if (!card) return;
    document.getElementById("blogModalTitle").textContent = card.dataset.title;
    document.getElementById("blogModalImg").src = card.dataset.image;
    document.getElementById("blogModalMeta").textContent =
      `By ${card.dataset.author} • ${new Date(card.dataset.date).toLocaleDateString()}`;
    document.getElementById("blogModalContent").textContent = card.dataset.content;
  });


// ====================================================
// Fetch Data
// ====================================================
fetch("data/designs.json").then(r => r.json()).then(j => renderCards(j.designs, "designsGrid", "design"));
fetch("data/designers.json").then(r => r.json()).then(j => renderDesigners(j.designers));
fetch("data/products.json").then(r => r.json()).then(j => renderCards(j.products, "productsGrid", "product"));
fetch("data/testimonials.json").then(r => r.json()).then(j => renderTestimonials(j.testimonials));
fetch("data/blogs.json").then(r => r.json()).then(j => renderBlogs(j.blogs));
