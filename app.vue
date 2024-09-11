<script setup lang="ts">
import { usePlaylistStore } from '@/stores/usePlaylistStore'

useHead({
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

const title = 'Flat Music Player'
const description = 'Listen your favorite music with Flat Music Player'

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description,
  ogSiteName: 'Flat Music Player',
  twitterCard: 'summary_large_image'
})

const playlistStore = usePlaylistStore()

await playlistStore.fetchPlaylist()
</script>

<template>
  <div class="h-screen w-screen">
    <NuxtPage />
  </div>
</template>