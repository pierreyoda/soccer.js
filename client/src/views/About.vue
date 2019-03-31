<template>
  <section class="w-full h-full flex flex-col items-center justify-center about">
    <h2>About Soccer.js</h2>
    <p>
      Soccer.js is an open-source clone of the realtime multiplayer
      game <a href="https://www.haxball.com">Haxball</a>.
    </p>
    <h3>Technology Stack</h3>
    <p>
      Soccer.js is composed of two separate Typescript applications sharing some common code.
    </p>
    <h3>Client</h3>
    <p>
      The Soccer.js web client uses Vue.js with Tailwind CSS for styling.<br>
      The game canvas itself is displayed and managed by ExcaliburJS.
    </p>
    <h3>Server</h3>
    <p>
      The Soccer.js server uses a Node.js stack built on NestJS.<br>
      Communication with the clients is achieved with socket.io.
    </p>
  </section>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class About extends Vue {}
</script>

<style lang="scss" scoped>
.about {
  @apply px-4;
  h2 {
    @apply font-bold text-3xl text-sjs-teal-600 pb-5;
  }
  h3 {
    @apply font-semibold text-xl text-sjs-teal-700 pt-8;
  }
  p {
    @apply py-3;
    a {
      @apply no-underline font-bold text-sjs-teal-500;
    }
  }
}
</style>
