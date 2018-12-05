<template>
  <div v-if="waitingForServer">
    Pending...
  </div>
  <div v-else-if="loggedIn">
    <div v-if="!!roomId" class="flex flex-col">
      {{ roomId }}
      <game-canvas></game-canvas>
      <chat class="flex-grow" :messages="messages"
        @send-message="(text) => sendMessage(text)">
      </chat>
    </div>
    <template v-else>
      {{ nickname }}
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
  <div class="flex items-center" v-else>
    <login @login="(nickname) => authenticate(nickname)"></login>
  </div>
</template>

<script lang="ts">
import * as msgpack from "msgpack-lite";
import { Application } from "@feathersjs/feathers";
import { Component, Vue } from "vue-property-decorator";

import { ClientServerConnection } from "../game";
import Login from "@/components/Login.vue";
import Dashboard from "@/components/Dashboard.vue";
import RoomCreate from "@/components/RoomCreate.vue";
import Chat from "@/components/Chat.vue";
import GameCanvas from "@/components/GameCanvas.vue";
// FIXME: shared module path
import { ClientCreateRoom, ServerCreateRoomAck, ClientJoinRoom, RoomDataType, ServerChatMessage } from "../../../core/src/payloads";
import { GameRoomState, applyBinaryPatch, LobbyRoomState } from "../../../core/src/main";

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
  private serverConnection!: ClientServerConnection;
  private waitingForServer = false;
  private loggedIn = false;
  private roomId: string | null = null;
  private dashboardTab: DashboardTab = "main";
  private nickname = "";
  private gameRoomState: GameRoomState | null = null;
  private messages: ServerChatMessage[] = [];

  mounted() {
    this.serverConnection = new ClientServerConnection(
      this.onDisconnection,
      this.onLobbyStateUpdate,
      this.onGameStateUpdate,
    );

    // join game room by URL
    this.roomId = this.$route.query.room
      ? this.$route.query.room.toString()
      : null;
  }

  onDisconnection() {
    console.log("Disconnected from server.");
    this.loggedIn = false;
  }

  onLobbyStateUpdate(state: LobbyRoomState) {
    console.log("lobby state", state);
  }

  onGameStateUpdate(state: GameRoomState) {
    this.gameRoomState = {...state};
    this.messages = this.gameRoomState.messages;
  }

  async authenticate(nickname: string) {
    console.log("Logging in as ", nickname);
    this.nickname = nickname;
    this.waitingForServer = true;
    // TODO: error handling
    this.loggedIn = await this.serverConnection.login(nickname);
    this.waitingForServer = false;
    if (this.loggedIn && this.roomId) {
      await this.joinRoom({
        roomId: this.roomId,
      });
    } else {
      this.dashboardTab = "main";
    }
  }

  async joinRoom(data: ClientJoinRoom) {
    this.waitingForServer = true;
    const success = await this.serverConnection.joinGameRoom(data);
    if (!success) {
      // TODO: error handling
      console.error(`Cannot join game room "${data.roomId}".`);
    }
    this.waitingForServer = false;
  }

  async createRoom(data: ClientCreateRoom) {
    this.waitingForServer = true;
    // TODO: error handling
    this.roomId = await this.serverConnection.createGameRoom(data);
    this.waitingForServer = false;
  }

  sendMessage(text: string) {
    this.serverConnection.sendMessage(text);
  }
}
</script>
