<script setup lang="ts">
import { I_Photo } from '@/types'

defineProps<{
  photos?: I_Photo[]
}>()
</script>

<template>
  <div style="max-width: 400px; margin: auto;">
    <div v-for="photo in photos" style="text-align: left; display: flex; flex-wrap: wrap; align-items: center;">
      <img :src="photo.url" :alt="photo.name" style="width: 150px;" />
      <div style="margin-left: 12px; flex: 1;">
        <h3 style="margin-top: 0;">{{ photo.name }}</h3>
        <p>{{ photo.description }}</p>
        <small>Created: {{ new Date(photo.createdAt) }}</small>
      </div>
    </div>
  </div>
</template>
