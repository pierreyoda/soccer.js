<template>
  <div class="w-full max-w-xs mx-auto">
    <form class="form-card" @submit.prevent="submit">
      <h2 class="form-title">
        Choose your nickname
      </h2>
      <div class="mb-4">
        <label class="text-white text-sm font-bold" for="nickname">
          Nickname:
        </label>
        <input id="nickname" v-model="nickname" @keyup.enter="submit"
          class="form-input">
        <span v-if="nickname.trim() && error" class="text-sm text-red-dark">
          Invalid nickname.
        </span>
      </div>
      <div>
        <button type="submit" :disabled="!nicknameValid" class="form-btn">
          Ok
        </button>
        <button v-if="!!currentNickname" type="button" class="form-btn-cancel"
          @click="$emit('cancel')">
          Back
        </button>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

/**
 * Output events:
 * - picked(nickname: string)
 *   a valid nickname has been picked
 * - cancel()
 *   cancel the nickname selection
 *   NB: the back button is available only if a current nickname is defined.
 */
@Component
export default class NicknamePicker extends Vue {
  @Prop({ type: String, default: "" }) currentNickname!: string;
  @Prop({ type: Number, default: 2 }) minNicknameLength!: number;

  private nickname = this.currentNickname;
  private error = false;

  submit() {
    if (!this.nicknameValid) return;
    this.$emit('picked', this.nickname.trim());
  }

  get nicknameValid(): boolean {
    if (this.nickname === this.currentNickname) return false;
    this.error = this.nickname.trim().length < this.minNicknameLength;
    return !this.error;
  }
}
</script>
