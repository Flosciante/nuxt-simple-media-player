<script lang="ts" setup>
/**
 * This component displays and manages the track progress bar.
 * - Displays the current time and total duration of the track.
 * - Allows the user to control the track's progress.
 * - Automatically triggers the next track.
 */

import type { AudioState } from '~/types'

const props = defineProps({
  audioPlayer: {
    type: Object as PropType<HTMLAudioElement>,
    required: true
  },
  state: {
    type: String as PropType<AudioState>,
    required: true
  },
  totalDuration: {
    type: String,
    required: true
  },
  detail: {
    type: Boolean,
    default: false
  }
})

const player = ref(props.audioPlayer)
const state = ref(props.state)

const { playlistStore, next } = useAudioControls(player, state)

//if end of the track, move on to the next one
watch(() => playlistStore.currentTime, (newTime) => {
  if (newTime === props.audioPlayer.duration) {
    next(true)
  }
})
</script>

<template>
  <div
    :class="[$style['player-progress-bar'], detail ? $style['player-progress-bar-container-detail'] : $style['player-progress-bar-container']]">
    <div :class="$style['current-time']">{{ formatDuration(playlistStore.currentTime) }}</div>
    <URange v-model="playlistStore.currentTime" :min="0" :max="audioPlayer.duration" size="sm" />
    <div :class="$style['current-time']">{{ totalDuration }}</div>
  </div>
</template>

<style module lang="postcss">
.player-progress-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
}

.player-progress-bar-container {
  position: absolute;
  left: 0;
  right: 0;
  top: -14px;

  & :nth-child(3) {
    text-align: right;
  }

  & span {
    display: block;
  }
}

.player-progress-bar-container-detail {
  position: relative;
  padding-left: 1rem;
  padding-right: 1rem;

  & span {
    display: block;
  }
}

.current-time,
.total-duration {
  display: none;
  width: 2rem;
  font-size: 0.75rem;
}

@media (min-width: 768px) {
  .player-progress-bar-container {
    position: relative;
    padding-left: 2rem;
    padding-right: 2rem;
    padding-top: 1.2rem;

    & span {
      display: block;
    }
  }

  .player-progress-bar-container-detail {
    position: absolute;
    left: 0;
    right: 0;
    top: 4rem;
  }

  .current-time,
  .total-duration {
    display: block;
  }

}
</style>