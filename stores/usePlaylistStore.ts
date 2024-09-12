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
