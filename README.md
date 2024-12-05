# Nuxt simple media player

## Table of Contents
- [Introduction](#introduction)
- [Installation](#setup)
- [Prerequisites](#prerequisites)
- [Features](#features)
- [Stack](#stack)
- [Usage](#usage)
- [API Information](#api-information)

## Introduction
This project is a simple yet functional music player Spotify-like. It was created as part of the ability to build a front-end application using modern web technologies. The player includes essential features such as play/pause/stop functionality, a timeline slider for seeking, and track information display including title, artist, and thumbnail.

## Prerequisites
### Environment Variables
You need to create a `.env` file at the root of the project with the following variables:
```bash
NUXT_PUBLIC_JAMENDO_API_URL="https://api.jamendo.com/v3.0/tracks"
NUXT_PUBLIC_JAMENDO_API_CLIENT_KEY="33aa6c40"
```
### Clone the repository:
```
git clone https://github.com/username/tutteo-frontend-technical-test.git
cd tutteo-frontend-technical-test
```

## Installation

### Setup
Make sure to install the dependencies:
```bash
# pnpm
pnpm install
```
### Development Server
Start the development server on `http://localhost:3000`:

```bash
# pnpm
pnpm run dev
```
### Production
Build the application for production:
```bash
# pnpm
pnpm run build
```
Locally preview production build:
```bash
pnpm run preview
```
Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Features
- Play, Pause, and Stop Controls: Basic audio control functionalities.
- Timeline Slider: Allows users to seek different parts of the track.
- Track Information Display: Shows current track title, artist, and thumbnail.
- Responsive Design: Works on both desktop and mobile devices.
- Efficient Audio Playback: Handles audio efficiently across modern browsers.
- Keyboard Navigation: Supports keyboard shortcuts for controlling the player.
- Design Consistency: A clean and intuitive user interface.

## Stack
- [Vue 3](https://vuejs.org/guide/introduction) with Composition API for core development.
- [Nuxt 3](https://nuxt.com/docs/getting-started/introduction) for framework setup and structure.
- [TypeScript](https://www.typescriptlang.org/docs/) for type-safe development.
- [Pinia](https://pinia.vuejs.org/core-concepts/) for state management.
- [CSS Modules](https://vuejs.org/api/sfc-css-features.html#css-modules) for scoped styling.
- [Nuxt UI](https://ui.nuxt.com/) for UI components and layout.
- [VueUse](https://vueuse.org/) for utility functions and reactive hooks (e.g: Keyboard Navigation...)
- [Jamendo API](https://developer.jamendo.com/v3.0/docs) for fetching royalty-free music.
- [ESLint](https://eslint.org/) for code formatting and linting.
- [Git](https://git-scm.com/) for version control.

## Usage
- Use the play/pause button to control audio playback.
- Adjust the timeline slider to seek through the track.
- The player will display the track title, artist, and thumbnail.
- The player can be fullscreen for more comfort when browsing while keeping the status of the music
- Keyboard shortcuts can be used for playback control (e.g., arrow left for previous track).
- The UI is responsive and adapts to both mobile and desktop environments.

## API Information
This project uses the **Jamendo API**, which provides access to a vast library of royalty-free music. The API was integrated following the [API Terms of Use](https://devportal.jamendo.com/api_terms_of_use), ensuring compliance with licensing and usage guidelines.

## Preview
👀 Demo is available at https://nuxt-simple-media-player.netlify.app/
