<template>
  <div class="w-full">
    <div class="dashboard-card">
      <h2 class="text-white">
        Rooms list
      </h2>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

/**
 * Output events:
 * - join-room(roomId: string)
 */
@Component
export default class RoomsList extends Vue {
}
</script>
