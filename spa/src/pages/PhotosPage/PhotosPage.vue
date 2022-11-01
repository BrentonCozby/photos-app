<script setup lang="ts">
import { ref, Ref } from 'vue'
import { usePhotosQuery, useCreatePhotoMutation, useDeletePhotoMutation } from '@/composables'
import { useAuthStore } from '@/stores'
import { authService } from '@/services'
import { getAxiosErrorData } from '@/utils'
import { I_Photo } from '@/models'
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

  if (!target?.files?.[0]) {
    throw new Error('Invalid file')
  }

  createPhotoMutation.mutate({
    photoData: {
      name: 'Zebra Ted',
      description: 'A slow zebra',
      file: target?.files?.[0],
    },
  })

  if (photoFileInput.value) {
    photoFileInput.value.value = ''
  }
}
</script>

<template>
  <div class="mb-4">
    <p v-if="authStore.error" class="text-red-500">
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
      class="ml-6"
      @change="onFileUpload"
    />

    <div v-if="photosQuery.data.value?.length" class="mt-6">
      <form @submit="onDeletePhoto">
        <input v-model="photoIdToDelete" class="mr-2" />
        <button type="submit" :disabled="deletePhotoMutation.isLoading.value">
          Delete
        </button>
      </form>
      <p v-if="deletePhotoMutation.error.value" class="text-red-500">
        Error Deleting: {{ getAxiosErrorData(deletePhotoMutation.error.value)?.detail }}
      </p>
    </div>
  </div>

  <p v-if="photosQuery.isLoading.value">Loading photos...</p>
  <p v-if="createPhotoMutation.isLoading.value">Adding photo...</p>

  <div v-if="createPhotoMutation.error.value" class="text-red-500">
    <div>Failed to add photo:</div>
    <div class="max-w-md mx-auto">
      <p>{{ getAxiosErrorData(createPhotoMutation.error.value)?.detail }}</p>
    </div>
  </div>

  <PhotoList :photos="photosQuery.data.value" />
</template>
