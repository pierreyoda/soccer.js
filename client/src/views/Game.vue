<template>
  <div v-if="loggedIn">
    <template v-if="!!roomId">
      <game-canvas></game-canvas>
      <chat></chat>
    </template>
    <template v-else>
      <template v-if="dashboardTab === 'main'">
        <dashboard @create-room="dashboardTab = 'create-room'"></dashboard>
      </template>
      <template v-else-if="dashboardTab === 'create-room'">
        <room-create
          @create-room="(data) => createRoom(data)"
          @cancel="dashboardTab = 'main'">
        </room-create>
      </template>
    </template>
  </div>
  <div v-else-if="waitingForLogin">
    Pending...
  </div>
  <div class="flex items-center" v-else>
    <login @login="(nickname) => authenticate(nickname)"></login>
  </div>
</template>

<script lang="ts">
import { Application } from "@feathersjs/feathers";
import { Component, Vue } from "vue-property-decorator";

import { gameClient, gameSocket } from "../game";
import Login from "@/components/Login.vue";
import Dashboard from "@/components/Dashboard.vue";
import RoomCreate from "@/components/RoomCreate.vue";
import Chat from "@/components/Chat.vue";
import GameCanvas from "@/components/GameCanvas.vue";
import { ClientCreateRoom, ServerCreateRoomAck, ClientJoinRoom } from "../../../core/src/payloads";

type DashboardTab = "main" | "create-room";

@Component({
  components: {
    Login,
    Dashboard,
    RoomCreate,
    Chat,
    GameCanvas,
  },
})
export default class Game extends Vue {
  private client!: Application<object>;
  private waitingForLogin = false;
  private loggedIn = false;
  private roomId: string | null = null;
  private dashboardTab: DashboardTab = "main";

  mounted() {
    this.client = gameClient;
    gameSocket.on("disconnect", () => {
      this.loggedIn = false;
    })
    gameSocket.on("chat_message", (data: any) => {
      console.log("message", data.text);
    });

    // join by URL
    this.roomId = this.$route.query.room.toString();
  }

  authenticate(nickname: string) {
    console.log("Logging in as ", nickname);
    this.waitingForLogin = true;
    gameSocket.emit("login", {
      nickname,
    }, () => {
      this.waitingForLogin = false;
      this.loggedIn = true;
      if (this.roomId) {
        const data: ClientJoinRoom = {
          roomId: this.roomId,
        };
        gameSocket.emit("room_join", data);
      } else {
        this.dashboardTab = "main";
      }
    });
  }

  createRoom(data: ClientCreateRoom) {
    gameSocket.emit("room_create", data, (ackData: ServerCreateRoomAck) => {
      this.roomId = ackData.roomId;
    });
  }
}
</script>
