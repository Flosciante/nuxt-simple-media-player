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

const volumeContainer = ref<HTMLDivElement | null>(null)
const player = ref(props.audioPlayer)
const state = ref(props.state)

const { playlistStore, volume } = useAudioControls(player, state)

const knobRotation = computed(() => {
  return `rotate(${(playlistStore.currentVolume / 100) * 270}deg)`
})
</script>

<template>
  <div ref="volumeContainer" :class="$style.volume">
    <div :class="$style['volume-knob']" :style="{ transform: knobRotation }" />
  </div>
  <URange v-model="volume" :class="$style['volume-range']" size="xs" />
</template>

<style module lang="postcss">
.volume {
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

.volume-range {
  width: 8rem;
}

@media (min-width: 1024px) {
  .volume-range {
    width: 10rem;
  }
}
</style>