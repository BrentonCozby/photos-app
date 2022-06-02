<script setup lang="ts">
import { ref, provide } from 'vue'
import { debounce } from 'lodash'

const screenWidth = ref(window.innerWidth)

window.addEventListener('resize', debounce(() => {
  screenWidth.value = window.innerWidth
}, 100))

provide('screenWidth', screenWidth)
</script>

<template>
  <!-- nav -->
  <router-view></router-view>
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
