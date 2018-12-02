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
      </div>
    </form>
  </div>
</template>

<script lang="ts">
/**
 * Output events:
 * - login(nickname: string)
 */
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class Login extends Vue {
  @Prop({ type: Number, default: 2 }) minNicknameLength!: number;

  private nickname = '';
  private error = false;

  submit() {
    if (!this.nicknameValid) return;
    this.$emit('login', this.nickname.trim());
  }

  get nicknameValid(): boolean {
    this.error = this.nickname.trim().length < this.minNicknameLength;
    return !this.error;
  }
}
</script>
