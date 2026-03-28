# AtlasStay Problem Statement

## Context

Hotel discovery flows are often fragmented across search pages, map pages, and booking pages. Users lose time switching contexts and struggle to evaluate trade-offs between price, location, and quality.

## Core Problem

Travelers need one coherent interface where they can:
- Search quickly
- Compare options confidently
- Book with transparent pricing
- Revisit bookings later

without relying on multiple tools.

## User Pain Points

1. Decision friction from large hotel lists without guided comparison.
2. Weak visibility into total trip cost before booking.
3. Limited location confidence without map context.
4. Poor post-booking visibility for status and cancellation.
5. Inconsistent experience across desktop and mobile.

## Product Response

AtlasStay addresses those gaps through:

- Hero-first entry with search and quick city chips.
- Category tabs and advanced hotel filters.
- Compare view for side-by-side decision making.
- Booking form with real-time summary.
- Map page with hotel markers and fly-to behavior.
- Booking history persistence and cancellation actions.
- Analytics page for city/rating trends.

## Scope

- Frontend only.
- Static JSON data source.
- Browser localStorage persistence.

## Success Criteria

- Lower time-to-first-valid-booking.
- Higher usage of compare and map features.
- Reliable booking save/read flow in localStorage.
- Stable responsive behavior on common screen sizes.

## Risks

- No real-time inventory/pricing.
- Device-specific data persistence.
- External CDN dependency for Leaflet and Chart.js.
