<template>
  <div v-if="loggedIn">
    <game-canvas></game-canvas>
    <chat></chat>
  </div>
  <div v-else-if="waitingForLogin">
    Pending...
  </div>
  <div class="container flex items-center" v-else>
    <login @login="(nickname) => authenticate(nickname)"></login>
  </div>
</template>

<script lang="ts">
import { Application } from "@feathersjs/feathers";
import { Component, Vue } from "vue-property-decorator";

import { gameClient, gameSocket } from "../game";
import Login from "@/components/Login.vue";
import Chat from "@/components/Chat.vue";
import GameCanvas from "@/components/GameCanvas.vue";

@Component({
  components: {
    Login,
    Chat,
    GameCanvas,
  },
})
export default class Game extends Vue {
  private client!: Application<object>;
  private waitingForLogin = false;
  private loggedIn = false;

  mounted() {
    this.client = gameClient;
    gameSocket.on("disconnect", () => {
      this.loggedIn = false;
    })
    gameSocket.on("chat_message", (data: any) => {
      console.log("message", data.text);
    });
  }

  authenticate(nickname: string) {
    console.log("Logging in as ", nickname);
    this.waitingForLogin = true;
    gameSocket.emit("login", {
      nickname,
    }, () => {
      this.waitingForLogin = false;
      this.loggedIn = true;
      console.log("Logged in.");
    });
  }
}
</script>
