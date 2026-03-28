# CODE.md

## AtlasStay Code Guide (Beginner Friendly)

This document explains the project in simple terms.

If you are new to JavaScript projects, read this in order:
1. Project idea
2. How files are organized
3. How app starts
4. How modules talk to each other
5. Folder-by-folder, file-by-file explanation

## 1. What This Project Does

AtlasStay is a hotel booking frontend app.

A user can:
1. Search and browse hotels
2. Filter and sort results
3. Compare up to 3 hotels
4. Fill booking form and save booking
5. View hotels on map
6. Check booking history
7. View analytics charts
8. Switch light and dark theme

Important: this is frontend only. There is no backend server or real payment API.

## 2. Project Structure (Simple View)

1. Root files:
- [AtlasStay/index.html](AtlasStay/index.html)
- [AtlasStay/main.js](AtlasStay/main.js)
- documentation files

2. Reusable logic:
- [AtlasStay/components](AtlasStay/components)

3. Section/page logic:
- [AtlasStay/pages](AtlasStay/pages)

4. Styling:
- [AtlasStay/styles](AtlasStay/styles)

5. Static data:
- [AtlasStay/data](AtlasStay/data)

## 3. How the App Starts (Step by Step)

Startup flow:
1. Browser opens [AtlasStay/index.html](AtlasStay/index.html)
2. [AtlasStay/components/themeBoot.js](AtlasStay/components/themeBoot.js) runs first and applies saved theme quickly
3. [AtlasStay/main.js](AtlasStay/main.js) runs after DOM is ready
4. Hotels data is loaded from [AtlasStay/data/hotels.json](AtlasStay/data/hotels.json)
5. Existing bookings are loaded from localStorage
6. Components initialize (navbar, toast, modal, theme toggle)
7. Page modules initialize (home, hotels, compare, booking, map, history, analytics)
8. Scroll reveal and section highlight observers start

## 4. Shared State (The Central Data Object)

The app shares one object in [AtlasStay/main.js](AtlasStay/main.js):

1. hotels: all hotels loaded from JSON
2. selectedHotel: hotel currently selected by user
3. compareList: array of selected hotel IDs for comparison
4. bookings: saved booking records

Why this matters:
All page modules receive this object, so they work on the same data.

## 5. How Modules Communicate (Custom Events)

Instead of direct coupling, modules send events.

Key events and meaning:
1. hotel:selected
- Sent when user picks a hotel from cards/map
- Booking and map modules react to it

2. hotel:selected:byId
- Sent from modal Book Now button
- Hotels module converts ID to full hotel object

3. navigate:booking
- Sent when app wants to jump to booking section

4. compare:updated
- Sent when compare list changes

5. booking:saved
- Sent when booking is confirmed
- History and analytics refresh

6. themeChanged
- Sent when theme toggles
- Analytics/map update visuals

7. category:filter
- Sent from hero tabs/search filters
- Hotels grid rerenders with filtered list

8. hotels:filterCity
- Sent for city-based quick filtering

## 6. Root Folder (Detailed)

### 6.1 [AtlasStay/index.html](AtlasStay/index.html)

Purpose:
This is the full UI skeleton.

What it contains:
1. Main navbar and secondary category tabs
2. Hero area with slideshow controls and search bar
3. Hotels section with filter controls
4. Compare section table container
5. Booking section form and summary
6. Map section container and sidebar list
7. History and analytics sections
8. Modal and toast containers used by JS

Important beginner note:
JavaScript selects elements by ID/class from this file. If you rename an ID here, update JavaScript selectors too.

### 6.2 [AtlasStay/main.js](AtlasStay/main.js)

Purpose:
Entry point and orchestrator.

Main jobs:
1. Imports all modules
2. Creates and fills AppState
3. Starts every module in correct order
4. Handles load errors with toast

Functions to know:
1. loadBookings
- Reads localStorage key atlasstay_bookings
- Safely parses JSON

2. setupScrollReveal
- Adds visible class when reveal elements enter viewport

3. setupNavHighlight
- Observes sections and highlights active nav link

4. bootstrap
- The main startup function

## 7. Components Folder (Detailed)

### 7.1 [AtlasStay/components/themeBoot.js](AtlasStay/components/themeBoot.js)

Purpose:
Prevents theme flicker on page load.

How:
1. Read atlasstay_theme from localStorage
2. Add/remove dark class on html root immediately

### 7.2 [AtlasStay/components/themeToggle.js](AtlasStay/components/themeToggle.js)

Purpose:
Handles theme button click.

What happens on click:
1. Toggle html.dark class
2. Save chosen theme in localStorage
3. Update icon (sun/moon)
4. Emit themeChanged event

### 7.3 [AtlasStay/components/navbar.js](AtlasStay/components/navbar.js)

Purpose:
Handles nav interactions and smooth scroll.

Key behavior:
1. Opens/closes mobile menu using hamburger
2. Smooth-scrolls to target section using offset
3. Keeps active nav link highlighted

### 7.4 [AtlasStay/components/toast.js](AtlasStay/components/toast.js)

Purpose:
Shows notifications like success, error, warning, info.

How it works:
1. Creates toast element dynamically
2. Auto closes after duration
3. Can be closed manually
4. Exposes global helper via window.showToast

### 7.5 [AtlasStay/components/modal.js](AtlasStay/components/modal.js)

Purpose:
Shows hotel details popup.

Important details:
1. escapeHTML helper protects injected text content
2. Clicking outside modal closes it
3. Book Now sends hotel:selected:byId and navigate:booking
4. Exposes global helper via window.showModal

### 7.6 [AtlasStay/components/hotelCard.js](AtlasStay/components/hotelCard.js)

Purpose:
Creates one hotel card UI block.

Card actions handled:
1. Details button callback
2. Select button callback
3. Compare checkbox callback
4. Wishlist button callback

Why useful:
Hotels page can render many cards without duplicating markup logic.

### 7.7 [AtlasStay/components/bookingForm.js](AtlasStay/components/bookingForm.js)

Purpose:
Booking math utilities.

Functions:
1. calculateNights
2. calculateBookingTotal (base + 12 percent GST)
3. formatINR
4. clampGuests

## 8. Pages Folder (Detailed)

### 8.1 [AtlasStay/pages/home.js](AtlasStay/pages/home.js)

Purpose:
Controls hero area and secondary navigation filters.

Main sections in code:
1. Slideshow data list (image URL, label, tint)
2. initHeroSlideshow
- Creates slides and dots
- Handles autoplay, arrows, keyboard, swipe
- Updates progress bar and location text

3. scrollToHotels
- Smooth-scrolls to hotels section with nav offsets

4. initSecondaryNav
- Handles category tab clicks
- Filters hotels list by category
- Dispatches category:filter
- Handles city chip quick filtering

5. initHome
- Handles hero date constraints
- Handles hero search input/button
- Dispatches category:filter for search results

### 8.2 [AtlasStay/pages/hotels.js](AtlasStay/pages/hotels.js)

Purpose:
Main hotel listing engine.

What it manages:
1. Internal filters object (query, maxPrice, star, sortBy, category, quickFilter)
2. Rendering hotel cards
3. Rendering deals cards
4. Compare logic with max 3 safeguard
5. Wishlist toggle in memory
6. Active filter chips
7. Empty states for no results and no category matches

Key event listeners:
1. hotels:filterCity
2. hotel:selected:byId
3. category:filter

### 8.3 [AtlasStay/pages/booking.js](AtlasStay/pages/booking.js)

Purpose:
Booking form and total calculation flow.

Steps performed:
1. Fill hotel dropdown
2. Apply date min constraints
3. Maintain guest count with + and -
4. Calculate and show price summary live
5. Validate selected hotel and dates
6. Save booking object to localStorage
7. Emit booking:saved event

Also listens to:
1. hotel:selected (auto-select in form)
2. navigate:booking (scroll user to booking section)

### 8.4 [AtlasStay/pages/compare.js](AtlasStay/pages/compare.js)

Purpose:
Compare selected hotels side by side.

What it shows:
1. City
2. Stars
3. Price
4. Rating
5. Amenities

Special highlights:
1. Lowest price cell gets best-value class
2. Highest rating cell gets best-rated class

### 8.5 [AtlasStay/pages/map.js](AtlasStay/pages/map.js)

Purpose:
Interactive map and map list.

Main behavior:
1. Initializes Leaflet map
2. Chooses tile layer based on dark/light mode
3. Places custom price markers for each hotel
4. Shows popup with Book Now button
5. Renders sidebar list and fly-to behavior
6. Reacts to selected hotel and theme changes

### 8.6 [AtlasStay/pages/history.js](AtlasStay/pages/history.js)

Purpose:
Booking history and summary stats.

What it does:
1. Sort bookings newest first
2. Compute total bookings, total spent, average booking
3. Render history cards
4. Cancel confirmed booking
5. Save cancellation state to localStorage

### 8.7 [AtlasStay/pages/analytics.js](AtlasStay/pages/analytics.js)

Purpose:
Renders charts with Chart.js.

Charts rendered:
1. City popularity bar chart
2. Star distribution doughnut chart
3. Price trend line chart

Important details:
1. Existing chart instances are destroyed before rerender
2. Chart colors read from CSS variables
3. Rerenders on themeChanged and booking:saved

## 9. Styles Folder (Detailed)

### 9.1 [AtlasStay/styles/global.css](AtlasStay/styles/global.css)

Purpose:
Global foundation styles.

Contains:
1. Reset/base rules
2. Theme variables
3. Shared utility classes

### 9.2 [AtlasStay/styles/navbar.css](AtlasStay/styles/navbar.css)

Purpose:
Navbar and secondary tabs styling.

Contains:
1. Desktop and mobile nav behavior styles
2. Active link/tab states
3. Sticky/fixed layout behavior

### 9.3 [AtlasStay/styles/sections.css](AtlasStay/styles/sections.css)

Purpose:
Main section layouts including hero.

Contains:
1. Hero slideshow layering
2. Hero search bar and chips styles
3. Hotels/booking/map/history/analytics section layouts
4. Responsive breakpoints

### 9.4 [AtlasStay/styles/cards.css](AtlasStay/styles/cards.css)

Purpose:
Card-specific visual styles.

Contains:
1. Hotel cards
2. Deal cards
3. Buttons, badges, and card interactions

## 10. Data Folder (Detailed)

### 10.1 [AtlasStay/data/hotels.json](AtlasStay/data/hotels.json)

This is the main dataset.

Fields used in app:
1. id
2. name
3. city
4. state
5. price
6. rating
7. stars
8. reviews
9. image
10. description
11. amenities
12. lat
13. lng
14. featured

Where it is used:
1. Hotels grid
2. Compare table
3. Booking form
4. Map markers
5. Analytics charts

### 10.2 [AtlasStay/data/cities.json](AtlasStay/data/cities.json)

Purpose:
List of cities for search-related UX.

### 10.3 [AtlasStay/data/amenities.json](AtlasStay/data/amenities.json)

Purpose:
Amenity reference data for UI and future enhancements.

## 11. LocalStorage Keys

1. atlasstay_theme
- Saves light/dark preference

2. atlasstay_bookings
- Saves booking history objects

## 12. Beginner Debugging Tips

If something breaks, check in this order:
1. Browser console errors first
2. Verify IDs/classes still match between HTML and JS
3. Verify events are emitted and listened with exact same names
4. Verify hotels JSON structure is valid
5. Verify localStorage values are valid JSON

Common issue examples:
1. Button click does nothing
- Usually selector mismatch or missing event listener

2. Map not visible
- Leaflet not loaded or container size issue

3. Charts not visible
- Chart.js not loaded or canvas IDs changed

4. Booking not saved
- Validation failed or localStorage blocked/invalid

## 13. Safe Change Rules (Very Important)

1. If you rename any HTML ID, update JS selectors in related modules.
2. If you rename any custom event, update both emitter and listener modules.
3. If you change AppState shape, update every module using that property.
4. If you change hotels data fields, update cards/booking/map/compare/analytics together.
5. Keep CSS selectors specific to avoid style collisions.

## 14. Quick Learning Path for New Developers

If you are starting fresh, study files in this order:
1. [AtlasStay/index.html](AtlasStay/index.html)
2. [AtlasStay/main.js](AtlasStay/main.js)
3. [AtlasStay/pages/hotels.js](AtlasStay/pages/hotels.js)
4. [AtlasStay/pages/booking.js](AtlasStay/pages/booking.js)
5. [AtlasStay/pages/home.js](AtlasStay/pages/home.js)
6. [AtlasStay/components/hotelCard.js](AtlasStay/components/hotelCard.js)
7. [AtlasStay/pages/map.js](AtlasStay/pages/map.js)
8. [AtlasStay/pages/history.js](AtlasStay/pages/history.js)
9. [AtlasStay/pages/analytics.js](AtlasStay/pages/analytics.js)

This order helps you understand core flow before advanced UI features.
