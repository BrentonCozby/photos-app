<script setup lang="ts">
import { ref, Ref } from 'vue'
import { usePhotosQuery, useCreatePhotoMutation, useDeletePhotoMutation } from '@/composables'
import { useAuthStore } from '@/stores'
import { authService } from '@/services'
import { getAxiosErrorData } from '@/utils'
import { I_Photo } from '@/types'
import PhotoList from '@/components/PhotoList/PhotoList.vue'

const authStore = useAuthStore()
const photosQuery = usePhotosQuery()
const createPhotoMutation = useCreatePhotoMutation()
const deletePhotoMutation = useDeletePhotoMutation()

let photoFileInput: Ref<HTMLInputElement | null> = ref(null)

let photoIdToDelete: Ref<I_Photo['id']> = ref('')

async function onDeletePhoto(e: Event) {
  e.preventDefault()

  await deletePhotoMutation.mutate({ id: photoIdToDelete.value })

  photoIdToDelete.value = ''
  createPhotoMutation.reset.value()
}

async function onFileUpload(e: Event) {
  const target = e.target as HTMLInputElement

  createPhotoMutation.mutate({
    photoData: {
      name: 'Zebra Ted',
      description: 'A slow zebra',
    },
    photoFile: target?.files?.[0],
  })

  if (photoFileInput.value) {
    photoFileInput.value.value = ''
  }
}
</script>

<template>
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
    <input
      v-if="authStore.isAuthenticated"
      ref="photoFileInput"
      type="file"
      :style="{marginLeft: '24px'}"
      @change="onFileUpload"
    />

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

  <PhotoList :photos="photosQuery.data.value" />
</template>
