<template>
  <div class="w-full max-w-md mx-auto bg-grey-darkest">
    <h2>Soccer.js</h2>
    <button @click="$emit('create-room')" class="dashboard-btn">
      Create room
    </button>
  </div>
</template>

<script lang="ts">
/**
 * Output events:
 * - create-room()
 */
import { Component, Vue } from "vue-property-decorator";

@Component
export default class Dashboard extends Vue {}
</script>
