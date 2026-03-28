// -- FILE: booking.js ----------------------------------
// PURPOSE: Booking form behavior, live pricing, and reservation persistence
// -- DATA ----------------------------------------------
import { calculateNights, calculateBookingTotal, clampGuests, formatINR } from "../components/bookingForm.js";

let stateRef;
let guests = 1;

function getSelectedHotel() {
  const select = document.getElementById("booking-hotel");
  if (!(select instanceof HTMLSelectElement)) {
    return null;
  }
  const id = Number(select.value || "0");
  return stateRef.hotels.find((hotel) => hotel.id === id) || null;
}

function syncSummaryHotel(hotel) {
  const img = document.getElementById("summary-hotel-img");
  const name = document.getElementById("summary-hotel");
  const stars = document.getElementById("summary-stars");

  if (!img || !name || !stars) {
    return;
  }

  if (!hotel) {
    img.setAttribute("src", "https://picsum.photos/seed/placeholder/80/80");
    name.textContent = "Select a hotel";
    stars.textContent = "";
    return;
  }

  img.setAttribute("src", hotel.image);
  img.setAttribute("alt", hotel.name);
  name.textContent = hotel.name;
  stars.textContent = "★".repeat(hotel.stars);
}

function setSummaryValue(id, value) {
  const el = document.getElementById(id);
  if (el) {
    el.textContent = value;
  }
}

function validateDates(checkInValue, checkOutValue) {
  if (!checkInValue || !checkOutValue) {
    return { valid: false, message: "Please select both check-in and check-out dates." };
  }
  if (new Date(checkOutValue) <= new Date(checkInValue)) {
    return { valid: false, message: "Check-out must be after check-in." };
  }
  return { valid: true, message: "" };
}

function updatePricingSummary() {
  const checkIn = document.getElementById("booking-checkin");
  const checkOut = document.getElementById("booking-checkout");
  const summaryNote = document.getElementById("summary-note");

  if (!(checkIn instanceof HTMLInputElement) || !(checkOut instanceof HTMLInputElement) || !summaryNote) {
    return;
  }

  const hotel = getSelectedHotel();
  syncSummaryHotel(hotel);

  const nights = calculateNights(checkIn.value, checkOut.value);
  const perNight = hotel?.price || 0;
  const { base, gst, total } = calculateBookingTotal(perNight, nights, guests);

  setSummaryValue("summary-nights", String(nights));
  setSummaryValue("summary-guests", String(guests));
  setSummaryValue("summary-price-per-night", formatINR(perNight));
  setSummaryValue("summary-base", formatINR(base));
  setSummaryValue("summary-gst", formatINR(gst));
  setSummaryValue("summary-total", formatINR(total));

  if (!hotel || nights <= 0) {
    summaryNote.textContent = "Select hotel and valid dates to calculate price.";
  } else {
    summaryNote.textContent = "Live total updated with GST.";
  }
}

function saveBooking() {
  const hotel = getSelectedHotel();
  const checkIn = document.getElementById("booking-checkin");
  const checkOut = document.getElementById("booking-checkout");
  const specialRequests = document.getElementById("special-requests");

  if (!hotel || !(checkIn instanceof HTMLInputElement) || !(checkOut instanceof HTMLInputElement)) {
    window.showToast?.("Please choose a hotel and valid dates", "error");
    return;
  }

  const dateCheck = validateDates(checkIn.value, checkOut.value);
  if (!dateCheck.valid) {
    window.showToast?.(dateCheck.message, "error");
    return;
  }

  const nights = calculateNights(checkIn.value, checkOut.value);
  const totals = calculateBookingTotal(hotel.price, nights, guests);
  const booking = {
    id: `BK-${Date.now()}`,
    hotelId: hotel.id,
    hotelName: hotel.name,
    hotelImage: hotel.image,
    city: hotel.city,
    checkIn: checkIn.value,
    checkOut: checkOut.value,
    nights,
    guests,
    total: totals.total,
    status: "confirmed",
    specialRequests: specialRequests instanceof HTMLTextAreaElement ? specialRequests.value.trim() : "",
    createdAt: new Date().toISOString()
  };

  stateRef.bookings.push(booking);
  localStorage.setItem("atlasstay_bookings", JSON.stringify(stateRef.bookings));
  window.showToast?.("Booking confirmed successfully", "success");
  window.dispatchEvent(new CustomEvent("booking:saved", { detail: { booking } }));
}

function setMinDates() {
  const checkIn = document.getElementById("booking-checkin");
  const checkOut = document.getElementById("booking-checkout");
  if (!(checkIn instanceof HTMLInputElement) || !(checkOut instanceof HTMLInputElement)) {
    return;
  }
  const today = new Date().toISOString().split("T")[0];
  checkIn.min = today;
  checkOut.min = today;
}

// -- RENDER --------------------------------------------
export function initBookingPage(appState) {
  stateRef = appState;
  const select = document.getElementById("booking-hotel");
  const guestsCount = document.getElementById("guests-count");
  const plusBtn = document.getElementById("guests-plus");
  const minusBtn = document.getElementById("guests-minus");
  const confirmBtn = document.getElementById("confirm-booking");
  const checkIn = document.getElementById("booking-checkin");
  const checkOut = document.getElementById("booking-checkout");

  if (!(select instanceof HTMLSelectElement)) {
    return;
  }

  select.innerHTML = `<option value="">Select a hotel</option>${stateRef.hotels
    .map((hotel) => `<option value="${hotel.id}">${hotel.name} - ${hotel.city}</option>`)
    .join("")}`;

  setMinDates();
  updatePricingSummary();

  if (guestsCount) {
    guestsCount.textContent = String(guests);
  }

  select.addEventListener("change", updatePricingSummary);
  checkIn?.addEventListener("change", () => {
    if (checkIn instanceof HTMLInputElement && checkOut instanceof HTMLInputElement) {
      checkOut.min = checkIn.value || checkOut.min;
    }
    updatePricingSummary();
  });
  checkOut?.addEventListener("change", updatePricingSummary);

  plusBtn?.addEventListener("click", () => {
    guests = clampGuests(guests + 1, 1, 10);
    if (guestsCount) {
      guestsCount.textContent = String(guests);
    }
    updatePricingSummary();
  });

  minusBtn?.addEventListener("click", () => {
    guests = clampGuests(guests - 1, 1, 10);
    if (guestsCount) {
      guestsCount.textContent = String(guests);
    }
    updatePricingSummary();
  });

  confirmBtn?.addEventListener("click", saveBooking);

  window.addEventListener("hotel:selected", (event) => {
    const hotel = event.detail?.hotel;
    if (!hotel) {
      return;
    }
    select.value = String(hotel.id);
    syncSummaryHotel(hotel);
    updatePricingSummary();
  });

  window.addEventListener("navigate:booking", () => {
    const section = document.getElementById("booking");
    if (!section) {
      return;
    }
    const y = section.getBoundingClientRect().top + window.scrollY - 116;
    window.scrollTo({ top: y, behavior: "smooth" });
  });
}

// -- EVENTS --------------------------------------------
export function recalculateBookingSummary() {
  updatePricingSummary();
}
