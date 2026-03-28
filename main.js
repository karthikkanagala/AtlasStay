// -- FILE: main.js -------------------------------------
// PURPOSE: Bootstrap AtlasStay app, load data, and initialize all modules
// -- DATA ----------------------------------------------
import { initNavbar, highlightNav } from "./components/navbar.js";
import { initThemeToggle } from "./components/themeToggle.js";
import { initToast } from "./components/toast.js";
import { initModal } from "./components/modal.js";

import { initHome, initSecondaryNav, initHeroSlideshow } from "./pages/home.js";
import { initHotelsPage } from "./pages/hotels.js";
import { initComparePage } from "./pages/compare.js";
import { initBookingPage } from "./pages/booking.js";
import { initMapPage } from "./pages/map.js";
import { initHistoryPage } from "./pages/history.js";
import { initAnalyticsPage } from "./pages/analytics.js";

export const AppState = {
  hotels: [],
  selectedHotel: null,
  compareList: [],
  bookings: []
};

function loadBookings() {
  const raw = localStorage.getItem("atlasstay_bookings");
  if (!raw) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function setupScrollReveal() {
  const revealNodes = document.querySelectorAll(".reveal");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15
    }
  );

  revealNodes.forEach((node) => observer.observe(node));
}

function setupNavHighlight() {
  const sections = ["home", "hotels", "compare", "booking", "map", "history", "analytics"];
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          highlightNav(entry.target.id);
        }
      });
    },
    {
      rootMargin: "-30% 0px -55% 0px",
      threshold: 0.1
    }
  );

  sections.forEach((id) => {
    const section = document.getElementById(id);
    if (section) {
      observer.observe(section);
    }
  });
}

// -- RENDER --------------------------------------------
async function bootstrap() {
  initHeroSlideshow();

  const response = await fetch("./data/hotels.json");
  AppState.hotels = await response.json();
  AppState.bookings = loadBookings();

  initThemeToggle();
  initNavbar();
  initToast();
  initModal();

  initHome(AppState.hotels);
  initSecondaryNav(AppState.hotels);
  initHotelsPage(AppState);
  initComparePage(AppState);
  initBookingPage(AppState);
  initMapPage(AppState);
  initHistoryPage(AppState);
  initAnalyticsPage(AppState);

  setupScrollReveal();
  setupNavHighlight();
}

// -- EVENTS --------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  bootstrap().catch((error) => {
    void error;
    window.showToast?.("Failed to initialize app", "error", 3500);
  });
});
