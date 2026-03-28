// -- FILE: history.js ----------------------------------
// PURPOSE: Render booking history, cancellation flow, and summary stats
// -- DATA ----------------------------------------------
let stateRef;

function formatINR(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

function statusClass(status) {
  return status === "cancelled" ? "status-cancelled" : "status-confirmed";
}

function computeStats(bookings) {
  const confirmed = bookings.filter((item) => item.status !== "cancelled");
  const totalSpent = confirmed.reduce((sum, item) => sum + Number(item.total || 0), 0);
  const avg = confirmed.length ? Math.round(totalSpent / confirmed.length) : 0;
  return {
    totalBookings: bookings.length,
    totalSpent,
    avg
  };
}

function renderStats(bookings) {
  const stats = computeStats(bookings);
  const totalEl = document.getElementById("stat-total-bookings");
  const spentEl = document.getElementById("stat-total-spent");
  const avgEl = document.getElementById("stat-avg-booking");

  if (totalEl) {
    totalEl.textContent = String(stats.totalBookings);
  }
  if (spentEl) {
    spentEl.textContent = formatINR(stats.totalSpent);
  }
  if (avgEl) {
    avgEl.textContent = formatINR(stats.avg);
  }
}

function cancelBooking(bookingId) {
  const bookings = stateRef.bookings.map((booking) =>
    booking.id === bookingId ? { ...booking, status: "cancelled" } : booking
  );
  stateRef.bookings = bookings;
  localStorage.setItem("atlasstay_bookings", JSON.stringify(bookings));
  window.showToast?.("Booking cancelled", "warning");
  renderHistory();
}

// -- RENDER --------------------------------------------
export function renderHistory() {
  const list = document.getElementById("history-list");
  if (!list) {
    return;
  }

  const bookings = [...stateRef.bookings].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  renderStats(bookings);

  if (!bookings.length) {
    list.innerHTML = '<div class="empty-state">No bookings yet. Book a stay to see history here.</div>';
    return;
  }

  list.innerHTML = bookings
    .map(
      (booking) => `
      <article class="history-card">
        <img src="${booking.hotelImage}" alt="${booking.hotelName}" />
        <div class="history-info">
          <h3 class="history-name">${booking.hotelName}</h3>
          <p class="history-city">${booking.city}</p>
          <p class="history-dates">${booking.checkIn} → ${booking.checkOut} | ${booking.nights} night(s) | ${booking.guests} guest(s)</p>
        </div>
        <div class="history-right">
          <div class="history-total">${formatINR(booking.total)}</div>
          <span class="status-pill ${statusClass(booking.status)}">${booking.status}</span>
          ${
            booking.status === "confirmed"
              ? `<button class="cancel-btn" type="button" data-id="${booking.id}">Cancel</button>`
              : ""
          }
        </div>
      </article>
    `
    )
    .join("");

  list.querySelectorAll(".cancel-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.getAttribute("data-id");
      if (id) {
        cancelBooking(id);
      }
    });
  });
}

export function initHistoryPage(appState) {
  stateRef = appState;
  renderHistory();

  window.addEventListener("booking:saved", () => {
    renderHistory();
  });
}

// -- EVENTS --------------------------------------------
export function refreshHistory() {
  renderHistory();
}
