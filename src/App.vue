<template>
  <div id="app">
    <RouterView>

    </RouterView>
    <!--    <i :class="`qi-${result.data.now.icon}`"></i>-->
  </div>
</template>
<script setup>
import { getWeatherIndexForecast } from '@/apis/weatherApis.js'
import { getLocation } from '@/apis/getLocation.js'

// getLocation().then(res => {
//   console.log(res)
// }).catch(error => {
//   console.log(error)
// })
</script>
<style>

</style>
