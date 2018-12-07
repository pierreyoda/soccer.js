<template>
  <div class="w-full px-6 py-2">
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
}
</style>
