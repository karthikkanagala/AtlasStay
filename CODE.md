# CODE.md

## AtlasStay Code Guide (Beginner Friendly)

This guide explains how the project works in simple language.

## 1. Big Picture

AtlasStay is a single-page frontend app.

- `index.html` contains all UI sections.
- `main.js` starts the app and initializes modules.
- `components/` contains reusable helpers.
- `pages/` contains feature logic for each section.
- `styles/` contains all CSS.
- `data/` contains JSON datasets.

## 2. App Startup Flow

1. Browser loads `index.html`.
2. `components/themeBoot.js` applies saved theme early.
3. `main.js` runs on DOMContentLoaded.
4. Hotels are loaded from `data/hotels.json`.
5. Existing bookings are loaded from localStorage.
6. Components initialize.
7. Page modules initialize.
8. Reveal and nav observers start.

## 3. Shared State

`main.js` exports one state object:

- `hotels`
- `selectedHotel`
- `compareList`
- `bookings`

All major page modules receive this state.

## 4. Custom Events (How Modules Talk)

- `category:filter`: home -> hotels
- `hotels:filterCity`: home -> hotels
- `hotel:selected`: hotels/map -> booking/map
- `hotel:selected:byId`: modal -> hotels
- `navigate:booking`: modal/map -> booking
- `compare:updated`: hotels/compare -> compare
- `booking:saved`: booking -> history/analytics
- `themeChanged`: theme toggle -> analytics/map

## 5. Folder-by-Folder Explanation

### 5.1 Root Files

#### `index.html`

Defines the app layout, section containers, IDs, modal and toast containers, and script/style imports.

#### `main.js`

Coordinates initialization order and sets up app-wide observers.

### 5.2 `components/`

#### `themeBoot.js`

Applies stored theme before render to prevent flash.

#### `themeToggle.js`

Handles theme toggle button, updates icon, persists theme, emits `themeChanged`.

#### `navbar.js`

Handles hamburger menu, smooth scrolling, active nav state.

#### `toast.js`

Creates and displays toasts (`success`, `error`, `warning`, `info`) with auto-dismiss.

#### `modal.js`

Renders hotel detail modal and dispatches booking-related events from modal actions.

#### `hotelCard.js`

Builds hotel card DOM with callbacks for details/select/compare/wishlist.

#### `bookingForm.js`

Contains booking helper functions for nights, totals, guest limits, and INR formatting.

### 5.3 `pages/`

#### `home.js`

Controls hero slideshow, search, category tabs, city chips, and scroll-to-hotels behavior.

Slideshow detail:
- Auto-rotates every 5 seconds.
- Supports arrows, dots, keyboard, swipe.
- Timer logic clears old intervals before starting a new one to prevent duplicate timers.

#### `hotels.js`

Renders cards, applies filters/sort, handles compare selection, and renders featured deals.

#### `booking.js`

Handles booking form interactions, live pricing, validation, localStorage save, and event dispatch.

#### `compare.js`

Renders side-by-side comparison table and supports removal from compare list.

#### `map.js`

Initializes Leaflet map, renders markers/sidebar, supports fly-to and booking actions.

#### `history.js`

Renders saved bookings, computes stats, and handles cancellation.

#### `analytics.js`

Renders Chart.js charts and refreshes when theme/booking state changes.

### 5.4 `styles/`

#### `global.css`

Global variables, theme tokens, base resets, utility classes.

#### `navbar.css`

Navbar and secondary-tab styling plus responsive nav behavior.

#### `sections.css`

Hero and section-level layouts, including slideshow layers and responsive section rules.

#### `cards.css`

Card visuals for hotels/deals and action controls.

### 5.5 `data/`

#### `hotels.json`

Main dataset. Each hotel includes id, name, city, state, stars, rating, price, image, amenities, lat/lng, and featured flag.

#### `cities.json`

City list used in search/filter UX.

#### `amenities.json`

Amenities reference list used by UI features.

## 6. LocalStorage Keys

- `atlasstay_theme`
- `atlasstay_bookings`

## 7. Beginner Debug Checklist

If something does not work:

1. Check browser console for errors.
2. Confirm IDs/classes in HTML match JS selectors.
3. Confirm event names are exactly the same in emitter/listener.
4. Validate JSON format in data files.
5. Clear broken localStorage values and retry.

## 8. Safe Change Rules

1. If you rename an HTML ID, update all matching selectors in JS/CSS.
2. If you rename an event, update every emitter and listener.
3. If you change state shape, update all modules using that property.
4. If you change hotel schema, verify hotels/booking/map/compare/analytics together.
5. Keep CSS scoped to avoid cross-section conflicts.

## 9. Documentation Update

- Mar 29, 2026: Goa Beach Resort image asset was refreshed for better visual quality.