# AtlasStay

AtlasStay is a frontend-only hotel discovery and booking web application built with HTML, CSS, and Vanilla JavaScript modules.

## What You Can Do

- Browse and filter hotels
- Search by city or hotel name
- Compare up to 3 hotels
- Book a hotel with live price summary
- Explore hotels on an interactive map
- View booking history and cancel bookings
- View analytics charts
- Toggle light and dark theme

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript (ES Modules)
- Leaflet (map)
- Chart.js (analytics)

## Project Structure

```text
AtlasStay/
|-- index.html
|-- main.js
|-- README.md
|-- CODE.md
|-- PRD.md
|-- PROBLEM_STATEMENT.md
|-- components/
|   |-- bookingForm.js
|   |-- hotelCard.js
|   |-- modal.js
|   |-- navbar.js
|   |-- themeBoot.js
|   |-- themeToggle.js
|   |-- toast.js
|-- pages/
|   |-- analytics.js
|   |-- booking.js
|   |-- compare.js
|   |-- history.js
|   |-- home.js
|   |-- hotels.js
|   |-- map.js
|-- styles/
|   |-- cards.css
|   |-- global.css
|   |-- navbar.css
|   |-- sections.css
|-- data/
|   |-- amenities.json
|   |-- cities.json
|   |-- hotels.json
```

## How to Run Locally

1. Open the project folder in VS Code.
2. Start a local static server (Live Server extension recommended).
3. Open `index.html` through that server.

## Current App Behavior Notes

- Hero slideshow auto-rotates every 5 seconds.
- Slideshow timer is guarded to keep only one active interval.
- Theme and bookings are persisted in localStorage.

## LocalStorage Keys

- `atlasstay_theme`
- `atlasstay_bookings`

## Scope

- Frontend-only implementation
- Static JSON data
- No backend authentication/payment APIs

## Documentation Update

- Mar 29, 2026: Goa Beach Resort image asset was refreshed for better visual quality.