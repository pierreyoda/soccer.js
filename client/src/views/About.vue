<template>
  <div>
    <h1>About Soccer.js</h1>
    <p>
      Soccer.js is an open-source clone of the realtime multiplayer
      game <a href="https://www.haxball.com">Haxball</a>.
    </p>
    <h2>Technology Stack</h2>
    <p>
      Soccer.js is composed of two separate Typescript application sharing some common code.
    </p>
    <h3>Client</h3>
    <p>
      The Soccer.js web client uses Vue.js with Tailwind CSS for styling.
    </p>
    <h3>Server</h3>
    <p>
      The Soccer.js server uses an Express-based Node.js stack built on Feathers.
      Communication with the clients is achieved with socket.io.
    </p>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class About extends Vue {}
</script>
