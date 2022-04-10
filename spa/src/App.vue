<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
import { useGetPhotos } from './composables'
import { useAuthStore } from '@/stores'
import { AuthService } from '@/services'

const getCurrentUrlOrigin = () => window.location.origin
const { data: photos } = useGetPhotos()
const authStore = useAuthStore()
</script>

<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <HelloWorld msg="Hello Vue 3 + TypeScript + Vite" />

  <div :style="{marginBottom: '20px'}">
    <p v-if="authStore.error">Auth Error: {{ authStore.error.message }}</p>
    <p v-if="authStore.isLoading">Loading auth...</p>
    <button
      v-else-if="authStore.isAuthenticated"
      @click="() => AuthService.logout()"
    >
      Logout
    </button>
    <button
      v-else
      @click="() => AuthService.login()"
    >
      Login
    </button>
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
