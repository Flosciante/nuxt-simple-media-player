import { defineStore } from 'pinia'
import type { Track } from '~/types'

const { fetchPlaylist } = usePlaylist()

export const usePlaylistStore = defineStore('playlist', {
  state: () => ({
    playlist: <Track[]>([]) ,
  }),
  actions: {
    async fetchPlaylist() {
      this.playlist = await fetchPlaylist()
    },
  },
  getters: {
    getPlaylist: (state) => state.playlist,
  },
});
