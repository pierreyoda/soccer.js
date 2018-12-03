<template>
  <div class="">
    GAME CHAT
    <div v-for="(message, i) in messages" :key="i"
      class="bg-grey mb-4">
      <span>type {{ message.type }}</span>
      <span v-if="message.playerName">player name {{ message.playerName }}</span>
      <span>text {{ message.text }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { ServerChatMessage } from "../../../core/src/main";

@Component
export default class Chat extends Vue {
  @Prop() private messages!: ServerChatMessage[];
}
</script>
