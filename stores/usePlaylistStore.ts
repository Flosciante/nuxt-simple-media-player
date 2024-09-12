/**
 * This store manages the state and actions related to the audio playlist and the current track.
 * - It includes the playlist, current track, current playback time, volume, and audio state (play, pause, stop).
 * - Actions:
 *   - `fetchPlaylist`: Fetches the playlist data from the API.
 *   - `loadFromLocalStorage`: Loads the current track, time, and volume from local storage on page load.
 *   - `playTrack`: Starts playing a selected track and saves its state in local storage.
 *   - `pauseTrack`: Pauses the current track and updates the local storage.
 *   - `stopTrack`: Stops the current track and resets the playback time.
 *   - `updateCurrentVolume`: Updates the playback volume and saves it in local storage.
 *   - `updateCurrentTime`: Updates the current playback time and stores it in local storage.
 * - Getters:
 *   - `getPlaylist`: Returns the current playlist.
 *   - `getCurrentTrack`: Returns the currently selected track.
 */

import { defineStore } from 'pinia'
import type { Track, AudioState } from '~/types'

const { fetchPlaylist } = usePlaylist()

export const usePlaylistStore = defineStore('playlist', {
  state: () => ({
    playlist: <Track[]>([]),
    currentTrack: null as Track | null,
    currentTime: 0,
    currentVolume: 40,
    audioState: 'pause' as AudioState,
  }),
  actions: {
    async fetchPlaylist () {
      this.playlist = await fetchPlaylist()
    },
    loadFromLocalStorage () {
      const savedTrackId = localStorage.getItem('currentTrackId')
      const savedCurrentTime = localStorage.getItem('currentTrackTime')
      const savedCurrentVolume = localStorage.getItem('currentTrackVolume')

      if (savedTrackId) {
        const track = this.getPlaylist.find((t: Track) => t.id === savedTrackId)
        if (track) {
          this.currentTrack = track
        }
      }

      if (savedCurrentTime) {
        this.currentTime = parseFloat(savedCurrentTime)
      }

      if (savedCurrentVolume) {
        this.currentVolume = parseInt(savedCurrentVolume)
      }
    },
    playTrack (track: Track) {
      this.currentTrack = track
      this.audioState = 'play'

      localStorage.setItem('currentTrackId', track.id)
      localStorage.setItem('currentTrackTime', '0')
      localStorage.setItem('audioState', 'play')
    },

    pauseTrack () {
      this.audioState = 'pause'
      localStorage.setItem('audioState', 'pause')
    },

    stopTrack () {
      this.currentTime = 0

      this.audioState = 'stop'
      localStorage.setItem('audioState', 'stop')
      localStorage.setItem('currentTrackTime', '0')
    },

    updateCurrentVolume (vol: number) {
      this.currentVolume = vol

      localStorage.setItem('currentTrackVolume', vol.toString())
    },

    updateCurrentTime (time: number) {
      this.currentTime = time

      localStorage.setItem('currentTrackTime', time.toString())
    },
  },
  getters: {
    getPlaylist: (state) => state.playlist,

    getCurrentTrack (): Track | null {
      return this.currentTrack
    },
  },
})
