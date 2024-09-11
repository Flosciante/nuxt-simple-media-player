<script setup lang="ts">
import { usePlaylistStore } from '@/stores/usePlaylistStore'

const playlistStore = usePlaylistStore()

await playlistStore.fetchPlaylist()
</script>

<template>
  <div class="h-screen w-screen">
    <NuxtPage />
  </div>
</template>