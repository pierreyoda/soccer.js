<template>
  <div class="w-full max-w-md mx-auto px-2">
    <form class="w-full form-card" @submit.prevent="submit">
      <h3 class="form-title">
        Create a new room
      </h3>
      <div class="flex flex-col items-start mb-4">
        <label class="form-input-label" for="name">
          Room name
        </label>
        <input id="name" v-model="name" class="form-input">
      </div>
      <div class="form-actions">
        <button type="submit" :disabled="!formValid" class="btn primary">
          Ok
        </button>
        <button type="button" class="btn cancel" @click="$emit('cancel')">
          Back
        </button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { ClientCreateRoom } from "../../../core/src/payloads";

/**
 * Output events:
 * - create-room(data: ClientCreateRoom)
 * - cancel()
 */
@Component
export default class RoomCreate extends Vue {
  private name = "";
  private password = "";
  private maxPlayers = 12;
  private showInList = true;

  submit() {
    const data: ClientCreateRoom = {
      name: this.name.trim(),
      password: this.password.trim() || undefined,
      maxPlayers: this.maxPlayers,
      showInList: this.showInList,
    };
    this.$emit("create-room", data);
  }

  get formValid(): boolean {
    return this.name.trim().length > 3 &&
      this.maxPlayers >= 2 && this.maxPlayers <= 20.
  }
}
</script>
