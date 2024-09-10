<script setup lang="ts">
defineProps({
  albumImage: {
    type: String,
    required: true
  },
  shareurl: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  albumName: {
    type: String,
    required: true
  },
  artistName: {
    type: String,
    required: true
  },
  desktop: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <div class="track-info-container" :class="{ 'max-width-desktop': !desktop }">
    <img v-if="!desktop" :src="albumImage" width="80" height="80" class="thumbnail">
    <div class="track-info-content" :class="{ 'align-items-center': desktop }">
      <UTooltip text="See on Jamendo platform">
        <a :href="shareurl" target="_blank" rel="noopener noreferrer" class="track-link"
          :class="!desktop ? 'font-size-lg' : 'font-size-xl'">
          {{ name }}
          <UIcon name="i-fa6-solid-up-right-from-square" class="icon-spacing"
            :class="!desktop ? 'icon-small' : 'icon-large'" />
        </a>
      </UTooltip>
      <span class="album-name">{{ albumName }}</span>
      <span class="artist-name">By: <span class="font-italic">{{ artistName }}</span></span>
    </div>
  </div>
</template>

<style scoped lang="postcss">
.track-info-container {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.max-width-desktop {
  max-width: 520px;
}

.track-info-content {
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  width: 100%;
}

.align-items-center {
  align-items: center;
}

.track-link {
  font-weight: 600;
  color: #f3f4f6;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.2s ease;
}

.track-link:hover {
  color: #3b82f6;
}

.font-size-large {
  font-size: 1.125rem;
}

.font-size-extra-large {
  font-size: 1.875rem;
}

.icon-spacing {
  margin-left: 0.25rem;
}

.icon-small {
  width: 0.875rem;
  height: 0.875rem;
}

.icon-large {
  width: 1.25rem;
  height: 1.25rem;
}

.album-name {
  color: #d1d5db;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.artist-name {
  color: #9ca3af;
  font-size: 0.875rem;
}

.thumbnail {
  display: block;
}

.font-italic {
  font-style: italic;
}

@media screen and (max-width: 640px) {
  .thumbnail {
    display: none;
  }
}
</style>