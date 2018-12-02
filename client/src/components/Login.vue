<template>
  <div class="w-full max-w-xs">
    <form class="bg-grey-darkest shadow-md rounded px-8 py-6 mb-4"
      @submit.prevent="submit">
      <h2 class="text-white">
        Choose your nickname
      </h2>
      <div class="mb-4">
        <label class="text-white text-sm font-bold" for="nickname">
          Nickname:
        </label>
        <input id="nickname" v-model="nickname" @keyup.enter="submit"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker leading-tight focus:outline-none focus:shadow-outline">
        <span v-if="nickname.trim() && error" class="text-sm text-red-dark">
          Invalid nickname.
        </span>
      </div>
      <div>
        <button type="submit" :disabled="!nicknameValid"
          class="py-2 px-4 bg-blue hover:bg-blue-dark text-white font-bold rounded focus:outline-none focus:shadow-outline">
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

<style lang="scss" scoped>

</style>
