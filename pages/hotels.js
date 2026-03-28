// -- FILE: hotels.js -----------------------------------
// PURPOSE: Render and filter hotel cards plus featured deals
// -- DATA ----------------------------------------------
import { createHotelCard } from "../components/hotelCard.js";

let stateRef;
let filters = {
  query: "",
  maxPrice: 10000,
  star: null,
  sortBy: "price",
  category: "all",
  quickFilter: "all"
};

const wishlist = new Set();

function renderCategoryEmptyState(grid) {
  grid.innerHTML = `
    <div class="category-empty-state" role="status" aria-live="polite">
      <div class="category-empty-icon">🔭</div>
      <h3 class="category-empty-title">No hotels found in this category</h3>
      <p class="category-empty-copy">Try a different category or browse all stays.</p>
      <button class="category-empty-btn" type="button" id="show-all-hotels-btn">Show All Hotels</button>
    </div>
  `;

  const showAllBtn = document.getElementById("show-all-hotels-btn");
  showAllBtn?.addEventListener("click", () => {
    const allTab = document.querySelector(".cat-tab[data-category='all']");
    if (allTab instanceof HTMLButtonElement) {
      allTab.click();
    }
  });
}

function renderHotelCards(grid, hotels) {
  grid.innerHTML = "";

  hotels.forEach((hotel) => {
    const card = createHotelCard(hotel, {
      selectedCompare: stateRef.compareList.includes(hotel.id),
      selectedHotel: stateRef.selectedHotel?.id === hotel.id,
      wishlisted: wishlist.has(hotel.id),
      onDetails: (item) => window.showModal?.(item),
      onSelect: (item) => onSelectHotel(item),
      onWishlistToggle: (item, node) => {
        if (wishlist.has(item.id)) {
          wishlist.delete(item.id);
          node.classList.remove("active");
        } else {
          wishlist.add(item.id);
          node.classList.add("active");
        }
      },
      onCompareToggle: (item, checked, inputNode) => {
        if (checked) {
          if (stateRef.compareList.length >= 3) {
            inputNode.checked = false;
            window.showToast?.("You can compare up to 3 hotels only", "warning");
            return;
          }
          stateRef.compareList.push(item.id);
        } else {
          stateRef.compareList = stateRef.compareList.filter((id) => id !== item.id);
        }
        dispatchCompareUpdated();
        renderHotels();
      }
    });
    grid.appendChild(card);
  });
}

function byCategory(hotel) {
  const cat = filters.category;
  if (cat === "all") {
    return true;
  }
  if (cat === "resort") {
    return hotel.name.toLowerCase().includes("resort");
  }
  if (cat === "villa") {
    return hotel.name.toLowerCase().includes("villa");
  }
  if (cat === "homestay") {
    return hotel.stars <= 4;
  }
  if (cat === "package") {
    return hotel.featured;
  }
  return true;
}

function byQuickFilter(hotel) {
  if (filters.quickFilter === "all") {
    return true;
  }
  if (filters.quickFilter === "business") {
    return ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai"].includes(hotel.city);
  }
  return Number(hotel.stars) === Number(filters.quickFilter);
}

function filteredHotels() {
  let hotels = stateRef.hotels.filter((hotel) => {
    const q = filters.query.toLowerCase();
    const cityOrName = hotel.city.toLowerCase().includes(q) || hotel.name.toLowerCase().includes(q);
    const pricePass = hotel.price <= filters.maxPrice;
    const starPass = filters.star ? hotel.stars === Number(filters.star) : true;
    return cityOrName && pricePass && starPass && byCategory(hotel) && byQuickFilter(hotel);
  });

  hotels.sort((a, b) => {
    if (filters.sortBy === "rating") {
      return b.rating - a.rating;
    }
    if (filters.sortBy === "name") {
      return a.name.localeCompare(b.name);
    }
    return a.price - b.price;
  });

  return hotels;
}

function updateResultsCount(count) {
  const el = document.getElementById("results-count");
  if (el) {
    el.textContent = `${count} hotels found`;
  }
}

function renderActiveFilterChips() {
  const container = document.getElementById("active-filters");
  if (!container) {
    return;
  }

  const chips = [];
  if (filters.query) {
    chips.push({ key: "query", text: `Search: ${filters.query}` });
  }
  if (filters.maxPrice < 10000) {
    chips.push({ key: "price", text: `Max ₹${filters.maxPrice.toLocaleString("en-IN")}` });
  }
  if (filters.star) {
    chips.push({ key: "star", text: `${filters.star}★` });
  }

  container.innerHTML = chips
    .map((chip) => `<span class="active-filter-chip">${chip.text}<button type="button" data-key="${chip.key}">×</button></span>`)
    .join("");

  container.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.dataset.key === "query") {
        filters.query = "";
        const input = document.getElementById("hotel-search");
        if (input instanceof HTMLInputElement) {
          input.value = "";
        }
      }
      if (btn.dataset.key === "price") {
        filters.maxPrice = 10000;
        const range = document.getElementById("price-range");
        if (range instanceof HTMLInputElement) {
          range.value = "10000";
        }
        const label = document.getElementById("price-label");
        if (label) {
          label.textContent = "₹10,000";
        }
      }
      if (btn.dataset.key === "star") {
        filters.star = null;
        document.querySelectorAll(".star-filter-btn").forEach((node) => node.classList.remove("active"));
      }
      renderHotels();
    });
  });
}

function dispatchCompareUpdated() {
  window.dispatchEvent(
    new CustomEvent("compare:updated", {
      detail: { ids: [...stateRef.compareList] }
    })
  );
}

function onSelectHotel(hotel) {
  stateRef.selectedHotel = hotel;
  window.dispatchEvent(new CustomEvent("hotel:selected", { detail: { hotel } }));
  window.showToast?.(`${hotel.name} selected for booking`, "success");
  renderHotels();
}

function renderDeals() {
  const dealsGrid = document.getElementById("deals-grid");
  if (!dealsGrid) {
    return;
  }

  const featured = stateRef.hotels.filter((hotel) => hotel.featured).slice(0, 3);
  dealsGrid.innerHTML = featured
    .map((hotel) => {
      const discounted = Math.round(hotel.price * 0.9);
      return `
        <article class="deal-card">
          <img src="${hotel.image}" alt="${hotel.name}" />
          <span class="deal-badge">10% OFF</span>
          <div class="deal-body">
            <h4 class="deal-name">${hotel.name}</h4>
            <p class="deal-city">${hotel.city}</p>
            <div class="deal-price-row">
              <span class="deal-old-price">₹${hotel.price.toLocaleString("en-IN")}</span>
              <span class="deal-new-price">₹${discounted.toLocaleString("en-IN")}</span>
            </div>
            <p class="deal-urgency">Limited rooms left</p>
            <button class="deal-book-btn" data-id="${hotel.id}" type="button">Book Deal</button>
          </div>
        </article>
      `;
    })
    .join("");

  dealsGrid.querySelectorAll(".deal-book-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const id = Number(button.dataset.id || "0");
      const hotel = stateRef.hotels.find((item) => item.id === id);
      if (hotel) {
        onSelectHotel(hotel);
        const booking = document.getElementById("booking");
        if (booking) {
          const y = booking.getBoundingClientRect().top + window.scrollY - 116;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }
    });
  });
}

// -- RENDER --------------------------------------------
export function renderHotels() {
  const grid = document.getElementById("hotels-grid");
  if (!grid) {
    return;
  }

  const hotels = filteredHotels();
  updateResultsCount(hotels.length);
  renderActiveFilterChips();

  if (!hotels.length) {
    grid.innerHTML = '<div class="empty-state">No hotels match your current filters.</div>';
    return;
  }

  renderHotelCards(grid, hotels);
}

export function initHotelsPage(appState) {
  stateRef = appState;

  renderDeals();
  renderHotels();

  const searchInput = document.getElementById("hotel-search");
  const priceRange = document.getElementById("price-range");
  const priceLabel = document.getElementById("price-label");
  const sortSelect = document.getElementById("hotel-sort");

  searchInput?.addEventListener("input", () => {
    filters.query = searchInput.value.trim();
    renderHotels();
  });

  priceRange?.addEventListener("input", () => {
    filters.maxPrice = Number(priceRange.value);
    if (priceLabel) {
      priceLabel.textContent = `₹${filters.maxPrice.toLocaleString("en-IN")}`;
    }
    renderHotels();
  });

  document.querySelectorAll(".star-filter-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const isActive = button.classList.contains("active");
      document.querySelectorAll(".star-filter-btn").forEach((node) => node.classList.remove("active"));
      filters.star = null;
      if (!isActive) {
        button.classList.add("active");
        filters.star = Number(button.dataset.star || "0");
      }
      renderHotels();
    });
  });

  sortSelect?.addEventListener("change", () => {
    filters.sortBy = sortSelect.value;
    renderHotels();
  });

  document.querySelectorAll(".filter-tab").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".filter-tab").forEach((node) => node.classList.remove("active"));
      button.classList.add("active");
      filters.quickFilter = button.dataset.filter || "all";
      renderHotels();
    });
  });

  window.addEventListener("hotels:filterCity", (event) => {
    const city = event.detail?.city || "";
    filters.query = city;
    if (searchInput instanceof HTMLInputElement) {
      searchInput.value = city;
    }
    renderHotels();
  });

  window.addEventListener("hotel:selected:byId", (event) => {
    const id = Number(event.detail?.hotelId || "0");
    const hotel = stateRef.hotels.find((item) => item.id === id);
    if (hotel) {
      onSelectHotel(hotel);
    }
  });

  document.addEventListener("category:filter", (event) => {
    const grid = document.getElementById("hotels-grid");
    if (!grid) {
      return;
    }

    const filteredList = Array.isArray(event.detail?.hotels) ? event.detail.hotels : [];
    updateResultsCount(filteredList.length);

    if (!filteredList.length) {
      renderCategoryEmptyState(grid);
      return;
    }

    renderHotelCards(grid, filteredList);
  });
}

// -- EVENTS --------------------------------------------
export function getCurrentFilteredHotels() {
  return filteredHotels();
}
