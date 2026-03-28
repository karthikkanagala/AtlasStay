// -- FILE: analytics.js --------------------------------
// PURPOSE: Render chart-based analytics with theme-aware chart colors
// -- DATA ----------------------------------------------
let charts = [];
let stateRef;

export function getCSSVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

function destroyCharts() {
  charts.forEach((chart) => chart.destroy());
  charts = [];
}

function commonAxisText() {
  return getCSSVar("--chart-text") || "#5A5A7A";
}

function commonGrid() {
  return getCSSVar("--chart-grid") || "rgba(0,0,0,0.06)";
}

function cityCounts(hotels) {
  const counts = hotels.reduce((acc, hotel) => {
    acc[hotel.city] = (acc[hotel.city] || 0) + 1;
    return acc;
  }, {});
  return counts;
}

function starCounts(hotels) {
  const base = { "3★": 0, "4★": 0, "5★": 0 };
  hotels.forEach((hotel) => {
    const key = `${hotel.stars}★`;
    if (key in base) {
      base[key] += 1;
    }
  });
  return base;
}

function createCityChart(hotels) {
  const ctx = document.getElementById("chart-bookings-city");
  if (!(ctx instanceof HTMLCanvasElement)) {
    return null;
  }

  const counts = cityCounts(hotels);
  return new Chart(ctx, {
    type: "bar",
    data: {
      labels: Object.keys(counts),
      datasets: [
        {
          label: "Hotels",
          data: Object.values(counts),
          backgroundColor: "rgba(108,99,255,0.75)",
          borderColor: "#6C63FF",
          borderWidth: 1,
          borderRadius: 8,
          barThickness: "flex"
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          ticks: { color: commonAxisText() },
          grid: { color: commonGrid() }
        },
        y: {
          beginAtZero: true,
          ticks: { stepSize: 1, color: commonAxisText() },
          grid: { color: commonGrid() }
        }
      },
      plugins: {
        legend: {
          labels: { color: commonAxisText() }
        }
      }
    }
  });
}

function createStarChart(hotels) {
  const ctx = document.getElementById("chart-star-rating");
  if (!(ctx instanceof HTMLCanvasElement)) {
    return null;
  }

  const counts = starCounts(hotels);
  return new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: Object.keys(counts),
      datasets: [
        {
          data: Object.values(counts),
          backgroundColor: ["#22C55E", "#6C63FF", "#F59E0B"],
          borderWidth: 0
        }
      ]
    },
    options: {
      cutout: "65%",
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: { color: commonAxisText() }
        }
      }
    }
  });
}

function createTrendChart() {
  const ctx = document.getElementById("chart-price-trends");
  if (!(ctx instanceof HTMLCanvasElement)) {
    return null;
  }

  return new Chart(ctx, {
    type: "line",
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [
        {
          label: "Average Price",
          data: [3800, 3500, 3950, 4100, 4300, 3700],
          borderColor: "#22C55E",
          backgroundColor: "rgba(34,197,94,0.18)",
          tension: 0.4,
          fill: true,
          pointRadius: 3,
          pointHoverRadius: 5
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          ticks: { color: commonAxisText() },
          grid: { color: commonGrid() }
        },
        y: {
          ticks: { color: commonAxisText() },
          grid: { color: commonGrid() }
        }
      },
      plugins: {
        legend: {
          labels: { color: commonAxisText() }
        }
      }
    }
  });
}

// -- RENDER --------------------------------------------
export function renderAnalyticsCharts() {
  if (typeof Chart === "undefined") {
    return;
  }

  destroyCharts();

  const c1 = createCityChart(stateRef.hotels);
  const c2 = createStarChart(stateRef.hotels);
  const c3 = createTrendChart();

  charts = [c1, c2, c3].filter(Boolean);
}

export function initAnalyticsPage(appState) {
  stateRef = appState;
  renderAnalyticsCharts();

  window.addEventListener("themeChanged", () => {
    renderAnalyticsCharts();
  });

  window.addEventListener("booking:saved", () => {
    renderAnalyticsCharts();
  });
}

// -- EVENTS --------------------------------------------
export function getChartInstances() {
  return charts;
}
