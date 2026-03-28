# AtlasStay Product Requirements Document (PRD)

## 1. Product Overview

AtlasStay is a responsive client-side hotel booking experience designed to reduce search friction and increase booking confidence.

## 2. Goals

- Help users discover hotels quickly.
- Support better decisions with compare and map context.
- Provide transparent booking calculations.
- Maintain smooth behavior across desktop and mobile.

## 3. Target Users

1. Budget travelers: price-focused discovery.
2. Business travelers: fast city-based booking.
3. Family/leisure travelers: amenities and trust-focused selection.

## 4. Functional Requirements

### 4.1 Home / Hero

- Slideshow with auto-rotation every 5 seconds.
- Manual controls: previous, next, dots, keyboard, touch swipe.
- Destination search and city chips.
- Category tabs dispatch hotel filter events.

### 4.2 Hotels

- Render grid from `data/hotels.json`.
- Filter by search, price, star, category.
- Sort by price, rating, or name.
- Empty-state handling when no matches are found.

### 4.3 Compare

- Compare up to 3 hotels.
- Side-by-side table with value/rating highlights.

### 4.4 Booking

- Select hotel and dates.
- Validate check-in/check-out and guest limits.
- Live summary (base, GST, total).
- Save booking in localStorage.

### 4.5 Map

- Leaflet map with custom price markers.
- Theme-aware tiles.
- Fly-to selected hotel.

### 4.6 History

- List bookings from localStorage.
- Show booking statistics.
- Cancel confirmed bookings.

### 4.7 Analytics

- City popularity chart.
- Star distribution chart.
- Price trend chart.
- Re-render on theme and booking updates.

## 5. Event Contracts

- `category:filter`
- `hotels:filterCity`
- `hotel:selected`
- `hotel:selected:byId`
- `navigate:booking`
- `compare:updated`
- `booking:saved`
- `themeChanged`

## 6. Non-Functional Requirements

- Frontend only, no backend dependency.
- Responsive UI for mobile/tablet/desktop.
- Modular ES module architecture.
- Clear visual feedback (toast/modal).

## 7. Constraints

- Static JSON dataset only.
- Device-local persistence only.
- External CDN dependency for Leaflet and Chart.js.

## 8. Success Indicators

- Faster search-to-booking flow.
- More compare/map engagement.
- Reliable booking persistence.
- Stable slideshow auto-rotation behavior.

## 9. Documentation Update

- Mar 29, 2026: Goa Beach Resort image asset was refreshed for better visual quality.