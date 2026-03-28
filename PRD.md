# AtlasStay Product Requirements Document

## 1. Product Summary

AtlasStay is a client-side hotel booking experience focused on fast discovery, confident selection, and frictionless booking.

The product unifies search, listing filters, comparison, booking, map exploration, booking history, and visual analytics in one responsive interface.

## 2. Objectives

- Reduce search-to-booking effort for users.
- Improve hotel decision confidence using compare and map context.
- Keep post-booking data visible through local history.
- Maintain smooth UI interactions on desktop and mobile.

## 3. Target Users

1. Budget Travelers: optimize for price and value.
2. Business Travelers: prioritize city location and speed.
3. Leisure Families: prioritize amenities, ratings, and trust.

## 4. Core Features (Current Build)

### 4.1 Home / Hero

- Background slideshow with auto-rotation.
- Manual controls: previous/next, dots, keyboard arrows, touch swipe.
- Destination search and city chips.
- Category tabs dispatch filters to hotels section.

### 4.2 Hotels

- Grid rendering from `data/hotels.json`.
- Search by city/hotel name.
- Price range filtering.
- Star filtering and sorting.
- Category filters via custom events.

### 4.3 Compare

- Compare up to 3 hotels.
- Side-by-side table for price, stars, rating, amenities.

### 4.4 Booking

- Hotel selection binding.
- Date and guest validation.
- Live summary calculations.
- Booking persistence in localStorage.

### 4.5 Map

- Leaflet markers for hotels.
- Theme-aware tiles.
- Fly-to interaction from selected hotel.

### 4.6 History

- Read bookings from localStorage.
- Status/cancel actions.
- Summary metrics.

### 4.7 Analytics

- Charts for city and rating insights.
- Theme-aware chart refresh behavior.

## 5. Event Contracts

- `category:filter`
- `hotel:selected`
- `hotel:selected:byId`
- `compare:updated`
- `booking:saved`
- `navigate:booking`
- `themeChanged`
- `hotels:filterCity`

## 6. Non-Functional Requirements

- Frontend only (no backend dependency).
- Responsive layout for mobile/tablet/desktop.
- ES module architecture with clear separation by page/component.
- Accessible labels and interaction feedback via toast/modal.

## 7. KPIs

- Search-to-booking completion rate.
- Compare feature usage rate.
- Booking save success rate.
- Map interaction rate.
- Returning session activity (same browser/device).

## 8. Constraints

- Static JSON data; no real-time inventory.
- Local device persistence only.
- Third-party CDN availability required for map/charts.

## 9. Future Enhancements

- Backend APIs for inventory and pricing.
- Authenticated user accounts.
- Cloud synced booking history.
- Payment integrations.
