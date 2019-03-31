<template>
  <div id="app" class="text-center">
    <div class="bg-black">
      <span class="bg-blue-700 font-semibold">
        <router-link to="/" class="no-underline text-white">Soccer.js</router-link>
      </span>
      <router-link to="/play" class="no-underline text-white">Play</router-link>
      <router-link to="/about" class="no-underline text-white">About</router-link>
    </div>
    <router-view/>
  </div>
</template>

<style lang="scss">
@import "app";

a.router-link-exact-active {
  color: #42b983;
}
</style>
