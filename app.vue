<script setup lang="ts">
import { usePlaylistStore } from '@/stores/usePlaylistStore';

const playlistStore = usePlaylistStore();

await playlistStore.fetchPlaylist();
</script>

<template>
  <div>
    <header class="h-20 border-b sticky top-0 backdrop-blur-sm bg-zinc-900/90 z-50 flex justify-between px-4 items-center gap-x-4 neon">
      <UInput class="w-full" :ui="{ rounded: 'rounded-full' }" icon="i-heroicons-glass" />
      <UAvatar src="https://avatars.githubusercontent.com/u/6696789?v=4" />


    </header>

    <UContainer>
      <NuxtPage />
    </UContainer>
  </div>
</template>

<style scoped>
.neon {
  border: none;
  border-bottom: 0.1rem solid #fff;
  padding-bottom: 0.1em;
  box-shadow: 0 2px 0.2rem #fff,
              0 2px 0.2rem #fff,
              0 2px 2rem #bc13fe,
              0 2px 0.8rem #bc13fe,
              0 2px 2.8rem #bc13fe,
              inset 0 -2px 1.3rem #bc13fe;
}
</style>
