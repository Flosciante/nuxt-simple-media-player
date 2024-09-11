<script lang="ts" setup>
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
  <div :class="$style['player-progress-bar-container']">
    <span>{{ formatDuration(playlistStore.currentTime) }}</span>
    <URange v-model="playlistStore.currentTime" :min="0" :max="audioPlayer.duration" />
    <span>{{ totalDuration }}</span>
  </div>
</template>

<style module lang="postcss">
.player-progress-bar-container {
  width: 100%;
  padding-left: 1rem;
  padding-right: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;

  & span {
    width: 3rem;
  }

  & :nth-child(3) {
    text-align: right;
  }
}
</style>