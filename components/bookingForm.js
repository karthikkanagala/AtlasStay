// -- FILE: bookingForm.js ------------------------------
// PURPOSE: Shared booking helpers for date and price calculations
// -- DATA ----------------------------------------------
const GST_RATE = 0.12;

// -- RENDER --------------------------------------------
export function calculateNights(checkIn, checkOut) {
  if (!checkIn || !checkOut) {
    return 0;
  }
  const inDate = new Date(checkIn);
  const outDate = new Date(checkOut);
  const diff = outDate.getTime() - inDate.getTime();
  if (Number.isNaN(diff) || diff <= 0) {
    return 0;
  }
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function calculateBookingTotal(pricePerNight, nights, guests) {
  const base = Number(pricePerNight) * Number(nights) * Math.max(1, Number(guests));
  const gst = Math.round(base * GST_RATE);
  const total = base + gst;
  return { base, gst, total };
}

export function formatINR(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

// -- EVENTS --------------------------------------------
export function clampGuests(value, min = 1, max = 10) {
  return Math.max(min, Math.min(max, Number(value) || min));
}
