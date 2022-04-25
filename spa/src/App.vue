<script setup lang="ts">
import { ref, Ref } from 'vue'
import HelloWorld from './components/HelloWorld.vue'
import { usePhotosQuery, useCreatePhotoMutation, useDeletePhotoMutation } from './composables'
import { useAuthStore } from '@/stores'
import { authService } from '@/services'
import { getAxiosErrorData } from '@/utils'
import { I_Photo } from './types'

const getCurrentUrlOrigin = () => window.location.origin

const authStore = useAuthStore()
const photosQuery = usePhotosQuery()
const createPhotoMutation = useCreatePhotoMutation()
const deletePhotoMutation = useDeletePhotoMutation()

let photoIdToDelete: Ref<I_Photo['id']> = ref('')

function onAddPhotoClick() {
  createPhotoMutation.mutate({
    photoData: {
      name: 'Zebra Ted',
      description: 'A slow zebra',
      url: 'photosapp.com/2',
    }
  })
}

async function onDeletePhoto(e: Event) {
  e.preventDefault()

  await deletePhotoMutation.mutate({ id: photoIdToDelete.value })
  photoIdToDelete.value = ''
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

    <div v-if="photosQuery.data.value?.length" :style="{marginTop: '24px'}">
      <form @submit="onDeletePhoto">
        <input v-model="photoIdToDelete" :style="{marginRight: '6px'}" />
        <button type="submit" :disabled="deletePhotoMutation.isLoading.value">
          Delete
        </button>
      </form>
      <p v-if="deletePhotoMutation.error.value" :style="{color: 'red'}">
        Error Deleting: {{ getAxiosErrorData(deletePhotoMutation.error.value)?.detail }}
      </p>
    </div>
  </div>

  <p v-if="photosQuery.isLoading.value">Loading photos...</p>
  <p v-if="createPhotoMutation.isLoading.value">Adding photo...</p>

  <div v-if="createPhotoMutation.error.value" :style="{color: 'red'}">
    <div>Failed to add photo:</div>
    <div style="max-width: 400px; margin: auto;">
      <p>{{ getAxiosErrorData(createPhotoMutation.error.value)?.detail }}</p>
    </div>
  </div>

  <div style="max-width: 400px; margin: auto;">
    <pre v-for="photo in photosQuery.data.value" style="text-align: left;">
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
