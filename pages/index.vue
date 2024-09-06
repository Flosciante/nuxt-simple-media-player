<script lang="ts" setup>
import { formatDuration, getFormattedDate } from '~/utils'
import { usePlaylistStore } from '@/stores/usePlaylistStore'
import type { Track } from '~/types'

const playlistStore = usePlaylistStore()
const playlist = playlistStore.getPlaylist

const columns = [{
  key: 'position',
  label: '#'
}, {
  key: 'name',
  label: 'Title'
}, {
  key: 'album_name',
  label: 'Album'
}, {
  key: 'releasedate',
  label: 'Release date'
}, {
  key: 'duration',
  label: 'Duration'
}]

async function select (row: Track) {
  await navigateTo({ path: `/track/${row.id}` })
}
</script>

<template>
  <div>
    <header
      class="h-20 sticky top-0 backdrop-blur-sm bg-zinc-900/90 z-50 flex justify-between px-4 items-center gap-x-4 neon mb-4">
      <UInput class="w-full" :ui="{ rounded: 'rounded-full' }" icon="i-heroicons-glass" />
      <UAvatar src="https://avatars.githubusercontent.com/u/6696789?v=4" />
    </header>

    <UTable :rows="playlist" :columns="columns"
      :ui="{ divide: '', tr: { active: 'hover:bg-primary-100 cursor-pointer' } }" @select="select">
      <template #name-data="{ row }: { row: Track }">
        <div class="flex flex-row gap-x-2">
          <img :src="row.image" width="35" height="35">
          <div class="flex flex-col">
            <span class="text-white">{{ row.name }}</span>
            <span>{{ row.artist_name }}</span>
          </div>
        </div>
      </template>
      <template #duration-data="{ row }: { row: Track }">
        <span>{{ formatDuration(row.duration) }}</span>
      </template>
      <template #releasedate-data="{ row }: { row: Track }">
        <span>{{ getFormattedDate(row.releasedate) }}</span>
      </template>
    </UTable>
  </div>
</template>

<style scoped>
.neon {
  padding-bottom: 0.1em;
  box-shadow: 0 1px 0.1rem #fff,
    0 1px 0.1rem #fff,
    0 1px 0.5rem #bc13fe,
    0 1px 0.3rem #bc13fe,
    0 1px 1rem #bc13fe,
    0 -1px 0.5rem #bc13fe;
}
</style>