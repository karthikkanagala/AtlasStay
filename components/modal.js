// -- FILE: modal.js ------------------------------------
// PURPOSE: Handle hotel detail modal rendering and interactions
// -- DATA ----------------------------------------------
let overlayEl;
let boxEl;

function escapeHTML(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function hideModal() {
  if (!overlayEl) {
    return;
  }
  overlayEl.classList.add("is-hidden");
  boxEl.innerHTML = "";
}

function renderModal(hotel) {
  const amenities = hotel.amenities.map((item) => `<span class="amenity-tag">${escapeHTML(item)}</span>`).join("");
  boxEl.innerHTML = `
    <img class="modal-img" src="${escapeHTML(hotel.image)}" alt="${escapeHTML(hotel.name)}" />
    <div class="modal-body">
      <div class="modal-header">
        <div>
          <h3>${escapeHTML(hotel.name)}</h3>
          <p>${"★".repeat(hotel.stars)} | ${escapeHTML(hotel.city)}, ${escapeHTML(hotel.state)}</p>
        </div>
        <button class="modal-close" aria-label="Close">×</button>
      </div>
      <p>${escapeHTML(hotel.description)}</p>
      <div class="card-amenities modal-amenities">${amenities}</div>
      <div class="modal-price-row">
        <strong class="card-price">₹${Number(hotel.price).toLocaleString("en-IN")} <small>/ night</small></strong>
        <button class="btn-select" id="modal-book-now" type="button">Book Now</button>
      </div>
    </div>
  `;
}

// -- RENDER --------------------------------------------
export function initModal() {
  overlayEl = document.getElementById("modal-overlay");
  boxEl = document.getElementById("modal-box");

  if (!overlayEl || !boxEl) {
    return;
  }

  overlayEl.addEventListener("click", (event) => {
    if (event.target === overlayEl) {
      hideModal();
    }
  });

  boxEl.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    if (target.classList.contains("modal-close")) {
      hideModal();
      return;
    }

    if (target.id === "modal-book-now") {
      const hotelId = Number(target.dataset.hotelId || "0");
      if (hotelId) {
        window.dispatchEvent(new CustomEvent("hotel:selected:byId", { detail: { hotelId } }));
      }
      window.dispatchEvent(new CustomEvent("navigate:booking"));
      hideModal();
    }
  });

  window.showModal = (hotel) => {
    if (!hotel || !overlayEl || !boxEl) {
      return;
    }
    renderModal(hotel);
    const bookBtn = boxEl.querySelector("#modal-book-now");
    if (bookBtn instanceof HTMLButtonElement) {
      bookBtn.dataset.hotelId = String(hotel.id);
    }
    overlayEl.classList.remove("is-hidden");
  };
}

// -- EVENTS --------------------------------------------
export function showModal(hotel) {
  if (typeof window.showModal === "function") {
    window.showModal(hotel);
  }
}
