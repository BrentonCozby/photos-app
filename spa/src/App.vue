<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
import { useAuthService, useGetPhotos } from './composables'

const getCurrentUrlOrigin = () => window.location.origin
const { AuthService, isAuthenticated, isLoading, error: authError } = useAuthService()
const { data: photos } = useGetPhotos()
</script>

<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <HelloWorld msg="Hello Vue 3 + TypeScript + Vite" />

  <div :style="{marginBottom: '20px'}">
    <p v-if="authError">Auth Error: {{ authError.message }}</p>
    <p v-if="isLoading">Loading auth...</p>
    <button
      v-else-if="isAuthenticated"
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
