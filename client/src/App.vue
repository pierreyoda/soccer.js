<template>
  <div id="app" class="text-center">
    <div class="bg-black">
      <span class="bg-blue-darker font-semibold">
        <router-link to="/" class="text-white">Soccer.js</router-link>
      </span>
      <router-link to="/play" class="text-white">Play</router-link>
      <router-link to="/about" class="text-white">About</router-link>
    </div>
    <router-view/>
  </div>
</template>

<style lang="scss">
@import "app";

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
