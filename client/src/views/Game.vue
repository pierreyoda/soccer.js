<template>
  <div v-if="loggedIn">
    <div v-if="!!roomId" class="flex flex-col">
      <game-canvas></game-canvas>
      <chat class="flex-grow" :messages="messages"
        @send-message="(text) => sendMessage(text)">
      </chat>
    </div>
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
import * as msgpack from "msgpack-lite";
import { Application } from "@feathersjs/feathers";
import { Component, Vue } from "vue-property-decorator";

import { gameClient, gameSocket } from "../game";
import Login from "@/components/Login.vue";
import Dashboard from "@/components/Dashboard.vue";
import RoomCreate from "@/components/RoomCreate.vue";
import Chat from "@/components/Chat.vue";
import GameCanvas from "@/components/GameCanvas.vue";
// FIXME: shared module path
import { ClientCreateRoom, ServerCreateRoomAck, ClientJoinRoom, RoomDataType, ServerChatMessage } from "../../../core/src/payloads";
import { GameRoomState, applyBinaryPatch } from "../../../core/src/main";

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
  private gameRoomState: GameRoomState | null = null;
  private messages: ServerChatMessage[] = [];
  private gameRoomStateEncoded = new Uint8Array();

  mounted() {
    this.client = gameClient;
    gameSocket.on("disconnect", () => {
      this.loggedIn = false;
    });
    gameSocket.on("room_data", (binaryData: Buffer) => {
      const data = msgpack.decode(new Uint8Array(binaryData));
      const type = data[0] as RoomDataType;
      switch (type) {
        case RoomDataType.ROOM_STATE_FULL:
          this.gameRoomState = data[1];
          this.gameRoomStateEncoded = msgpack.encode(this.gameRoomState);
        case RoomDataType.ROOM_STATE_PATCH:
          const patch = data[1];
          this.gameRoomStateEncoded = applyBinaryPatch(this.gameRoomStateEncoded, patch);
          this.gameRoomState = msgpack.decode(this.gameRoomStateEncoded);
      }
      this.messages = this.gameRoomState!.messages;
    });

    // join by URL
    this.roomId = this.$route.query.room
      ? this.$route.query.room.toString()
      : null;
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

  sendMessage(text: string) {
    gameSocket.emit("chat_message", text);
  }
}
</script>
