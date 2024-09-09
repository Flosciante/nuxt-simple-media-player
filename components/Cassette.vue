<script setup lang="ts">
import type { Track } from '~/types'

const props = defineProps({
  track: {
    type: Object as PropType<Track>,
    required: true
  },
  trackState: {
    type: String as PropType<'play' | 'pause' | 'stop'>,
    required: true
  }
})

const spoolLeft = ref<HTMLDivElement>()
const spoolRight = ref<HTMLDivElement>()

onMounted(() => {
  spoolLeft.value!.style.animationPlayState = 'paused'
  spoolRight.value!.style.animationPlayState = 'paused'
})

watch(() => props.trackState, () => {
  if (props.trackState === 'play') {
    spoolLeft.value!.style.animationPlayState = 'running'
    spoolRight.value!.style.animationPlayState = 'running'
  } else {
    spoolLeft.value!.style.animationPlayState = 'paused'
    spoolRight.value!.style.animationPlayState = 'paused'
  }
})
</script>

<template>
  <div class="w-full h-full flex items-center justify-center">
    <div class="flex rounded-2xl w-full h-full max-h-[80%] px-4 pt-4 bg-gray-800 front-side relative">
      <div class="absolute rounded-full h-4 w-4 bg-gray-200 top-2 left-2 flex items-center justify-center rotate-90">
        <UIcon name="i-heroicons-x-mark-16-solid" class="w-4 h-4 bg-gray-900 rotate-45" />
      </div>
      <div class="absolute rounded-full h-4 w-4 bg-gray-200 top-2 right-2 flex items-center justify-center">
        <UIcon name="i-heroicons-x-mark-16-solid" class="w-4 h-4 bg-gray-900 rotate-[15deg]" />
      </div>
      <div class="absolute rounded-full h-4 w-4 bg-gray-200 bottom-2 left-2 flex items-center justify-center">
        <UIcon name="i-heroicons-x-mark-16-solid" class="w-4 h-4 bg-gray-900 rotate-[30deg]" />
      </div>
      <div class="absolute rounded-full h-4 w-4 bg-gray-200 bottom-2 right-2 flex items-center justify-center">
        <UIcon name="i-heroicons-x-mark-16-solid" class="w-4 h-4 bg-gray-900 rotate-[15deg" />
      </div>
      <div class="w-full rounded-2xl px-4 pt-4 flex flex-col">
        <div class="w-full rounded-lg flex flex-col bg-orange-100 p-4 label-side relative">
          <div class="absolute bottom-0 left-0 flex flex-col w-full h-[50%]">
            <div class="bg-teal-600/40 w-full h-1/4" />
            <div class="bg-red-600/40 w-full h-1/2" />
            <div class="bg-green-600/40 w-full h-3/4" />
            <div class="bg-amber-300/40 w-full h-full rounded-lg" />
          </div>
          <div class="flex flex-col items-center justify-center rounded-2xl px-4 pb-4 bg-white">
            <div
              class="title w-[80%] h-12 border-b border-b-zinc-900 text-gray-900 flex items-end italic font-bold text-4xl truncate">
              {{ track.name }}
            </div>

            <div class="w-[80%] h-12 border-b border-b-zinc-900 text-gray-600 flex items-end text-2xl artist truncate">
              {{ track.artist_name }}
            </div>
          </div>

          <div class="w-full h-24 flex justify-center my-6">
            <div class="w-[80%] h-full bg-gray-800 rounded-full flex p-2 justify-between bg-gray-900/80 z-10">
              <div ref="spoolLeft" class="bg-gray-200 rounded-full h-full w-20 spool mr-8">
                <span />
                <span />
                <span />
              </div>
              <div class="flex-1 bg-gray-400 relative" />
              <div ref="spoolRight" class="bg-gray-200 rounded-full h-full w-20 spool ml-8">
                <span />
                <span />
                <span />
              </div>
            </div>
          </div>
        </div>
        <div class="w-full h-full front-side-bottom bg-gray-900/80" />
      </div>
    </div>

  </div>
</template>

<style lang="postcss" scoped>
.front-side {
  background-image: repeating-linear-gradient(11deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1) 1px, transparent 0px, transparent 4px);
  background-size: 8px;
}

.title,
.artist {
  font-family: "Nerko One"
}


.front-side-bottom {
  clip-path: polygon(10% 0, 90% 0, 100% 100%, 0% 100%);
  background-image: repeating-linear-gradient(11deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1) 1px, transparent 0px, transparent 4px);
  background-size: 8px;
  border: 4px;
  border: none;
}

.label-side {
  box-shadow: inset 4px 4px 8px rgba(0, 0, 0, 0.2),
    inset -4px -4px 8px rgba(0, 0, 0, 0.2),
    inset 4px -4px 8px rgba(0, 0, 0, 0.15),
    inset -4px 4px 8px rgba(0, 0, 0, 0.2);
}

.spool {
  border: 3px solid #636363;
  border-radius: 50%;
  position: relative;
  box-shadow: 0 0 0 3px #b0b0b0;
  background: #fcfcfc;
  animation: rotateInfinite 5s linear infinite;
}

.spool span {
  display: block;
  position: absolute;
  top: calc(50% - 2px);
  left: 50%;
  width: 100%;
  height: 5px;
  border: solid #636363;
  border-width: 0 6px;
}

@keyframes rotateInfinite {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.spool span:nth-child(1) {
  transform: translateX(-50%);
}

.spool span:nth-child(2) {
  transform: translateX(-50%) rotate(60deg);
}

.spool span:nth-child(3) {
  transform: translateX(-50%) rotate(-60deg);
}
</style>