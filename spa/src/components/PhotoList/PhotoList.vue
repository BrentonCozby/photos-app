<script setup lang="ts">
import { I_Photo } from '@/models'
import { SIZES_CONFIG } from '@/constants'
import { buildPhotoUrl } from '@/utils'

defineProps<{
  photos?: I_Photo[]
}>()
</script>

<template>
  <div class="max-w-md mx-auto">
    <div v-for="photo in photos" style="text-align: left; display: flex; flex-wrap: wrap; align-items: center;">
      <img :src="buildPhotoUrl({ ...photo, size: 'sm' })" :alt="photo.name" :style="{width: `${SIZES_CONFIG.xs.width}px` }" />
      <div style="margin-left: 12px; flex: 1;">
        <h3 style="margin-top: 0;">{{ photo.name }}</h3>
        <p>{{ photo.description }}</p>
        <small>Created: {{ new Date(photo.createdAt).toLocaleString() }}</small>
      </div>
    </div>
  </div>
</template>
