<template>
  <div id="app" class="flex flex-col items-center">
    <nav class="w-full h-full flex flex-row items-center justify-between">
      <h1 class="brand">
        Soccer.js
      </h1>
      <div class="flex flex-row items-center justify-center">
        <router-link to="/" class="nav-link">Home</router-link>
        <router-link to="/play" class="nav-link">Play</router-link>
        <router-link to="/about" class="nav-link">About</router-link>
      </div>
      <a target="_blank" href="https://github.com/pierreyoda/soccer.js" class="github-link">
        <img src="./assets/github.png" alt="Github">
      </a>
    </nav>
    <div class="flex flex-col items-center justify-start content">
      <router-view/>
    </div>
  </div>
</template>

<style lang="scss">
@import "app";

body {
  font-family: 'Montserrat', 'Roboto', sans-serif;
}

#app {
  @apply min-h-screen text-center;
}

nav {
  @apply bg-sjs-teal-600 py-2 px-8;
  .brand {
    @apply font-bold text-2xl text-white;
  }
  .nav-link {
    @apply no-underline font-bold text-lg text-white mr-6;
    &:last-child {
      @apply mr-0;
    }
    &:hover {
      @apply text-sjs-blue-grey-300;
    }
    &.router-link-exact-active {
      @apply text-sjs-blue-100;
    }
  }
  .github-link {
    img {
      width: 30px;
      height: auto;
    }
  }
}

.content {
  @apply w-full h-full bg-sjs-blue-grey-050;
}
</style>
