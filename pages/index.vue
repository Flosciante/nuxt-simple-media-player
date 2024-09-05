<script lang="ts" setup>
import { usePlaylistStore } from '@/stores/usePlaylistStore';

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
</script>

<template>
  <div>
    <UTable :rows="playlist" :columns="columns">
      <template #name-data="{ row }">
        <div class="flex flex-col">
          <span class="text-white">{{ row.name }}</span>
          <span>{{ row.artist_name }}</span>
        </div>
      </template>
    </UTable>
  </div>
</template>
