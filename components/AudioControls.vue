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
  }
})

const player = ref(props.audioPlayer)
const state = ref(props.state)

const { play, pause, stop, next, previous, audioState } = useAudioControls(player, state)
</script>

<template>
  <div :class="$style['controls-container']">
    <UTooltip text="Previous track" :shortcuts="['←']">
      <UButton size="xs" variant="outline" color="gray" name="i-heroicons-chevron-double-right-16-solid"
        :class="$style.prev" @click="previous()">
        <UIcon name="i-fa6-solid-backward-step" />
      </UButton>
    </UTooltip>

    <UTooltip :text="audioState === 'pause' || audioState === 'stop' ? 'Play track' : 'Pause track'">
      <UButton size="lg" variant="outline" color="white" :class="$style.play"
        @click="(audioState === 'pause' || audioState === 'stop') ? play() : pause()">
        <UIcon :name="(audioState === 'pause' || audioState === 'stop') ? 'i-fa6-solid-play' : 'i-fa6-solid-pause'" />
      </UButton>
    </UTooltip>

    <UTooltip text="Stop track">
      <UButton size="lg" variant="outline" color="white" :class="$style.stop" @click="stop()">
        <UIcon name="i-fa6-solid-stop" />
      </UButton>
    </UTooltip>

    <UTooltip text="next track" :shortcuts="['→']">
      <UButton size="md" variant="outline" color="gray" :class="$style.next" @click="next()">
        <UIcon name="i-fa6-solid-forward-step" />
      </UButton>
    </UTooltip>
  </div>
</template>

<style module lang="postcss">
.controls-container {
  height: 100%;
  display: flex;
  flex: 1;
  width: 100%;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.prev:hover,
.next:hover,
.play:hover,
.stop:hover {
  box-shadow: 7px 7px 16px 0 rgba(0, 0, 0, 0.5), -7px -7px 16px 0 rgb(30 41 59);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  transform: scale(1.1);
  transition: transform 0.2s ease-in-out, color 0.2s ease, background-color 0.2s ease;

  & span {
    color: white;
  }
}

.prev:active,
.next:active,
.play:active,
.stop:active {
  box-shadow: 5px 5px 10px 0 rgba(0, 0, 0, 0.3) inset, -5px -5px 12px 0 rgb(30 41 59) inset;
}

.play,
.stop {
  & span {
    width: 2rem;
    height: 2rem;
  }
}

.prev,
.next {
  & span {
    width: 1rem;
    height: 1rem;
  }
}
</style>