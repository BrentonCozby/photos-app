<script setup lang="ts">
import { I_Photo } from '@/types'

defineProps<{
  photos: I_Photo[]
}>()
</script>

<template>
  <div style="max-width: 400px; margin: auto;">
    <pre v-for="photo in photos" style="text-align: left;">
{{JSON.stringify(photo, null, 2)}},
    </pre>
  </div>
</template>
