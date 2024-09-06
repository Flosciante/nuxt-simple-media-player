<script setup lang="ts">
import { usePlaylistStore } from '@/stores/usePlaylistStore'
import type { Track } from '~/types'

const audioPlayer = ref<HTMLAudioElement | null>(null)

const route = useRoute()
const playlistStore = usePlaylistStore()

const playlist = playlistStore.getPlaylist
const { id } = route.params
const audioState = ref<'play' | 'pause'>('pause')

const track = computed(() => playlist.filter((track: Track) => track.id === id)[0])

onMounted(() => {
  if (audioPlayer.value) {
    audioPlayer.value.src = track.value.audio
  }
})

const play = () => {
  audioPlayer.value?.play()
  audioState.value = 'play'
}

const pause = () => {
  audioPlayer.value?.pause()
  audioState.value = 'pause'
}

</script>

<template>
  <div class="relative h-screen flex flex-col justify-between">
    <div class="absolute inset-0 h-screen w-screen bg-gray-900/80 z-[-1]" />
    <img :src="track.image" class="absolute inset-0 w-screen h-screen blur-2xl z-[-10]">
    <div class="flex items-center justify-center h-full">
      <img :src="track.album_image" width="600" height="600">
    </div>
    <div class="h-60 flex justify-center items-center py-12">
      <div class="rounded-full w-[800px] bg-gray-200/80 h-full flex justify-between">
        <UButton size="xl" variant="outline" color="white"
          :ui="{ variant: { outline: 'ring-0 hover:!bg-transparent' } }"
          @click="audioState === 'pause' ? play() : pause()">
          <UIcon :name="audioState === 'pause' ? 'i-heroicons-play-solid' : 'i-heroicons-pause-solid'"
            class="h-12 w-12 hover:bg-gray-100 transition-colors duration-200" />
        </UButton>
      </div>
    </div>
    <audio ref="audioPlayer" controls class="hidden" />
  </div>
</template>