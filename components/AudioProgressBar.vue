<script lang="ts" setup>
defineProps({
  audioPlayer: {
    type: Object as PropType<HTMLAudioElement>,
    required: true
  },
  totalDuration: {
    type: String,
    required: true
  }
})

const playlistStore = usePlaylistStore()
</script>

<template>
  <div class="audio-progress-bar-container">
    <span>{{ formatDuration(playlistStore.currentTime) }}</span>
    <URange v-model="playlistStore.currentTime" :min="0" :max="audioPlayer.duration" />
    <span>{{ totalDuration }}</span>
  </div>
</template>

<style lang="postcss">
.audio-progress-bar-container {
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