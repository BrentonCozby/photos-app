<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
import { useAuth0 } from '@auth0/auth0-vue'
import { useGetPhotos } from './composables'

const auth0 = useAuth0()
const getCurrentUrlOrigin = () => window.location.origin
const { data: photos } = useGetPhotos()
</script>

<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <HelloWorld msg="Hello Vue 3 + TypeScript + Vite" />

  <div :style="{marginBottom: '20px'}">
    <span v-if="auth0.isLoading.value">Loading auth...</span>
    <button
      v-else-if="auth0.isAuthenticated.value"
      @click="() => auth0.logout({ returnTo: getCurrentUrlOrigin() })"
    >
      Logout
    </button>
    <button
      v-else
      @click="auth0.loginWithRedirect"
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
