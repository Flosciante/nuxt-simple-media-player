<script setup lang="ts">
import { usePlaylistStore } from '@/stores/usePlaylistStore'
import type { Track } from '~/types'

const audioPlayer = ref<HTMLAudioElement | null>(null)
const volumeContainer = ref<HTMLDivElement | null>(null)
const isMouseDown = ref(false)

const route = useRoute()
const playlistStore = usePlaylistStore()

const knobRotation = computed(() => {
  return `rotate(${(playlistStore.currentVolume / 100) * 270}deg)`
})

const audioState = ref<'pause' | 'play' | 'stop'>('pause')
const track = computed(() => playlistStore.getCurrentTrack)

const playlist = playlistStore.getPlaylist
const { id } = route.params

const volume = computed({
  get: () => playlistStore.currentVolume,
  set: (newValue: number) => {
    playlistStore.updateCurrentVolume(newValue)
    if (audioPlayer.value) {
      audioPlayer.value.volume = newValue / 100
    }
  }
})


onMounted(async () => {
  playlistStore.loadFromLocalStorage()

  await nextTick()

  if (audioPlayer.value && track.value) {
    audioPlayer.value.src = track.value.audio

    audioPlayer.value.volume = volume.value / 100

    audioPlayer.value.addEventListener('timeupdate', () => {
      playlistStore.updateCurrentTime(audioPlayer.value!.currentTime)
    })
  }
})

const rotateKnob = (event: MouseEvent) => {
  if (!isMouseDown.value || !volumeContainer.value) return

  const rect = volumeContainer.value.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2
  const angle = Math.atan2(event.clientY - centerY, event.clientX - centerX) * (180 / Math.PI) + 90
  const newVolume = Math.min(Math.max((angle / 270) * 100, 0), 100)
  volume.value = newVolume
}

const play = async () => {
  if (audioPlayer.value && track.value) {
    audioState.value = 'play'
    audioPlayer.value.src = track.value.audio
    audioPlayer.value.currentTime = playlistStore.currentTime
    volume.value = playlistStore.currentVolume
    audioPlayer.value.load()
    audioPlayer.value?.play().catch((error) => console.error('Error playing audio:', error))
    playlistStore.playTrack(track.value)
  }
}

const pause = () => {
  audioState.value = 'pause'
  audioPlayer.value?.pause()
  playlistStore.pauseTrack()
}

const stop = () => {
  audioState.value = 'stop'
  audioPlayer.value?.pause()
  audioPlayer.value!.currentTime = 0
  playlistStore.stopTrack()
}

const next = () => {
  const currentIndex = playlist.findIndex((t: Track) => t.id === track.value!.id)
  let nextIndex = currentIndex + 1

  if (nextIndex >= playlist.length) {
    nextIndex = 0
  }

  const nextTrack = playlist[nextIndex]
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
  const currentIndex = playlist.findIndex((t: Track) => t.id === track.value!.id)
  let previousIndex = currentIndex - 1

  console.log('previousIndex', previousIndex)

  if (previousIndex < 0) {
    previousIndex = playlist.length - 1
  }

  const previousTrack = playlist[previousIndex]

  playlistStore.playTrack(previousTrack)

  if (audioPlayer.value) {
    audioPlayer.value.src = previousTrack.audio
    audioPlayer.value.currentTime = 0
    if (audioState.value === 'play') {
      audioPlayer.value.play()
    }
  }
}

</script>

<template>
  <div v-if="track"
    class="bg-gradient-to-b from-gray-900 to-gray-800 h-screen flex flex-col justify-between items-center">
    <div class="flex items-center justify-center h-full">
      <img :src="track.image" width="600" height="600">
    </div>
    <div class="h-60 flex justify-between items-center w-full px-4">
      <div class="flex gap-x-2 items-center w-60">
        <img :src="track.album_image" width="80" height="80">
        <div class="flex flex-col">
          <span class="text-lg font-semibold text-gray-100 truncate">{{ track.name }}</span>
          <span class="text-gray-300 line-clamp-2">{{ track.album_name }}</span>
        </div>
      </div>

      <div class="rounded-full h-full flex flex-1 w-full items-center justify-center buttons gap-x-4">
        <UButton size="lg" variant="outline" color="white" name="i-heroicons-chevron-double-right-16-solid"
          class="button" :ui="{ variant: { outline: 'ring-0 hover:!bg-transparent' } }" @click="previous()">
          <UIcon name="i-fa6-solid-backward-step" class="h-8 w-8 hover:bg-gray-100 transition-colors duration-200" />
        </UButton>
        <UButton size="lg" variant="outline" color="white"
          :ui="{ variant: { outline: 'ring-0 hover:!bg-transparent' } }"
          @click="(audioState === 'pause' || audioState === 'stop') ? play() : pause()">
          <UIcon :name="(audioState === 'pause' || audioState === 'stop') ? 'i-fa6-solid-play' : 'i-fa6-solid-pause'"
            class="h-8 w-8 hover:bg-gray-100 transition-colors duration-200" />
        </UButton>
        <UButton size="lg" variant="outline" color="white"
          :ui="{ variant: { outline: 'ring-0 hover:!bg-transparent' } }" @click="stop()">
          <UIcon name="i-fa6-solid-stop" class="h-8 w-8 hover:bg-gray-100 transition-colors duration-200" />
        </UButton>
        <UButton size="lg" variant="outline" color="white" name="i-heroicons-chevron-double-right-16-solid"
          :ui="{ variant: { outline: 'ring-0 hover:!bg-transparent' } }" @click="next()">
          <UIcon name="i-fa6-solid-forward-step" class="h-8 w-8 hover:bg-gray-100 transition-colors duration-200" />
        </UButton>
      </div>

      <div class="w-60 flex gap-x-2 items-center justify-end">
        <UIcon
          :name="volume > 50 ? 'i-fa6-solid-volume-high' : volume > 0 ? 'i-fa6-solid-volume-low' : 'i-fa6-solid-volume-xmark'" />
        <URange v-model="volume" class="w-40" size="xs"
          :ui="{ thumb: { background: ' [&::-webkit-slider-thumb]:dark:bg-primary-400' } }" />
      </div>
    </div>
    <audio ref="audioPlayer" controls class="hidden" />
  </div>
</template>


<style scoped lang="postcss">
.buttons button:hover {
  width: 60px;
  height: 60px;
  box-shadow: 7px 7px 16px 0 rgba(0, 0, 0, 0.5), -7px -7px 16px 0 rgb(30 41 59);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
}


.buttons button:active {
  box-shadow:
    5px 5px 10px 0 rgba(0, 0, 0, 0.3) inset,
    -5px -5px 12px 0 rgb(30 41 59) inset;
}
</style>