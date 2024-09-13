<script setup lang="ts">
/**
 * This component manages display the player panel (small or full).
 * - It uses the `audioPlayer` and `duration` properties to handle the audio track and playback.
 * - Displays the current track's image, artist, and album details when in detail view.
 * - Allows users to control the audio playback (play, pause, next, previous, and stop).
 * - Provides a keyboard shortcut ('Escape') to close the detailed view.
 * - The layout dynamically adjusts based on the `detail` mode to show or hide the full panel.
 */

import type { AudioState } from '~/types'

const props = defineProps({
  audioPlayer: {
    type: Object as PropType<Ref<HTMLAudioElement>>,
    required: true
  },
  duration: {
    type: String,
    required: true
  }
})

//data
const audioState = ref<AudioState>('pause')
const detail = ref(false)

//composables
const { track, audioPlayer } = useAudioControls(props.audioPlayer, audioState)

//keyboard shortcuts
onKeyStroke('Escape', () => {
  detail.value = false
})
</script>

<template>
  <div :class="[$style['track-container'], { [$style['track-container-detail']]: detail }]">
    <!-- specific panel detail -->
    <div v-if="detail" class="w-full">
      <span :class="$style['mobile-background-blur']" />
      <img v-if="track" :src="track.image" width="1200" height="800" :class="$style['mobile-background-image']"
        alt="background album cover">

      <UTooltip text="Back to playlist" :shortcuts="['Esc']" :class="$style['back-button-container']">
        <UButton variant="link" color="white" size="xl" aria-label="Back to playlist" @click="detail = false">
          <UIcon name="i-fa6-solid-xmark" :class="$style['back-button-icon']" />
        </UButton>
      </UTooltip>

      <NuxtLink to="/" :class="$style['logo-wraper']">
        <Logo />
      </NuxtLink>
    </div>

    <div :class="$style['track-infos-container']">
      <!-- specific panel detail -->
      <img v-if="detail && track" :src="track.image" width="600" height="600"
        :class="$style['track-infos-container-img']" :alt="`album ${track.album_name} cover`">
      <!-- specific panel detail -->
      <TrackDetails v-if="track && detail" :name="track.name" :shareurl="track.shareurl"
        :artist-name="track.artist_name" :album-name="track.album_name" :album-image="track.album_image"
        :detail="detail" desktop />

      <!-- audio controls -->
      <div :class="[$style.controls, { [$style['controls-detail']]: detail, [$style['controls-home']]: !detail }]">
        <TrackDetails v-if="track" :name="track.name" :shareurl="track.shareurl" :artist-name="track.artist_name"
          :album-name="track.album_name" :album-image="track.album_image" :detail="detail" />

        <div :class="[$style['controls-audio-progress'], { [$style['controls-audio-progress-detail']]: detail }]">
          <!-- controls buttons (prev, stop, play, next) -->
          <AudioControls v-if="audioPlayer" :audio-player="audioPlayer" :state="audioState" :detail="detail" />
          <!-- Seek bar for track duration and position -->
          <AudioProgressBar v-if="duration && audioPlayer" :total-duration="duration" :audio-player="audioPlayer!"
            :state="audioState" :detail="detail" />
        </div>

        <!-- volume -->
        <div :class="$style['volume-container']">
          <AudioVolume v-if="audioPlayer" :audio-player="audioPlayer" :state="audioState" />
          <UButton variant="link" color="white" aria-label="open detail panel"
            :class="{ [$style['expand-button']]: detail }" @click="detail = !detail">
            <UIcon name="i-fa6-solid-expand" :class="$style['icon-expand-button']" />
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>


<style module lang="postcss">
/* main container */
.track-container {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  background: rgb(2, 10, 17)
}

.track-container-detail {
  height: 100vh;
  background: transparent;
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
  z-index: 9999;

  &:hover {
    color: rgb(176, 176, 176);
  }
}

.back-button-icon {
  color: #fff;
  width: 1.5rem;
  height: 1.5rem;
}

/* logo */
.logo-wraper {
  position: absolute;
  left: 1rem;
  top: 1rem;
}

/* track infos */
.track-infos-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
}

.track-infos-mobile-container {
  gap: 1rem;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-bottom: 2rem;
  justify-content: space-between;
}

.track-infos-container-img {
  width: 100%;
  height: 100%;
  object-fit: none;
}

/* volume */
.volume-container {
  width: auto;
  display: flex;
  gap: 0.5rem;
  align-items: center;
  justify-content: flex-end;
}

/* expand button */
.expand-button {
  display: none;
}

.icon-expand-button {
  color: #fff;
  width: 1.5rem;
  height: 1.5rem;
}

/* Media Queries */
@media (min-width: 640px) {
  .track-infos-mobile-container {
    display: flex;
    flex-direction: row;
  }
}

@media (min-width: 768px) {
  .track-infos-mobile-container {
    display: none;
  }

  .controls .download-button-container {
    display: block;
  }

  .volume-container {
    display: flex;
  }
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
  align-items: end;
  flex-direction: column;
  place-content: end;
}

.controls-home {
  height: 5rem;
}

.controls-audio-progress {
  padding-left: 0.75rem;
  padding-right: 0.75rem;
}

.controls-audio-progress-detail {
  width: 100%;
  display: flex;
  flex-direction: column-reverse;
}

.download-button-container {
  width: 15rem;
  display: none;
}

.audio-player {
  display: none;
}

/* Media Queries */
@media (min-width: 640px) {
  .track-infos-mobile-container {
    width: 100%;
    display: flex;
    flex-direction: row;
  }
}

@media (min-width: 768px) {
  .track-infos-mobile-container {
    display: none;
  }

  .track-infos-container {
    display: flex;
  }

  .track-infos-container-img {
    display: block;
    object-fit: cover;
    max-width: 500px;
    max-height: 500px;
  }

  .controls {
    justify-content: space-between;
  }

  .controls-audio-progress {
    width: 100%;
  }

  .volume-container {
    width: 15rem;
    display: flex;
    max-width: 300px;
    width: 100%;
  }

  .controls-detail {
    padding-top: 7rem;
    height: 12rem;
    place-self: end;
    margin-bottom: -6rem;
    flex-direction: row;
    align-items: center;
    padding-bottom: 2rem;
  }
}
</style>