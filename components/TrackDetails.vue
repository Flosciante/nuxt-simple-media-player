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
  <div :class="[$style['track-info-container'], { [$style['max-width-desktop']]: !desktop }]">
    <img v-if="!desktop" :src="albumImage" width="80" height="80" :class="$style.thumbnail">
    <div :class="[$style['track-info-content'], { [$style['align-items-center']]: desktop }]">
      <UTooltip text="See on Jamendo platform">
        <a :href="shareurl" target="_blank" rel="noopener noreferrer"
          :class="[$style['track-title'], !desktop ? $style['track-title-mobile'] : $style['track-title-desktop']]">
          {{ name }}
          <UIcon name="i-fa6-solid-up-right-from-square"
            :class="[$style['icon-spacing'], !desktop ? $style['icon-small'] : $style['icon-large']]" />
        </a>
      </UTooltip>
      <span :class="$style['album-name']">{{ albumName }}</span>
      <span :class="$style['artist-name']">By: <span :class="$style['font-italic']">{{ artistName }}</span></span>
    </div>
  </div>
</template>

<style module lang="postcss">
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

.track-title {
  font-weight: 600;
  color: #f3f4f6;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.2s ease;
}

.track-title:hover {
  color: #3b82f6;
}

.track-title-mobile {
  font-size: 1.125rem;
}

.track-title-desktop {
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

.font-italic {
  font-style: italic;
}

.thumbnail {
  display: block;
}

@media screen and (max-width: 640px) {
  .thumbnail {
    display: none;
  }
}
</style>