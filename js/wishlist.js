// wishlist.js
// ====================================================
// Wishlist System (LocalStorage-based)
// ====================================================

const WL_KEY = "hs_wishlist";

// Helpers for storage
const readWL = () => JSON.parse(localStorage.getItem(WL_KEY) || "[]");
const writeWL = (arr) => localStorage.setItem(WL_KEY, JSON.stringify(arr));

// Toggle item in wishlist
function toggleWishlist(el, payload) {
  const wl = readWL();
  const key = `${payload.type}:${payload.id}`;
  const idx = wl.findIndex(x => x.key === key);

  if (idx >= 0) {
    // Remove
    wl.splice(idx, 1);
    el.classList.remove("active");
    el.querySelector("i").className = "bi bi-heart";
  } else {
    // Add
    wl.push({ key, ...payload, ts: Date.now() });
    el.classList.add("active");
    el.querySelector("i").className = "bi bi-heart-fill";
  }

  writeWL(wl);
  renderWishlist(); // refresh modal + badge
}

// Remove single item
function removeFromWishlist(index) {
  const wl = readWL();
  wl.splice(index, 1);
  writeWL(wl);
  renderWishlist();
}

// Clear all wishlist
document.getElementById("clearWishlist")
  ?.addEventListener("click", () => {
    localStorage.removeItem(WL_KEY);
    renderWishlist();
  });

// Format price
function formatCost(val) {
  if (!val) return "";
  if (typeof val === "string") {
    const num = val.replace(/[^\d.]/g, "");
    return "PKR " + Number(num || 0).toLocaleString();
  }
  if (typeof val === "number") return "PKR " + val.toLocaleString();
  return val;
}

// Render wishlist modal
function renderWishlist() {
  const container = document.getElementById("wishlistItems");
  const countEl = document.getElementById("wishlistCount");
  const valueEl = document.getElementById("wishlistValue");
  const wl = readWL();

  container.innerHTML = "";

  if (!wl.length) {
    container.innerHTML = `<p class="text-muted">Your wishlist is empty.</p>`;
    if (countEl) countEl.textContent = 0;
    if (valueEl) valueEl.textContent = "PKR 0";
    return;
  }

  let total = 0;
  wl.forEach((item, index) => {
    const title = item.title || item.name || "Untitled";
    const rawCost = item.cost || item.price || 0;
    const cost = rawCost ? formatCost(rawCost) : "";
    total += parseFloat((rawCost + "").replace(/[^\d.]/g, "")) || 0;

    container.innerHTML += `
      <div class="list-group-item d-flex gap-3 align-items-center py-3">
        <img src="${item.image}" alt="${title}" 
          class="rounded" width="100" height="70" style="object-fit:cover;">
        
        <div class="flex-grow-1">
          <div class="d-flex justify-content-between align-items-center">
            <h6 class="mb-1">${title}</h6>
            ${item.rating ? `<small class="text-warning"><i class="bi bi-star-fill"></i> ${item.rating}</small>` : ""}
          </div>
          <div class="text-muted small">${item.category || item.type || ""}</div>
          ${cost ? `<div class="fw-bold text-brand">${cost}</div>` : ""}
          <small class="text-muted">Added on ${new Date(item.ts).toLocaleDateString()}</small>
          
          <div class="mt-2 d-flex gap-2">
            <button class="btn btn-sm btn-outline-success" 
              data-bs-toggle="modal" data-bs-target="#detailModal"
              data-title="${title}" data-image="${item.image}" 
              data-details='${JSON.stringify(item)}'>View Details</button>
            <button class="btn btn-sm btn-outline-warning">Get Quote</button>
          </div>
        </div>

        <button class="btn btn-link text-danger" onclick="removeFromWishlist(${index})">
          <i class="bi bi-trash"></i>
        </button>
      </div>
    `;
  });

  if (countEl) countEl.textContent = wl.length;
  if (valueEl) valueEl.textContent = "PKR " + total.toLocaleString();
}

// Hook modal → refresh on open
document.getElementById("wishlistModal")
  ?.addEventListener("show.bs.modal", renderWishlist);

// ====================================================
// Detail Modal Builder
// ====================================================
function buildDetails(obj) {
  let html = "";

  function formatValue(val) {
    if (Array.isArray(val)) {
      if (val.length && typeof val[0] === "object" && val[0].name) {
        return `
          <div class="product-grid">
            ${val.map(p => `
              <div class="product-item">
                <span class="fw-bold">${p.name}</span>
                <span class="text-muted">${p.price}</span>
              </div>
            `).join("")}
          </div>
        `;
      }
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
    if (["id", "image", "portfolio", "products"].includes(k)) continue;
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

// Modal open handler
const modalEl = document.getElementById("detailModal");
modalEl?.addEventListener("show.bs.modal", ev => {
  const btn = ev.relatedTarget;
  if (!btn) return;
  const type = btn.closest(".col-md-6, .col-lg-4")?.dataset.type || "";
  const typeLabel = type.charAt(0).toUpperCase() + type.slice(1);
  modalEl.querySelector(".modal-heading").textContent = `${typeLabel} Details`;
  modalEl.querySelector(".modal-title").textContent = btn.dataset.title || "";
  document.getElementById("modalImg").src = btn.dataset.image || "";
  document.getElementById("modalDetails").innerHTML = buildDetails(JSON.parse(btn.dataset.details));
});
