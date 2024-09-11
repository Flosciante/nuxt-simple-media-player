<script lang="ts" setup>
import type { AudioState } from '~/types'

//reactive variables
const audioPlayer = ref<HTMLAudioElement | null>(null)
const audioState = ref<AudioState>('pause')
const detail = ref(false)

//composables
const { track, duration, next, previous, playlistStore, initAudioPlayer } = useAudioControls(audioPlayer, audioState)

//hooks
onMounted(async () => {
  await nextTick()

  if (audioPlayer.value) {
    initAudioPlayer()
  }
})

//watchers
//keep position if click on progress bar
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

  <div :class="[$style['track-container'], { [$style['track-container-detail']]: detail }]">
    <!-- detail -->
    <div v-if="detail" class="w-full">
      <span :class="$style['mobile-background-blur']" />
      <img v-if="track" :src="track.image" width="1200" height="800" :class="$style['mobile-background-image']">

      <UTooltip text="Back to playlist" :shortcuts="['Esc']" :class="$style['back-button-container']">
        <UButton icon="i-fa6-solid-xmark" variant="link" color="white" size="xl" aria-label="Back to playlist"
          @click="detail = false" />
      </UTooltip>

      <NuxtLink to="/" :class="$style['logo-wraper']">
        <Logo />
      </NuxtLink>
    </div>


    <div :class="$style['track-infos-container']">
      <img v-if="detail && track" :src="track.image" width="600" height="600"
        :class="$style['track-infos-container-img']">

      <TrackDetails v-if="track && detail" :name="track.name" :shareurl="track.shareurl"
        :artist-name="track.artist_name" :album-name="track.album_name" :album-image="track.album_image"
        :detail="detail" desktop />

      <!-- audio controls -->
      <div :class="[$style.controls, { [$style['controls-detail']]: detail, [$style['controls-home']]: !detail }]">
        <TrackDetails v-if="track" :name="track.name" :shareurl="track.shareurl" :artist-name="track.artist_name"
          :album-name="track.album_name" :album-image="track.album_image" :detail="detail" />

        <div :class="[$style['controls-audio-progress'], { [$style['controls-audio-progress-detail']]: detail }]">
          <!-- track buttons -->
          <AudioControls v-if="audioPlayer" :audio-player="audioPlayer" :state="audioState" :detail="detail" />

          <AudioProgressBar v-if="duration && audioPlayer" :total-duration="duration" :audio-player="audioPlayer!"
            :state="audioState" :detail="detail" />
        </div>

        <!-- volume -->
        <div :class="$style['volume-container']">
          <AudioVolume v-if="audioPlayer" :audio-player="audioPlayer" :state="audioState" />
          <UButton icon="i-fa6-solid-expand" variant="link" color="white" :class="{ 'hidden': detail }"
            @click="detail = !detail" />
        </div>
      </div>
      <audio ref="audioPlayer" controls :class="$style['audio-player']" />
    </div>
  </div>
</template>


<style module lang="postcss">
/* transition color */
.color-transition {
  transition: color 0.2s ease, background-color 0.2s ease;
}

/* main container */
.track-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
}

.track-container-detail {
  height: 100vh;
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
  backdrop-filter: blur(8px);
}

.mobile-background-image {
  z-index: -2;
  inset: 0;
  object-fit: cover;
}

/* back button */
.back-button-container {
  position: absolute;
  right: 1rem;
  top: 1rem;
  transition: color 0.2s ease;

  &:hover {
    color: rgb(176, 176, 176);
  }
}

/* logo */
.logo-wraper {
  position: absolute;
  left: 1rem;
  top: 1rem;
}

/* track infos */
.track-infos-container {
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
}

.track-infos-container-img {
  display: none;
}

.track-infos-container-detail {
  margin-top: 7rem;
  gap: 1rem;
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

.download-button-container {
  width: 15rem;
  display: none;
}

.volume-container {
  width: 15rem;
  display: none;
  gap: 0.5rem;
  align-items: center;
  justify-content: flex-end;
}

.audio-player {
  display: none;
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
    background: linear-gradient(to bottom, #2d3748, #1a202c);
  }

  .track-infos-mobile-container {
    display: none;
  }

  .controls .download-button-container {
    display: block;
  }

  .volume-container {
    display: flex;
  }

  .controls-container {
    height: auto;
  }
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
  align-items: center;
  width: 100%;
  padding-left: 1rem;
  padding-right: 1rem;
  margin-bottom: 0.5rem;
  margin-top: 0.5rem;
  position: relative;
}

.controls-detail {
  width: 100%;
  height: 100%;
  align-items: end;
  padding-bottom: 2rem;
  flex-direction: column;
  place-content: end;
}

.controls-home {
  height: 5rem;
}

.controls-audio-progress {
  width: 100%;
  padding-left: 0.75rem;
  padding-right: 0.75rem;
}

.controls-audio-progress-detail {
  display: flex;
  flex-direction: column-reverse;
}

.download-button-container {
  width: 15rem;
  display: none;
}

.volume-container {
  width: 15rem;
  display: none;
  gap: 0.5rem;
  align-items: center;
  justify-content: flex-end;
}

.audio-player {
  display: none;
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
    background: linear-gradient(to bottom, #2d3748, #1a202c);
  }

  .track-infos-mobile-container {
    display: none;
  }

  .track-infos-container {
    display: flex;
  }

  .track-infos-container-img {
    display: block;
  }

  .controls .download-button-container {
    display: block;
  }

  .controls {
    justify-content: space-between;
  }

  .volume-container {
    display: flex;
    max-width: 300px;
    width: 100%;
  }

  .controls-container {
    height: auto;
  }

  .controls-detail {
    padding-top: 7rem;
    height: 12rem;
    place-self: end;
    margin-bottom: -6rem;
    flex-direction: row;
    align-items: center;
  }
}
</style>