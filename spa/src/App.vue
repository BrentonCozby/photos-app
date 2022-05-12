<script setup lang="ts">
import { ref, Ref } from 'vue'
import HelloWorld from './components/HelloWorld.vue'
import { usePhotosQuery, useCreatePhotoMutation, useDeletePhotoMutation } from './composables'
import { useAuthStore } from '@/stores'
import { authService } from '@/services'
import { getAxiosErrorData } from '@/utils'
import { I_Photo } from './types'

const authStore = useAuthStore()
const photosQuery = usePhotosQuery()
const createPhotoMutation = useCreatePhotoMutation()
const deletePhotoMutation = useDeletePhotoMutation()

let photoIdToDelete: Ref<I_Photo['id']> = ref('')

function onAddPhotoClick() {
  const lastPhotoId = Number(photosQuery?.data?.value?.at(-1)?.url.replace('photosapp.com/', '')) || 0;

  createPhotoMutation.mutate({
    photoData: {
      name: 'Zebra Ted',
      description: 'A slow zebra',
      url: `photosapp.com/${lastPhotoId + 1}`,
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
  <HelloWorld msg="Photos App" />

  <div :style="{marginBottom: '20px'}">
    <p v-if="authStore.error" :style="{color: 'red'}">
      Auth Error: {{ authStore.error.message }}
    </p>
    <p v-if="authStore.isLoading">
      Loading auth...
    </p>

    <button
      v-else-if="authStore.isAuthenticated"
      @click="() => authService.logout()"
    >
      Logout
    </button>
    <span v-else>
      <button @click="() => authService.login()">
        Login / Sign Up
      </button>
    </span>
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
