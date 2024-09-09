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

const play = () => {
  if (audioPlayer.value && track.value) {
    audioState.value = 'play'
    audioPlayer.value.src = track.value.audio
    audioPlayer.value.currentTime = playlistStore.currentTime
    audioPlayer.value!.currentTime = playlistStore.currentVolume
    audioPlayer.value?.play()
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
  const currentIndex = playlist.findIndex((t: Track) => t.id === id)
  let previousIndex = currentIndex - 1

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
  <div v-if="track" class="relative h-screen flex flex-col justify-center items-center">
    <div
      class="flex flex-col h-full w-full items-center justify-center max-w-[60%] bg-gray-500 my-4 px-2 rounded-lg audio-container">
      <Cassette :track="track" :track-state="audioState" />
      <div class="max-h-[50%] audiophone w-full h-full flex flex-col -mt-8 mb-8 rounded-lg bg-gray-800">
        <div class="h-3/5 w-full rounded-t-lg p-4 grid grid-cols-12">
          <div class="col-span-5 h-full flex flex-col items-center justify-center gap-y-4">
            <div ref="volumeContainer" class="volume-container">
              <div class="volume-knob" :style="{ transform: knobRotation }" />
            </div>

            <div class="flex gap-x-2 w-full">
              <UIcon
                :name="volume > 50 ? 'i-fa6-solid-volume-high' : volume > 0 ? 'i-fa6-solid-volume-low' : 'i-fa6-solid-volume-xmark'" />
              <URange v-model="volume" :min="0" :max="100" />
            </div>

          </div>
          <div class="col-span-7 ml-8 h-[280px] rounded-lg flex items-center justify-center">
            <img :src="track.image" class="h-full w-full object-cover rounded-md" width="500" height="360">
          </div>
        </div>
        <div class="h-full rounded-lg bg-gray-100 flex justify-between p-4 items-center border m-2 buttons">
          <div class="flex flex-col items-center play play-button">
            <UButton size="xl" class="w-32 h-16 flex items-center justify-center" color="gray">
              <UIcon name="i-fa6-solid-play" class="w-12 h-12 icon-play" />
            </UButton>
            <span class="text-3xl font-medium pt-2">PLAY</span>
          </div>
          <div class="flex flex-col items-center stop-button">
            <UButton size="xl" class="w-32 h-16 flex items-center justify-center" color="gray">
              <UIcon name="i-fa6-solid-stop" class="w-12 h-12" />
            </UButton>
            <span class="text-3xl font-medium pt-2">STOP</span>
          </div>
          <UDivider orientation="vertical" class="w-2 h-full rounded-full bg-gray-900" />
          <div class="flex flex-col items-center prev-button">
            <UButton size="xl" class="w-32 h-16 flex items-center justify-center" color="gray">
              <UIcon name="i-fa6-solid-backward-step" class="w-12 h-12" />
            </UButton>
            <span class="text-3xl font-medium pt-2">PREVIOUS</span>
          </div>
          <div class="flex flex-col items-center next-button">
            <UButton size="xl" class="w-32 h-16 flex items-center justify-center" color="gray">
              <UIcon name="i-fa6-solid-forward-step" class="w-12 h-12" />
            </UButton>
            <span class="text-3xl font-medium pt-2">NEXT</span>
          </div>
        </div>
      </div>
    </div>


    <div class="absolute inset-0 h-screen w-screen bg-gray-900/80 z-[-1]" />
    <img :src="track.image" class="absolute inset-0 w-screen h-screen blur-2xl z-[-10]">
    <!-- <div class="flex items-center justify-center h-full">
      <img :src="track.album_image" width="600" height="600">
    </div>  -->
    <!-- <div class="h-60 flex justify-center items-center py-12">
      <div class="rounded-full w-[800px] bg-gray-200/80 h-full flex">
        <UButton size=" xl" variant="outline" color="white" name="i-heroicons-chevron-double-right-16-solid"
          :ui="{ variant: { outline: 'ring-0 hover:!bg-transparent' } }" @click="previous()">
          <UIcon name="i-heroicons-chevron-double-left-16-solid"
            class="h-12 w-12 hover:bg-gray-100 transition-colors duration-200" />
        </UButton>
        <UButton size=" xl" variant="outline" color="white"
          :ui="{ variant: { outline: 'ring-0 hover:!bg-transparent' } }"
          @click="(audioState === 'pause' || audioState === 'stop') ? play() : pause()">
          <UIcon
            :name="(audioState === 'pause' || audioState === 'stop') ? 'i-heroicons-play-solid' : 'i-heroicons-pause-solid'"
            class="h-12 w-12 hover:bg-gray-100 transition-colors duration-200" />
        </UButton>
        <UButton size="xl" variant="outline" color="white"
          :ui="{ variant: { outline: 'ring-0 hover:!bg-transparent' } }" @click="stop()">
          <UIcon name="i-heroicons-stop-circle-16-solid"
            class="h-12 w-12 hover:bg-gray-100 transition-colors duration-200" />
        </UButton>
        <UButton size=" xl" variant="outline" color="white" name="i-heroicons-chevron-double-right-16-solid"
          :ui="{ variant: { outline: 'ring-0 hover:!bg-transparent' } }" @click="next()">
          <UIcon name="i-heroicons-chevron-double-right-16-solid"
            class="h-12 w-12 hover:bg-gray-100 transition-colors duration-200" />
        </UButton>
      </div>
    </div> -->

    <audio ref="audioPlayer" controls class="hidden" />
  </div>
</template>

<style scoped lang="postcss">
.audio-container {
  background-image: url('/wood.png');
}

.volume-container {
  width: 200px;
  height: 200px;
  border: 5px solid #333;
  border-radius: 50%;
  background: radial-gradient(circle, #ccc 30%, #999 70%);
  position: relative;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
}

.volume-knob {
  width: 180px;
  height: 180px;
  background-color: #444;
  border-radius: 50%;
  margin-top: 5px;
  transform: translate(-50%, -50%) rotate(0deg);
  transition: transform 0.2s ease-out;
  box-shadow: inset 5px 5px 10px rgba(0, 0, 0, 0.4), inset -5px -5px 10px rgba(255, 255, 255, 0.1);
}

.volume-knob:before {
  content: '';
  width: 4px;
  height: 30px;
  background-color: #fff;
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 2px;
  box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
}

.buttons {
  background-image: url('/noise.jpg')
}

.buttons::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: radial-gradient(circle, rgba(255, 255, 255, 0.1), rgba(0, 0, 0, 0.1) 5%);
  opacity: 0.5;
  pointer-events: none;
}

.audiophone {}

.play-button,
.stop-button,
.next-button,
.prev-button {
  font-family: "Nerko One";
}

.play>button {
  box-shadow:
    7px 7px 16px 0 rgba(0, 0, 0, 0.25),
    -7px -7px 16px 0 rgba(255, 255, 255, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
}

.play>.icon-play {
  box-shadow: inset -5px -5px 9px rgba(255, 255, 255, 0.45), inset 5px 5px 9px rgba(94, 104, 121, 0.3);
}

.button:active {
  transform: translateY(4px);
  /* Simulate button press */
  box-shadow:
    0 2px 0 #000,
    /* Shorter shadow to simulate press */
    0 5px 8px rgba(0, 0, 0, 0.5);
  /* Smaller shadow for press */
}

.button:hover {
  background-color: #222;
}
</style>