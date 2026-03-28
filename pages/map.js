// -- FILE: map.js --------------------------------------
// PURPOSE: Render hotel map with theme-aware tiles and fly-to interactions
// -- DATA ----------------------------------------------
let stateRef;
let map;
let markersLayer;
let activeTileLayer;
const markerByHotelId = new Map();

function isDarkMode() {
  return document.documentElement.classList.contains("dark");
}

function tileUrl() {
  return isDarkMode()
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
}

function createPriceIcon(price) {
  return L.divIcon({
    className: "atlas-price-pin",
    html: `<div class="price-pin">₹${Number(price).toLocaleString("en-IN")}</div>`,
    iconSize: [70, 28],
    iconAnchor: [35, 28]
  });
}

function popupHTML(hotel) {
  return `
    <div class="map-popup">
      <img class="map-popup-img" src="${hotel.image}" alt="${hotel.name}" />
      <h4 class="map-popup-title">${hotel.name}</h4>
      <p class="map-popup-city">${hotel.city}</p>
      <p class="map-popup-price">₹${hotel.price.toLocaleString("en-IN")} / night</p>
      <button class="btn-select map-book-now" data-id="${hotel.id}" type="button">Book Now</button>
    </div>
  `;
}

function setTileLayer() {
  if (!map) {
    return;
  }
  if (activeTileLayer) {
    map.removeLayer(activeTileLayer);
  }
  activeTileLayer = L.tileLayer(tileUrl(), {
    attribution: "© OpenStreetMap © CARTO",
    maxZoom: 18
  }).addTo(map);
}

function highlightSidebarItem(hotelId) {
  document.querySelectorAll(".map-hotel-item").forEach((item) => {
    item.classList.toggle("active", Number(item.getAttribute("data-id")) === hotelId);
  });
}

function flyToHotel(hotel) {
  if (!map || !hotel) {
    return;
  }
  map.flyTo([hotel.lat, hotel.lng], 12, { duration: 1.2 });
  const marker = markerByHotelId.get(hotel.id);
  if (marker) {
    marker.openPopup();
  }
  highlightSidebarItem(hotel.id);
}

function renderSidebar() {
  const list = document.getElementById("map-hotel-list");
  if (!list) {
    return;
  }

  list.innerHTML = `<h3 class="map-list-title">All Hotels</h3>${stateRef.hotels
    .map(
      (hotel) => `
      <div class="map-hotel-item" data-id="${hotel.id}">
        <img src="${hotel.image}" alt="${hotel.name}" />
        <div>
          <div class="map-hotel-item-name">${hotel.name}</div>
          <div class="map-hotel-item-city">${hotel.city}</div>
          <div class="map-hotel-item-price">₹${hotel.price.toLocaleString("en-IN")}</div>
        </div>
        <button class="fly-btn" type="button" aria-label="Fly to hotel">↗</button>
      </div>
    `
    )
    .join("")}`;

  list.querySelectorAll(".map-hotel-item").forEach((item) => {
    item.addEventListener("click", () => {
      const id = Number(item.getAttribute("data-id") || "0");
      const hotel = stateRef.hotels.find((h) => h.id === id);
      if (hotel) {
        flyToHotel(hotel);
      }
    });
  });
}

function renderMarkers() {
  if (!map) {
    return;
  }

  markersLayer?.remove();
  markersLayer = L.layerGroup().addTo(map);
  markerByHotelId.clear();

  stateRef.hotels.forEach((hotel) => {
    const marker = L.marker([hotel.lat, hotel.lng], { icon: createPriceIcon(hotel.price) })
      .bindPopup(popupHTML(hotel), { maxWidth: 220 })
      .addTo(markersLayer);
    markerByHotelId.set(hotel.id, marker);
  });
}

function bindThemeWatcher() {
  const observer = new MutationObserver(() => {
    setTileLayer();
  });
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
}

function ensureMapSized() {
  if (map) {
    setTimeout(() => map.invalidateSize(), 300);
  }
}

// -- RENDER --------------------------------------------
export function initMapPage(appState) {
  stateRef = appState;

  const container = document.getElementById("map-container");
  if (!container || typeof L === "undefined") {
    return;
  }

  container.style.height = "520px";

  map = L.map("map-container", { center: [20.5937, 78.9629], zoom: 5, zoomControl: true });
  setTileLayer();
  renderMarkers();
  renderSidebar();
  ensureMapSized();

  bindThemeWatcher();

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }
    if (!target.classList.contains("map-book-now")) {
      return;
    }
    const id = Number(target.dataset.id || "0");
    const hotel = stateRef.hotels.find((item) => item.id === id);
    if (hotel) {
      window.dispatchEvent(new CustomEvent("hotel:selected", { detail: { hotel } }));
      window.dispatchEvent(new CustomEvent("navigate:booking"));
    }
  });

  window.addEventListener("hotel:selected", (event) => {
    const hotel = event.detail?.hotel;
    if (hotel) {
      flyToHotel(hotel);
      ensureMapSized();
    }
  });

  const mapSection = document.getElementById("map");
  if (mapSection) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            ensureMapSized();
          }
        });
      },
      { threshold: 0.2 }
    );
    observer.observe(mapSection);
  }
}

// -- EVENTS --------------------------------------------
export function flyToSelectedHotel(hotel) {
  flyToHotel(hotel);
}
