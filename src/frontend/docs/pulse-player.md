# Pulse Player Documentation

## Overview
Pulse Player is a modern, clean, and minimal music and video player web application built for the Internet Computer. It provides a smooth, distraction-free experience for managing and playing local media files with cloud sync capabilities.

## UI Wireframe Description

### Main Navigation (Bottom Bar)
- **Music Tab**: Home for music playback, recommendations, playlists, recently played, and favorites
- **Video Tab**: Video library and player interface
- **Library Tab**: Combined audio/video library with search, sort, and file management
- **Settings Tab**: Theme, equalizer, playback settings, authentication, and sleep timer

### Key Screens & Interactions

#### Music Tab
- **Hero Section**: App branding with logo and background
- **Recommendations**: Personalized track suggestions based on listening history
- **Playlists Grid**: Visual grid of user playlists with track counts
- **Recently Played / Favorites Tabs**: Quick access to listening history and liked tracks
- **Mini Player Bar**: Persistent playback controls at bottom (above navigation)

#### Video Tab
- **Video List**: Grid/list of local video files with thumbnails
- **Video Player**: Full-screen capable player with:
  - Playback controls (play/pause, seek)
  - Speed control (0.5x - 2x)
  - Fullscreen toggle
  - Subtitle support
  - Picture-in-Picture (where supported)

#### Library Tab
- **Search Bar**: Real-time filtering by title, artist, album
- **Sort Controls**: Name, date added, file size
- **Audio/Video Tabs**: Separate views for audio and video files
- **Add Media Button**: File picker for adding local media
- **Empty States**: Helpful guidance when library is empty

#### Settings Tab
- **Account Section**: Internet Identity sign in/out
- **Theme Selector**: Light, dark, and system theme options
- **Equalizer**: Preset selection (Off, Bass Boost, Pop, Rock, Classical, Jazz)
- **Playback Settings**: Video gesture controls toggle
- **Sleep Timer**: Duration selector with countdown display

#### Player Interactions
- **Mini Player**: Tap to expand to full player sheet
- **Full Player Sheet**: 
  - Large album art placeholder
  - Track title and artist
  - Seek bar with time display
  - Play/pause, next, previous controls
  - Shuffle and repeat toggles
  - Volume slider

#### Playlist Management
- **Create Playlist**: Dialog with name input
- **Playlist Detail**: Track list with play all and delete options
- **Add to Playlist**: Dropdown menu from track actions

## Folder Structure

