<template>
  <nickname-picker @picked="nickname => onNicknamePicked(nickname)">
  </nickname-picker>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

import NicknamePicker from "./NicknamePicker.vue";

/**
 * Output events:
 * - login(nickname: string)
 */
@Component({
  components: {
    NicknamePicker,
  },
})
export default class Login extends Vue {
  onNicknamePicked(nickname: string) {
    this.$emit("login", nickname);
  }
}
</script>
