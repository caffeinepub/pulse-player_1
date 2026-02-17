# Specification

## Summary
**Goal:** Build a minimal, modern, responsive web-based music and video player that plays local media, supports playlists/favorites/history, and optionally syncs lightweight user data via Internet Identity—while keeping media files local-only.

**Planned changes:**
- Create a clean responsive UI shell with bottom navigation (Music, Video, Library, Settings), consistent design system, smooth transitions, and light/dark themes.
- Implement local media ingestion via file picker for audio/video; extract basic metadata, index into a library, and persist metadata/playlists locally for offline use (no uploads).
- Build music playback UX (play/pause, next/previous, seek, shuffle, repeat) with a persistent mini-player and a full player view.
- Add playlist management (create/rename/delete, add/remove tracks, play as queue) with persistence and optional per-user sync when signed in.
- Add favorites/like plus Recently Played and Recently Added sections with persistence and optional per-user sync when signed in.
- Implement library search and sorting (name/artist/album best-effort; sort by name/size/date) for audio and video lists.
- Add an equalizer (Web Audio API) with preset modes and Off; persist EQ settings; apply to music only.
- Build a video player with local playback, fullscreen, playback speed (0.5x–2x), subtitle loading (.vtt), and Picture-in-Picture where supported.
- Add mobile-friendly video gesture controls (volume + brightness-like overlay) with visual feedback and a Settings toggle to disable.
- Add performance-minded loading states (indexing indicators, skeletons/spinners) and list virtualization for large libraries.
- Implement a sleep timer with preset durations, countdown display, and cancel behavior.
- Provide on-device “smart recommendations” using deterministic heuristics from favorites/history/plays and available metadata.
- Add Internet Identity sign-in/out and per-user cloud sync for playlists, favorites, history, and settings; handle local vs cloud merge/prompt.
- Implement Motoko backend APIs/data model for per-user playlists, likes, history, and settings with access control and upgrade-stable storage.
- Add in-repo documentation covering wireframes, folder structure, entry points, suggested libraries, and future improvement ideas.
- Add generated static branding/empty-state images under `frontend/public/assets/generated` and render them in the UI.

**User-visible outcome:** Users can add local audio/video files, browse/search/sort a library offline, play music with a mini-player, manage playlists, like tracks, view recent activity and recommendations, use an equalizer and sleep timer, and watch videos with subtitles/speed/PiP and optional gestures; signing in enables syncing playlists/favorites/history/settings across sessions without uploading media files.
