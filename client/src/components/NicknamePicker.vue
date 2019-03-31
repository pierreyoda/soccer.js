<template>
  <div class="w-full max-w-md mx-auto px-2">
    <form class="w-full form-card" @submit.prevent="submit">
      <h3 class="form-title">
        Choose your nickname
      </h3>
      <div class="flex flex-col items-start mb-4">
        <label class="form-input-label" for="nickname">
          Nickname
        </label>
        <input id="nickname" v-model="nickname" @keyup.enter="submit" class="form-input">
        <span class="form-input-error">
          {{ !!nickname.trim() && error ? 'Invalid nickname.' : '&nbsp;' }}
        </span>
      </div>
      <div class="form-actions">
        <button type="submit" :disabled="!nicknameValid" class="btn primary">
          Ok
        </button>
        <button v-if="!!currentNickname" type="button" class="btn cancel"
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
    if (!this.nicknameValid) { return; }
    this.$emit('picked', this.nickname.trim());
  }

  get nicknameValid(): boolean {
    if (this.nickname === this.currentNickname) { return false; }
    this.error = this.nickname.trim().length < this.minNicknameLength;
    return !this.error;
  }
}
</script>
