import { ref, computed } from 'vue'
import { usePlaylistStore } from '@/stores/usePlaylistStore'

export const useAudioControls = (audioPlayer: Ref<HTMLAudioElement | null>, audioState: Ref<'pause' | 'play' | 'stop'>) => {
  const playlistStore = usePlaylistStore()
  const track = computed(() => playlistStore.getCurrentTrack)
  const duration = ref<string>()

  //computed
  const volume = computed({
    get: () => playlistStore.currentVolume,
    set: (newValue: number) => {
      playlistStore.updateCurrentVolume(newValue)
      if (audioPlayer.value) {
        audioPlayer.value.volume = newValue / 100
      }
    }
  })


  const initAudioPlayer = () => {
    playlistStore.loadFromLocalStorage()

    if (audioPlayer.value && track.value && volume.value) {
      audioPlayer.value.src = track.value.audio
      audioPlayer.value.volume = volume.value / 100
      audioPlayer.value.currentTime = playlistStore.currentTime

      audioPlayer.value.addEventListener('timeupdate', () => {
        playlistStore.updateCurrentTime(audioPlayer.value!.currentTime)
      })

      audioPlayer.value.addEventListener('loadedmetadata', () => {
        if (audioPlayer.value?.duration) {
          duration.value = formatDuration(audioPlayer.value.duration)
        }
      })
    }
  }

  const play = async () => {
    if (audioPlayer.value && track.value) {
      audioState.value = 'play'
      audioPlayer.value.src = track.value.audio
      audioPlayer.value.currentTime = playlistStore.currentTime

      volume.value = playlistStore.currentVolume

      await audioPlayer.value.play().catch(error => console.error('Error playing audio:', error))

      playlistStore.playTrack(track.value)
    }
  }

  const pause = () => {
    audioState.value = 'pause'
    audioPlayer.value?.pause()

    playlistStore.pauseTrack()
  }

  const stop = () => {
    if (audioPlayer.value && track.value) {
      audioState.value = 'stop'
      audioPlayer.value?.pause()
      audioPlayer.value.currentTime = 0

      playlistStore.stopTrack()
    }
  }

  const next = () => {
    const currentIndex = playlistStore.getPlaylist.findIndex((t) => t.id === track.value!.id)
    let nextIndex = currentIndex + 1

    if (nextIndex >= playlistStore.getPlaylist.length) {
      nextIndex = 0
    }

    const nextTrack = playlistStore.getPlaylist[nextIndex]

    playlistStore.playTrack(nextTrack)

    if (audioPlayer.value) {
      audioPlayer.value.src = nextTrack.audio
      audioPlayer.value.currentTime = 0
      if (audioState.value === 'play') {
        audioPlayer.value.play()
      }
    }
  }

  const previous = () => {
    const currentIndex = playlistStore.getPlaylist.findIndex((t) => t.id === track.value!.id)
    let previousIndex = currentIndex - 1

    if (previousIndex < 0) {
      previousIndex = playlistStore.getPlaylist.length - 1
    }

    const previousTrack = playlistStore.getPlaylist[previousIndex]
    playlistStore.playTrack(previousTrack)

    if (audioPlayer.value) {
      audioPlayer.value.src = previousTrack.audio
      audioPlayer.value.currentTime = 0
      if (audioState.value === 'play') audioPlayer.value.play()
    }
  }

  return {
    track,
    duration,
    play,
    pause,
    stop,
    next,
    previous,
    playlistStore,
    initAudioPlayer,
    volume,
    audioState
  }
}