// -- pages/home.js -----------------------------------------------------
// Handles: hero slideshow, city chip clicks, search bar, secondary nav

const SLIDE_IMAGES = [
  {
    url: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600&q=80&auto=format&fit=crop",
    label: "🌊 Goa · Beachfront Resort",
    tint: "rgba(14, 80, 120, 0.45)"
  },
  {
    url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1600&q=80&auto=format&fit=crop",
    label: "🌟 Mumbai · Luxury Hotel",
    tint: "rgba(20, 20, 70, 0.45)"
  },
  {
    url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1600&q=80&auto=format&fit=crop",
    label: "🏊 Kerala · Resort & Spa",
    tint: "rgba(14, 80, 55, 0.45)"
  },
  {
    url: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1600&q=80&auto=format&fit=crop",
    label: "🏰 Jaipur · Heritage Palace",
    tint: "rgba(100, 50, 14, 0.45)"
  },
  {
    url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1600&q=80&auto=format&fit=crop",
    label: "🏔️ Shimla · Mountain Retreat",
    tint: "rgba(30, 50, 90, 0.45)"
  }
];

export function initHeroSlideshow() {
  const container = document.getElementById("hero-slideshow");
  const dotsWrap = document.getElementById("slide-dots");
  const locationText = document.getElementById("slide-location-text");
  const prevBtn = document.getElementById("slide-prev");
  const nextBtn = document.getElementById("slide-next");
  const progressBar = document.getElementById("slide-progress");
  const overlay = document.querySelector(".hero-overlay");

  if (!container) {
    return;
  }

  let current = 0;
  let autoplayTimer = null;

  container.innerHTML = "";
  if (dotsWrap) {
    dotsWrap.innerHTML = "";
  }

  SLIDE_IMAGES.forEach((slide, index) => {
    const div = document.createElement("div");
    div.className = `hero-slide${index === 0 ? " active" : ""}`;
    div.style.backgroundImage = `url('${slide.url}')`;
    container.appendChild(div);
  });

  if (dotsWrap) {
    SLIDE_IMAGES.forEach((_, index) => {
      const dot = document.createElement("button");
      dot.className = `slide-dot${index === 0 ? " active" : ""}`;
      dot.setAttribute("aria-label", `Slide ${index + 1}`);
      dot.addEventListener("click", () => {
        goTo(index);
        resetTimer();
      });
      dotsWrap.appendChild(dot);
    });
  }

  function goTo(index) {
    const slides = container.querySelectorAll(".hero-slide");
    const dots = dotsWrap?.querySelectorAll(".slide-dot");

    slides[current]?.classList.remove("active");
    dots?.[current]?.classList.remove("active");

    current = (index + SLIDE_IMAGES.length) % SLIDE_IMAGES.length;

    slides[current]?.classList.add("active");
    dots?.[current]?.classList.add("active");

    if (overlay) {
      const tint = SLIDE_IMAGES[current].tint;
      overlay.style.background = `linear-gradient(160deg, ${tint} 0%, rgba(5,5,25,0.35) 40%, rgba(0,0,10,0.72) 100%)`;
    }

    if (locationText) {
      locationText.style.opacity = "0";
      setTimeout(() => {
        locationText.textContent = SLIDE_IMAGES[current].label;
        locationText.style.opacity = "1";
      }, 300);
    }

    if (progressBar) {
      progressBar.style.transition = "none";
      progressBar.style.width = "0%";
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          progressBar.style.transition = "width 5s linear";
          progressBar.style.width = "100%";
        })
      );
    }
  }

  function next() {
    goTo(current + 1);
  }

  function prev() {
    goTo(current - 1);
  }

  function startTimer() {
    autoplayTimer = setInterval(next, 5000);
  }

  function resetTimer() {
    clearInterval(autoplayTimer);
    startTimer();
  }

  nextBtn?.addEventListener("click", () => {
    next();
    resetTimer();
  });

  prevBtn?.addEventListener("click", () => {
    prev();
    resetTimer();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "ArrowRight") {
      next();
      resetTimer();
    }
    if (event.key === "ArrowLeft") {
      prev();
      resetTimer();
    }
  });

  let touchX = 0;
  container.addEventListener(
    "touchstart",
    (event) => {
      touchX = event.touches[0].clientX;
    },
    { passive: true }
  );
  container.addEventListener(
    "touchend",
    (event) => {
      const diff = touchX - event.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) {
          next();
        } else {
          prev();
        }
        resetTimer();
      }
    },
    { passive: true }
  );

  const hero = container.closest(".hero-section");
  hero?.addEventListener("mouseenter", () => clearInterval(autoplayTimer));
  hero?.addEventListener("mouseleave", startTimer);

  goTo(0);
  startTimer();
}

function scrollToHotels() {
  requestAnimationFrame(() => {
    setTimeout(() => {
      const section = document.getElementById("hotels");
      if (!section) {
        return;
      }
      const navH = document.querySelector("nav, .navbar")?.offsetHeight || 72;
      const subNavH = document.querySelector(".secondary-nav")?.offsetHeight || 50;
      const top = section.getBoundingClientRect().top + window.pageYOffset - navH - subNavH - 20;
      window.scrollTo({ top, behavior: "smooth" });
    }, 420);
  });
}

export function initSecondaryNav(hotels) {
  const tabs = document.querySelectorAll(".cat-tab");
  const grid = document.getElementById("hotels-grid");

  if (!tabs.length) {
    return;
  }

  function filterByCategory(category, list) {
    switch (category) {
      case "luxury":
        return list.filter((hotel) => hotel.stars >= 5 || hotel.price >= 4500);
      case "business":
        return list.filter((hotel) => {
          const amenities = hotel.amenities.map((item) => item.toLowerCase());
          return (
            amenities.some((item) => ["coworking space", "parking", "breakfast", "airport shuttle"].includes(item)) ||
            hotel.stars === 4
          );
        });
      case "beachside":
        return list.filter((hotel) => {
          const amenities = hotel.amenities.map((item) => item.toLowerCase());
          return amenities.some((item) => ["beach access", "sea view", "pool"].includes(item)) || hotel.city === "Goa";
        });
      case "heritage":
        return list.filter((hotel) => {
          const amenities = hotel.amenities.map((item) => item.toLowerCase());
          return (
            amenities.some((item) => ["heritage tour", "heritage walk tours", "cultural shows"].includes(item)) ||
            ["Jaipur", "Kolkata"].includes(hotel.city)
          );
        });
      default:
        return list;
    }
  }

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      tabs.forEach((item) => item.classList.remove("active"));
      tab.classList.add("active");

      const category = tab.dataset.category;
      const filtered = filterByCategory(category, hotels);

      if (grid) {
        grid.style.opacity = "0";
      }

      setTimeout(() => {
        document.dispatchEvent(
          new CustomEvent("category:filter", {
            detail: { category, hotels: filtered }
          })
        );
        if (grid) {
          grid.style.opacity = "1";
        }
        scrollToHotels();
      }, 280);
    });
  });

  document.querySelectorAll(".city-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      const city = chip.dataset.city;
      tabs.forEach((item) => item.classList.remove("active"));
      document.querySelector('.cat-tab[data-category="all"]')?.classList.add("active");

      const filtered = hotels.filter((hotel) => hotel.city.toLowerCase().includes(city.toLowerCase()));
      if (grid) {
        grid.style.opacity = "0";
      }

      setTimeout(() => {
        document.dispatchEvent(
          new CustomEvent("category:filter", {
            detail: { category: "city", hotels: filtered }
          })
        );
        if (grid) {
          grid.style.opacity = "1";
        }
        scrollToHotels();
      }, 280);
    });
  });
}

export function initHome(hotels) {
  const searchBtn = document.getElementById("hero-search-btn");
  const destInput = document.getElementById("hero-destination");
  const checkIn = document.getElementById("hero-checkin");
  const checkOut = document.getElementById("hero-checkout");

  const today = new Date().toISOString().split("T")[0];
  if (checkIn instanceof HTMLInputElement) {
    checkIn.min = today;
  }
  if (checkOut instanceof HTMLInputElement) {
    checkOut.min = today;
  }

  checkIn?.addEventListener("change", () => {
    if (checkIn instanceof HTMLInputElement && checkOut instanceof HTMLInputElement) {
      checkOut.min = checkIn.value || today;
      if (checkOut.value && checkOut.value <= checkIn.value) {
        checkOut.value = "";
      }
    }
  });

  searchBtn?.addEventListener("click", () => {
    const query = destInput?.value.trim().toLowerCase() || "";
    if (!query) {
      scrollToHotels();
      return;
    }
    const filtered = hotels.filter(
      (hotel) => hotel.city.toLowerCase().includes(query) || hotel.name.toLowerCase().includes(query)
    );
    document.dispatchEvent(
      new CustomEvent("category:filter", {
        detail: { category: "search", hotels: filtered }
      })
    );
    scrollToHotels();
  });

  destInput?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      searchBtn?.click();
    }
  });
}

export { scrollToHotels };
