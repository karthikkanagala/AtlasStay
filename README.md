# AtlasStay - Smart Hotel Booking

AtlasStay is a complete frontend-only hotel booking experience built with HTML5, CSS3, and Vanilla JavaScript ES modules. It includes search, filtering, compare, booking, map exploration, booking history, and analytics in a single responsive app.

# AtlasStay

AtlasStay is a responsive hotel discovery and booking web app built with HTML, CSS, and Vanilla JavaScript modules.

It provides a complete front-end flow:
- Hero search and city quick picks
- Hotel filtering, sorting, and category tabs
- Compare up to 3 hotels
- Booking with live summary and persistence
- Interactive map view (Leaflet)
- Booking history and cancellation actions
- Analytics charts (Chart.js)
- Theme toggle with local persistence

## Stack

- HTML5
- CSS3
- Vanilla JavaScript (ES modules)
- Leaflet 1.9.x
- Chart.js

## Project Structure

```text
AtlasStay/
├── index.html
├── main.js
├── README.md
├── CODE.md
├── PRD.md
├── PROBLEM_STATEMENT.md
├── CONTRIBUTING.md
├── CHANGELOG.md
├── components/
│   ├── bookingForm.js
│   ├── hotelCard.js
│   ├── modal.js
│   ├── navbar.js
│   ├── themeBoot.js
│   ├── themeToggle.js
│   └── toast.js
├── pages/
│   ├── analytics.js
│   ├── booking.js
│   ├── compare.js
│   ├── history.js
│   ├── home.js
│   ├── hotels.js
│   └── map.js
├── styles/
│   ├── cards.css
│   ├── global.css
│   ├── navbar.css
│   └── sections.css
└── data/
    ├── amenities.json
    ├── cities.json
    └── hotels.json
```

## Run Locally

1. Open the project root in VS Code.
2. Serve the app through a local static server.
3. Open `index.html` through that server.

Live Server extension is recommended for local development.

## App Flow

1. `main.js` loads hotels JSON and bootstraps all modules.
2. `pages/home.js` controls hero slideshow, search, and category tab dispatch.
3. `pages/hotels.js` renders cards and handles filters + category events.
4. `pages/booking.js` persists bookings and dispatches booking events.
5. `pages/map.js`, `pages/history.js`, `pages/analytics.js`, `pages/compare.js` react to app events/state.

## Key LocalStorage Keys

- `atlasstay_bookings`
- `atlasstay_theme`

## Notes

- No backend/API is required.
- Data is loaded from local JSON files.
- All interactions are client-side.
