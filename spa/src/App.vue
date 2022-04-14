<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
import { usePhotosQuery, useCreatePhotoMutation } from './composables'
import { useAuthStore } from '@/stores'
import { authService } from '@/services'
import { getAxiosErrorData } from '@/utils'

const getCurrentUrlOrigin = () => window.location.origin

const authStore = useAuthStore()

const { data: photos, isLoading: isLoadingPhotos } = usePhotosQuery()

const {
  mutate: createPhoto,
  isLoading: isCreatingPhoto,
  error: createPhotoError,
} = useCreatePhotoMutation()

function onAddPhotoClick() {
  createPhoto({
    photoData: {
      name: 'Zebra Ted',
      description: 'A slow zebra',
      // url: 'photosapp.com/2',
    }
  })
}
</script>

<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <HelloWorld msg="Hello Vue 3 + TypeScript + Vite" />

  <div :style="{marginBottom: '20px'}">
    <p v-if="authStore.error">Auth Error: {{ authStore.error.message }}</p>
    <p v-if="authStore.isLoading">Loading auth...</p>
    <button
      v-else-if="authStore.isAuthenticated"
      @click="() => authService.logout()"
    >
      Logout
    </button>
    <button
      v-else
      @click="() => authService.login()"
    >
      Login
    </button>
    <button
      v-if="authStore.isAuthenticated"
      :style="{marginLeft: '24px'}"
      @click="onAddPhotoClick"
    >
      Add Photo
    </button>
  </div>

  <p v-if="isLoadingPhotos">Loading photos...</p>
  <p v-if="isCreatingPhoto">Adding photo...</p>

  <div v-if="createPhotoError" :style="{color: 'red'}">
    <div>Failed to add photo:</div>
    <div style="max-width: 400px; margin: auto;">
      <p>{{ getAxiosErrorData(createPhotoError)?.detail }}</p>
    </div>
  </div>

  <div style="max-width: 400px; margin: auto;">
    <pre v-for="photo in photos" style="text-align: left;">
{{JSON.stringify(photo, null, 2)}},
    </pre>
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
