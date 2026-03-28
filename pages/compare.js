// -- FILE: compare.js ----------------------------------
// PURPOSE: Render side-by-side comparison table from selected hotels
// -- DATA ----------------------------------------------
let stateRef;

function buildRow(label, values, classes = []) {
  const cells = values
    .map((value, index) => {
      const className = classes[index] ? ` class="${classes[index]}"` : "";
      return `<td${className}>${value}</td>`;
    })
    .join("");
  return `<tr><td>${label}</td>${cells}</tr>`;
}

function removeFromCompare(hotelId) {
  stateRef.compareList = stateRef.compareList.filter((id) => id !== hotelId);
  window.dispatchEvent(new CustomEvent("compare:updated", { detail: { ids: [...stateRef.compareList] } }));
}

// -- RENDER --------------------------------------------
export function renderCompareTable() {
  const empty = document.getElementById("compare-empty");
  const wrap = document.getElementById("compare-table-wrap");
  const table = document.getElementById("compare-table");

  if (!empty || !wrap || !table) {
    return;
  }

  const compareHotels = stateRef.compareList
    .map((id) => stateRef.hotels.find((hotel) => hotel.id === id))
    .filter(Boolean);

  if (!compareHotels.length) {
    empty.classList.remove("is-hidden");
    wrap.classList.add("is-hidden");
    table.innerHTML = "";
    return;
  }

  empty.classList.add("is-hidden");
  wrap.classList.remove("is-hidden");

  const lowestPrice = Math.min(...compareHotels.map((hotel) => hotel.price));
  const highestRating = Math.max(...compareHotels.map((hotel) => hotel.rating));

  const headCells = compareHotels.map((hotel) => `<th>${hotel.name}</th>`).join("");

  const prices = compareHotels.map((hotel) => `₹${hotel.price.toLocaleString("en-IN")}`);
  const priceClasses = compareHotels.map((hotel) => (hotel.price === lowestPrice ? "best-value" : ""));

  const ratings = compareHotels.map((hotel) => `${hotel.rating} (${hotel.reviews})`);
  const ratingClasses = compareHotels.map((hotel) => (hotel.rating === highestRating ? "best-rated" : ""));

  const removeButtons = compareHotels.map(
    (hotel) => `<button class="btn-remove-compare" type="button" data-id="${hotel.id}">Remove</button>`
  );

  table.innerHTML = `
    <tr>
      <th>Property</th>
      ${headCells}
    </tr>
    ${buildRow("City", compareHotels.map((hotel) => `${hotel.city}, ${hotel.state}`))}
    ${buildRow("Stars", compareHotels.map((hotel) => `${hotel.stars}★`))}
    ${buildRow("Price", prices, priceClasses)}
    ${buildRow("Rating", ratings, ratingClasses)}
    ${buildRow("Amenities", compareHotels.map((hotel) => hotel.amenities.slice(0, 4).join(", ")))}
    ${buildRow("Action", removeButtons)}
  `;

  table.querySelectorAll(".btn-remove-compare").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id || "0");
      if (id) {
        removeFromCompare(id);
      }
    });
  });
}

export function initComparePage(appState) {
  stateRef = appState;
  renderCompareTable();

  window.addEventListener("compare:updated", () => {
    renderCompareTable();
  });
}

// -- EVENTS --------------------------------------------
export function clearCompareList() {
  stateRef.compareList = [];
  renderCompareTable();
}
