<template>
  <div class="w-full max-w-xs mx-auto">
    <form class="form-card" @submit.prevent="submit">
      <h2 class="form-title">
        Create a new room
      </h2>
      <div class="mb-4">
        <label class="text-white text-sm font-bold" for="name">
          Room name:
        </label>
        <input id="name" v-model="name" class="form-input">
      </div>
      <div>
        <button type="submit" :disabled="!formValid" class="form-btn">
          Ok
        </button>
        <button type="button" class="form-btn-cancel" @click="$emit('cancel')">
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
