<script setup lang="ts">
//reactive variables
const audioPlayer = ref<HTMLAudioElement | null>(null)
const volumeContainer = ref<HTMLDivElement | null>(null)
const audioState = ref<'pause' | 'play' | 'stop'>('pause')

const knobRotation = computed(() => {
  return `rotate(${(playlistStore.currentVolume / 100) * 270}deg)`
})

//composables
const { track, duration, next, previous, playlistStore, initAudioPlayer, volume } = useAudioControls(audioPlayer, audioState)

//hooks
onMounted(async () => {
  await nextTick()

  initAudioPlayer()
})


//watchers
watch(
  () => playlistStore.currentTime,
  (newTime) => {
    if (audioPlayer.value && Math.abs(audioPlayer.value.currentTime - newTime) > 0.1) {
      audioPlayer.value.currentTime = newTime
    }
  }
)

//keyboard shortcuts
onKeyStroke('Escape', () => {
  navigateTo('/')
})

onKeyStroke('ArrowLeft', () => {
  previous()
})

onKeyStroke('ArrowRight', () => {
  next()
})
</script>

<template>
  <div>
    <div v-if="track && audioPlayer" class="track-container">
      <span class="mobile-background-blur" />
      <img :src="track.image" width="1200" height="800" class="mobile-background-image">

      <UTooltip text="Back to playlist" :shortcuts="['Esc']" class="back-button-container">
        <UButton icon="i-fa6-solid-arrow-left" variant="link" size="xl" to="/" />
      </UTooltip>

      <div class="track-infos-container">
        <img :src="track.image" width="600" height="600">
        <TrackInfos :name="track.name" :shareurl="track.shareurl" :artist-name="track.artist_name"
          :album-name="track.album_name" :album-image="track.album_image" desktop />
      </div>

      <div class="controls-container">
        <div class="track-infos-mobile-range-bar-container">
          <!-- infos -->
          <div class="track-infos-mobile-container">
            <TrackInfos :name="track.name" :shareurl="track.shareurl" :artist-name="track.artist_name"
              :album-name="track.album_name" :album-image="track.album_image" />

            <UTooltip text="Download track">
              <UButton v-if="track.audiodownload_allowed" variant="link" icon="i-fa6-solid-download" color="gray"
                :to="track.audiodownload" class="color-transition" />
            </UTooltip>
          </div>

          <!-- time range -->
          <AudioProgressBar v-if="duration" :total-duration="duration" :audio-player="audioPlayer" />
        </div>

        <!-- audio controls -->
        <div class="controls">
          <UTooltip text="Download track" class="download-button-container">
            <UButton v-if="track.audiodownload_allowed" variant="link" icon="i-fa6-solid-download" color="gray"
              :to="track.audiodownload" class="color-transition" />
          </UTooltip>

          <!-- track button -->
          <AudioControls :audio-player="audioPlayer" :state="audioState" />

          <div class="w-60 gap-x-2 items-center justify-end hidden md:flex">
            <div ref="volumeContainer" class="volume-container">
              <div class="volume-knob" :style="{ transform: knobRotation }" />
            </div>
            <URange v-model="volume" class="w-32 lg:w-40" size="xs"
              :ui="{ thumb: { background: ' [&::-webkit-slider-thumb]:dark:bg-primary-400' } }" />
          </div>
        </div>
      </div>
    </div>
    <audio ref="audioPlayer" controls class="hidden" />
  </div>
</template>


<style scoped lang="postcss">
/* transition color */
.color-transition {
  transition: color 0.2s ease, background-color 0.2s ease;
}

/* main container */
.track-container {
  position: relative;
  overflow-x: hidden;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* background for mobile */
.mobile-background-blur,
.mobile-background-image {
  position: absolute;
  width: 100vw;
  height: 100vh;
}

.mobile-background-blur {
  z-index: -1;
  background-color: rgba(17, 24, 39, 0.9);
  backdrop-filter: blur(16px);
}

.mobile-background-image {
  z-index: -2;
  inset: 0;
  object-fit: cover;
}

/* back button */
.back-button-container {
  position: absolute;
  left: 1rem;
  top: 1rem;
  transition: color 0.2s ease;
}

/* track infos */
.track-infos-container {
  display: none;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 1rem;
  margin-top: 7rem;
}

/* track infos + controls container */
.controls-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  justify-content: flex-end;
}

.track-infos-mobile-range-bar-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  justify-content: flex-end;
}

.track-infos-mobile-container {
  gap: 1rem;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-bottom: 2rem;
  justify-content: space-between;
}

/* controls container */
.controls {
  height: 10rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding-left: 1rem;
  padding-right: 1rem;
}

.download-button-container {
  width: 15rem;
  display: none;
}

/* volume Container */
.volume-container {
  width: 24px;
  height: 24px;
  border: 1.5px solid #333;
  border-radius: 50%;
  background: radial-gradient(circle, #ccc 30%, #999 70%);
  position: relative;
  box-shadow: 0 1.5px 3px rgba(0, 0, 0, 0.2);
  display: flex;
  justify-content: center;
  transition: box-shadow 0.3s ease-in-out;
}

/* Volume knob */
.volume-knob {
  width: 21px;
  height: 21px;
  background-color: #444;
  border-radius: 50%;
  margin-top: 0.5px;
  transform: translate(-50%, -50%) rotate(0deg);
  transition: transform 0.2s ease-out, box-shadow 0.3s ease-in-out;
  box-shadow: inset 1.5px 1.5px 3px rgba(0, 0, 0, 0.4), inset -1.5px -1.5px 3px rgba(255, 255, 255, 0.1);
}

.volume-knob:before {
  content: '';
  width: 1.5px;
  height: 4.5px;
  background-color: #fff;
  position: absolute;
  top: 1.5px;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 1px;
  box-shadow: 0 0.75px 1.5px rgba(0, 0, 0, 0.2);
}

/* Media Queries */
@media (min-width: 640px) {
  .track-infos-mobile-container {
    display: flex;
    flex-direction: row;
  }
}

@media (min-width: 768px) {
  .track-container {
    background: linear-gradient(to bottom, #1a202c, #2d3748);
  }

  .mobile-background-blur,
  .mobile-background-image {
    display: none;
  }

  .track-infos-container {
    display: flex;
  }

  .track-infos-mobile-container {
    display: none;
  }

  .controls .download-button-container {
    display: block;
  }
}
</style>