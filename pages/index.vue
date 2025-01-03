<script lang="ts" setup>
/**
 * This component renders the playlist of tracks and the audio player.
 * - It uses the `useAudioControls` composable to manage playback (play, pause, etc.) and the `playlistStore` for state management.
 * - Allows selecting tracks and controlling playback using buttons or by clicking on rows.
 * - Keeps track of the current playback time and syncs it with the audio player.
 * - The `audioPlayer` element is used for managing the HTML5 audio playback.
 */

import { formatDuration } from '~/utils'
import type { Track, AudioState } from '~/types'

const audioPlayer = ref<HTMLAudioElement | null>(null)
const query = ref('')
const audioState = ref<AudioState>('pause')

const isTabletScreen = useMediaQuery('(max-width: 768px)')

const { playlistStore, play, pause, initAudioPlayer, duration } = useAudioControls(audioPlayer, audioState)
const playlist = playlistStore.getPlaylist

//hooks
onMounted(async () => {
  await nextTick()
  //Initializes the audio player when the component is mounted.
  if (audioPlayer.value) {
    initAudioPlayer()
  }
})

//watchers
//keep position if click on progress bar
watch(
  () => playlistStore.currentTime,
  (newTime) => {
    if (audioPlayer.value && Math.abs(audioPlayer.value.currentTime - newTime) > 0.1) {
      audioPlayer.value.currentTime = newTime
    }
  }
)

const filteredPlaylist = computed(() => {
  return playlist.filter((track) => {
    return (
      track.name.toLowerCase().includes(query.value.toLowerCase()) ||
      track.album_name.toLowerCase().includes(query.value.toLowerCase()) ||
      track.artist_name.toLowerCase().includes(query.value.toLowerCase())
    )
  })
})

const selectedRow = (id: string) => playlistStore.currentTrack?.id === id
const canPlayTrack = (id: string) => !selectedRow(id) || ['pause', 'stop'].includes(playlistStore.audioState)

// select row in table
const select = async (row: Track) => {
  if (canPlayTrack(row.id)) {
    playlistStore.playTrack(row)
    playlistStore.currentTime = 0
    play()
  } else {
    playlistStore.pauseTrack()
    pause()
  }
}
</script>

<template>
  <div :class="$style.container" class="w-full mb-20">
    <PlaylistHeader>
      <template #search>
        <UInput v-model="query" class="w-full hidden md:block md:pl-40 md:pr-20 lg:px-60"
          placeholder="Search title, artist or album" />
      </template>
    </PlaylistHeader>

    <div :class="$style['table-wrapper']">
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
          <tr v-for="(track, index) in filteredPlaylist" :key="track.id"
            @click="isTabletScreen ? select(track) : () => { }">
            <td :class="$style['body-track-index']">
              <span v-if="canPlayTrack(track.id)"
            :class="[$style['track-index'], { [$style['body-track-in-progress']]: selectedRow(track.id) }]">{{ index + 1
            }}</span>
              <UIcon v-else name="i-fa6-solid-volume-high"
                :class="[$style['icon-sound'], $style['body-track-in-progress']]" />
              <UButton :icon="canPlayTrack(track.id) ? 'i-fa6-solid-play' : 'i-fa6-solid-pause'" variant="link"
                size="xs" :class="$style['play-button']" @click="select(track)" />
            </td>

            <!-- Track Title -->
            <td :class="$style['body-track-title-wrapper']">
              <div :class="$style['body-track-title-container']">
                <img :src="track.image" :alt="`Album ${track.album_name} cover`" width="48" height="48">
                <div :class="$style['body-track-title-name-artist']">
                  <div
                    :class="[$style['body-track-title-name'], { [$style['body-track-in-progress']]: selectedRow(track.id) }]">
                    {{ track.name }}</div>
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

    <div v-if="audioPlayer && duration" class="absolute bottom-0 w-full bg-black z-50">
      <AudioPlayer :audio-player="audioPlayer" :duration="duration" />
    </div>

    <audio ref="audioPlayer" controls :class="$style['audio-player']" />
  </div>
</template>

<style module lang="postcss">
.container {
  height: 100vh;
  width: 100vw;
  background-color: rgb(15 23 42);
  overflow-x: hidden;
}

.table-wrapper {
  margin-bottom: 6rem;
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
.table-header-duration {
  display: none;
}


.table-body {
  cursor: pointer;

  & tr {
    margin-top: 1rem;
    transition: background-color 0.2s ease;

    .icon-sound {
      display: block;
    }
  }

  & tr:first-child {
    margin-top: 1rem;
  }

  & tr:hover {
    background-color: #2d3748;

    .track-index {
      display: none;
    }

    .icon-sound {
      display: block;
    }

    .play-button {
      display: none !important;
      margin-left: -0.5rem;
    }
  }
}

.body-track-index {
  padding-left: 1rem;
  padding-right: 1rem;
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

.body-track-in-progress {
  color: rgb(59 130 246);
}

.body-track-title-artist {
  font-size: 0.875rem;
  color: #c0c6d0;
}

.body-track-album,
.body-track-duration {
  font-size: 0.85rem;
  color: rgb(203, 203, 203);
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

.play-button {
  display: none;
}

.audio-player {
  display: none;
}

@media (min-width: 768px) {

  .body-track-album,
  .table-header-artist {
    display: table-cell;
  }

  .table-body {
    & tr:hover {
      .play-button {
        display: block !important;
      }

      .icon-sound {
        display: none;
      }
    }
  }
}

@media (min-width: 640px) {

  .table-header-duration,
  .body-track-duration {
    display: table-cell;
  }
}
</style>