<template>
  <div id="app">
    <lottery-app>
    </lottery-app>
  </div>
</template>

<script>
import LotteryApp from './components/LotteryApp.vue'

export default {
  name: 'app',
  components: {
    LotteryApp
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
  text-align: center;
  width: 1200px;
}
</style>
