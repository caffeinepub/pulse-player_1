# Specification

## Summary
**Goal:** Make Pulse Player fully usable offline by adding an Offline-only mode, ensuring local-only data behavior, enabling offline app-shell loading via caching, and refreshing UI copy/theme to match an offline-first product.

**Planned changes:**
- Add a persisted “Offline-only” setting and gate all Internet Identity UI/flows and all backend/canister actor calls behind it.
- Ensure favorites, history, playlists, profile setup, and settings export operate strictly from local IndexedDB while Offline-only mode is enabled, with no cloud-sync warnings/toasts.
- Add offline asset caching (PWA/service worker) so the app shell loads and remains usable when the browser is fully offline after first load, with safe cache update behavior.
- Revise connectivity-related user-facing copy (English) to be consistent with Offline-only mode and clarify behavior when the browser is offline.
- Apply a single coherent visual theme refresh (colors, typography, spacing, component styling) consistently across Music, Video, Library, and Settings without adding new features.

**User-visible outcome:** Users can enable Offline-only mode to run Pulse Player entirely locally (no login, no network calls), use core library features from IndexedDB, reopen the app while offline after first visit, and see updated offline-first messaging and a consistent refreshed theme across main pages.
