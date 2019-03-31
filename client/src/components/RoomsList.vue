<template>
  <div class="w-full py-2">
    <div class="flex">
      <div class="w-3/5 text-left text-white">
        Room name
      </div>
      <div class="w-1/5 text-left text-white">
        Password?
      </div>
      <div class="w-1/5 text-left text-white">
        Players
      </div>
    </div>
    <div class="overflow-y-auto rooms-list">
      <div v-if="rooms.length === 0" class="py-6">
        <span class="text-white text-sm text-center">
          No room is currently available.
        </span>
      </div>
      <div class="rooms-list-item flex"
        :class="{ selected: id === selectedRoomId }"
        v-for="[id, room] in rooms" :key="id"
        @click="$emit('select-room', id)"
        @dblclick="$emit('join-room', id)">
        <span class="w-3/5 text-white text-sm text-left">
          {{ room.name }}
        </span>
        <span class="w-1/5 text-white text-sm text-left">
          {{ room.hasPassword ? "Yes" : "No" }}
        </span>
        <span class="w-1/5 text-white text-sm text-left">
          {{ room.players }} / {{ room.maxPlayers }}
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

import { GameRoomStatus } from "../../../core/src/payloads";

/**
 * Output events:
 * - select-room(roomId: string)
 *   a room has been selected in the list (single click / keyboard)
 * - join-room(roomId: string)
 *   join a room (double click)
 *
 */
@Component
export default class RoomsList extends Vue {
  @Prop() private rooms!: [string, GameRoomStatus][];
  @Prop() private selectedRoomId!: string | null;
}
</script>

<style lang="scss" scoped>
.rooms-list {
  max-height: 500px;
  .rooms-list-item {
    @apply py-1;
    &.selected, &:hover {
      @apply bg-blue-700;
    }
  }
}
</style>
