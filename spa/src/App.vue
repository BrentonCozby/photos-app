<script setup lang="ts">
import { ref } from 'vue'
import HelloWorld from './components/HelloWorld.vue'
import JSONAPISerializer from 'json-api-serializer'

const Serializer = new JSONAPISerializer()

Serializer.register('photo')

const {
  VITE_PHOTOS_SERVICE_HOST: HOST,
  VITE_PHOTOS_SERVICE_PORT: PORT,
} = import.meta.env

let photos = ref([])

fetch(`http://${HOST}:${PORT}/photos`)
.then((r) => r.json())
.then((response) => {
  photos.value = Serializer.deserialize('photo', response)
})
// fetch(`http://${HOST}:${PORT}/photos/3`, { method: 'DELETE' })
fetch(`http://${HOST}:${PORT}/photos/4`)
</script>

<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <HelloWorld msg="Hello Vue 3 + TypeScript + Vite" />
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
