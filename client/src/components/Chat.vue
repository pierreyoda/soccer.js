<template>
  <div class="bg-grey">
    <div>
      <div ref="messages">
        <div v-for="(message, i) in messages" :key="i">
          <span v-if="message.playerName">
            {{ message.playerName }}
          </span>
          <span class="chat-message" :class="{ [message.type]: true }">
            {{ message.text }}
          </span>
        </div>
      </div>
      <div>
        <input type="text" v-model="typedMessage">
        <button type="button" class="form-btn"
          @click="sendMessage" :disabled="!messageValid">
          Send
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from "vue-property-decorator";
import { ServerChatMessage } from "../../../core/src/main";

/**
 * Output events:
 * - send-message(text: string)
 */
@Component
export default class Chat extends Vue {
  @Prop() private messages!: ServerChatMessage[];
  private typedMessage = "";

  @Watch('messages')
  onMessagesChanged(messages: ServerChatMessage[]) {
    (this.$refs.messages as HTMLElement).scrollTop = 20 * messages.length;
  }

  get messageValid(): boolean {
    return this.typedMessage.trim().length > 0;
  }

  sendMessage() {
    if (!this.messageValid) { return; }
    this.$emit("send-message", this.typedMessage);
    this.typedMessage = "";
  }
}
</script>
