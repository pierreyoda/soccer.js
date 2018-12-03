<template>
  <div class="w-full max-w-md mx-auto bg-grey-darkest">
    <h2>Soccer.js</h2>
    <button @click="$emit('create-room')" class="dashboard-btn">
      Create room
    </button>
    <rooms-list></rooms-list>
  </div>
</template>

<script lang="ts">
/**
 * Output events:
 * - create-room()
 */
import { Component, Vue } from "vue-property-decorator";

import RoomsList from "./RoomsList.vue";

@Component({
  components: {
    RoomsList,
  }
})
export default class Dashboard extends Vue {}
</script>
