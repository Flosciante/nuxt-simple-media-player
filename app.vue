<script setup lang="ts">
import { usePlaylistStore } from '@/stores/usePlaylistStore'

const playlistStore = usePlaylistStore()

await playlistStore.fetchPlaylist()
</script>

<template>
  <div>
    <NuxtPage />
  </div>
</template>