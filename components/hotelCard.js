// -- FILE: hotelCard.js --------------------------------
// PURPOSE: Render individual hotel cards and surface card-level actions
// -- DATA ----------------------------------------------
function amenityTags(amenities = []) {
  return amenities.slice(0, 4).map((name) => `<span class="amenity-tag">${name}</span>`).join("");
}

// -- RENDER --------------------------------------------
export function createHotelCard(hotel, options = {}) {
  const {
    onDetails = () => {},
    onSelect = () => {},
    onCompareToggle = () => {},
    onWishlistToggle = () => {},
    selectedCompare = false,
    selectedHotel = false,
    wishlisted = false
  } = options;

  const card = document.createElement("article");
  card.className = `hotel-card ${selectedHotel ? "card-selected" : ""}`.trim();

  card.innerHTML = `
    <div class="card-img-wrap">
      <img src="${hotel.image}" alt="${hotel.name}" loading="lazy" />
      <span class="star-badge">${hotel.stars}★</span>
      <button class="wishlist-btn ${wishlisted ? "active" : ""}" type="button" aria-label="Save to wishlist">❤</button>
    </div>
    <div class="card-body">
      <div class="card-city">${hotel.city}, ${hotel.state}</div>
      <h3 class="card-name">${hotel.name}</h3>
      <p class="card-rating">⭐ ${hotel.rating} (${hotel.reviews} reviews)</p>
      <div class="card-amenities">${amenityTags(hotel.amenities)}</div>
      <div class="card-footer">
        <div class="card-price">₹${hotel.price.toLocaleString("en-IN")} <small>/ night</small></div>
        <div class="card-actions">
          <button class="btn-details" type="button">Details</button>
          <button class="btn-select" type="button">Select</button>
        </div>
      </div>
      <label class="compare-label">
        <input type="checkbox" class="compare-check" ${selectedCompare ? "checked" : ""} /> Compare
      </label>
    </div>
  `;

  const detailsBtn = card.querySelector(".btn-details");
  const selectBtn = card.querySelector(".btn-select");
  const compareCheck = card.querySelector(".compare-check");
  const wishBtn = card.querySelector(".wishlist-btn");

  detailsBtn?.addEventListener("click", (event) => {
    event.stopPropagation();
    onDetails(hotel);
  });

  selectBtn?.addEventListener("click", (event) => {
    event.stopPropagation();
    onSelect(hotel);
  });

  compareCheck?.addEventListener("change", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) {
      return;
    }
    onCompareToggle(hotel, target.checked, target);
  });

  wishBtn?.addEventListener("click", (event) => {
    event.stopPropagation();
    onWishlistToggle(hotel, wishBtn);
  });

  return card;
}

// -- EVENTS --------------------------------------------
export function setCardSelected(card, isSelected) {
  card.classList.toggle("card-selected", isSelected);
}
