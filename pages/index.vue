<script lang="ts" setup>
import { formatDuration } from '~/utils'
import { usePlaylistStore } from '@/stores/usePlaylistStore'
import type { Track } from '~/types'

const playlistStore = usePlaylistStore()
const playlist = playlistStore.getPlaylist

const query = ref('')

const filteredPlaylist = computed(() => {
  return playlist.filter((track) => {
    return (
      track.name.toLowerCase().includes(query.value.toLowerCase()) ||
      track.album_name.toLowerCase().includes(query.value.toLowerCase()) ||
      track.artist_name.toLowerCase().includes(query.value.toLowerCase())
    )
  })
})

async function select (row: Track) {
  playlistStore.playTrack(row)

  await navigateTo({ path: `/track` })
}
</script>

<template>
  <div :class="$style.container" class="w-full">
    <PlaylistHeader>
      <template #search>
        <UInput v-model="query" class="w-full hidden md:block md:pl-40 md:pr-20 lg:px-60"
          placeholder="Search title, artist or album" />
      </template>
    </PlaylistHeader>

    <table :class="$style['table']">
      <thead :class="$style['table-header']">
        <tr>
          <th :class="$style['table-header-index']">#</th>
          <th>Title</th>
          <th :class="$style['table-header-artist']">Album</th>
          <th :class="$style['table-header-duration']">Duration</th>
        </tr>
      </thead>

      <!-- Table Data -->
      <tbody v-if="filteredPlaylist && filteredPlaylist.length" :class="$style['table-body']">
        <tr v-for="(track, index) in filteredPlaylist" :key="track.id" @click="select(track)">
          <td :class="$style['body-track-index']">{{ index + 1 }}</td>

          <!-- Track Title -->
          <td :class="$style['body-track-title-wrapper']">
            <div :class="$style['body-track-title-container']">
              <img :src="track.image" :alt="`Album ${track.album_name} cover`" width="48" height="48">
              <div :class="$style['body-track-title-name-artist']">
                <div :class="$style['body-track-title-name']">{{ track.name }}</div>
                <div :class="$style['body-track-title-artist']">{{ track.artist_name }}</div>
              </div>
            </div>

          </td>

          <!-- Album Name -->
          <td :class="$style['body-track-album']">
            <span>{{ track.album_name }}</span>
          </td>

          <!-- Duration -->
          <td :class="$style['body-track-duration']">{{ formatDuration(track.duration) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style module lang="postcss">
.container {
  height: 100vh;
  width: 100vw;
  background-color: rgb(15 23 42);
  overflow-x: hidden;
}

.table {
  width: 100%;
  text-align: left;
  color: #a0a0a0;
  background-color: rgb(15 23 42);
  overflow-x: hidden;
}

.table-header {
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  border-color: rgb(15, 23, 42);
  padding-bottom: 1rem;
  background-color: rgba(15, 23, 42, 0.9);
  backdrop-filter: blur(0.5rem);
  z-index: 50;
  position: sticky;
  top: 0;

  & tr {
    color: #f0f0f0;
    font-size: 0.875rem;
  }

  & th {
    padding: 1rem;
  }
}

.table-header-artist,
.table-header-index,
.table-header-duration {
  display: none;
}


.table-body {
  cursor: pointer;

  & tr {
    margin-top: 1rem;
    transition: background-color 0.2s ease;
  }

  & tr:first-child {
    margin-top: 1rem;
  }

  & tr:hover {
    background-color: #2d3748;
  }
}

.body-track-index {
  padding-left: 1rem;
  padding-right: 1rem;
  display: none;
}

.body-track-title-wrapper {
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  display: grid;
  width: 100%;

  & img {
    width: 3rem;
    height: 3rem;
    margin-right: 1rem;
    border-radius: 0.125rem;
    display: none;
  }
}

.body-track-title-container {
  display: flex;
  align-items: center;
  overflow: hidden;
}

.body-track-title-name-artist {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.body-track-title-name {
  color: white;
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.body-track-title-artist {
  font-size: 0.875rem;
  color: #9ca3af;
}

.body-track-album {
  display: none;
  height: 100%;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
  display: none;
  align-items: center;
}

.body-track-duration {
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
  display: none;
}

@media (min-width: 768px) {

  .body-track-album,
  .table-header-artist {
    display: table-cell;
  }
}

@media (min-width: 640px) {

  .table-header-duration,
  .table-header-index,
  .body-track-index,
  .body-track-duration,
  .body-track-title-wrapper img {
    display: table-cell;
  }
}
</style>