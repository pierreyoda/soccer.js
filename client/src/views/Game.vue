<template>
  <section class="w-full h-full flex flex-col items-center justify-start">
    <div v-if="waitingForServer" class="h-full flex flex-col justify-center">
      <semipolar-spinner :animation-duration="2000" :size="125" color="#199473" />
      <span class="font-semibold text-sm text-sjs-blue-grey-800 pt-2">
        Pending...
      </span>
    </div>
    <div v-else-if="!loggedIn" class="w-full flex flex-col items-center justify-start pt-12">
      <login @login="(nickname) => authenticate(nickname)"></login>
    </div>
    <div v-else class="w-full flex flex-col items-center justify-start pt-12 px-4">
      <div v-if="!!roomId" class="flex flex-col">
        <game-canvas :client-id="clientId"></game-canvas>
        <chat class="flex-grow" :messages="messages"
          @send-message="text => sendMessage(text)">
        </chat>
      </div>
      <template v-else>
        <template v-if="dashboardTab === 'main'">
          <dashboard :lobby-state="lobbyRoomState"
            @create-room="dashboardTab = 'create-room'"
            @join-room="data => joinRoom(data)"
            @change-nickname="dashboardTab= 'change-nickname'">
          </dashboard>
        </template>
        <template v-else-if="dashboardTab === 'create-room'">
          <room-create
            @create-room="data => createRoom(data)"
            @cancel="dashboardTab = 'main'">
          </room-create>
        </template>
        <template v-else-if="dashboardTab === 'change-nickname'">
          <nickname-picker :current-nickname="nickname"
            @picked="nickname => changeNickname(nickname)"
            @cancel="dashboardTab = 'main'">
          </nickname-picker>
        </template>
      </template>
    </div>
  </section>
</template>

<script lang="ts">
import * as msgpack from "msgpack-lite";
import { Component, Vue } from "vue-property-decorator";
import SemipolarSpinner from 'epic-spinners/src/components/lib/SemipolarSpinner.vue';

import { ClientServerConnection } from "../game";
import Login from "@/components/Login.vue";
import Dashboard from "@/components/Dashboard.vue";
import RoomCreate from "@/components/RoomCreate.vue";
import NicknamePicker from "@/components/NicknamePicker.vue";
import Chat from "@/components/Chat.vue";
import GameCanvas from "@/components/GameCanvas.vue";
// FIXME: shared module path
import {
  ClientCreateRoom,
  ServerCreateRoomAck,
  ClientJoinRoom,
  ServerChatMessage,
} from "../../../core/src/payloads";
import {
  GameRoomState,
  LobbyRoomState,
  lobbyRoomInitialState,
} from "../../../core/src/states";

type DashboardTab = "main" | "create-room" | "change-nickname";

@Component({
  components: {
    SemipolarSpinner,
    Login,
    Dashboard,
    RoomCreate,
    NicknamePicker,
    Chat,
    GameCanvas,
  },
})
export default class Game extends Vue {
  private serverConnection!: ClientServerConnection;
  private waitingForServer = false;
  private serverError = false;
  private loggedIn = false;
  private clientId = "";
  private roomId: string | null = null;
  private dashboardTab: DashboardTab = "main";
  private nickname = "";
  private lobbyRoomState: LobbyRoomState = lobbyRoomInitialState;
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
    this.loggedIn = this.waitingForServer = false;
    this.clientId = "";
  }

  onLobbyStateUpdate(state: LobbyRoomState) {
    this.lobbyRoomState = state;
  }

  onGameStateUpdate(state: GameRoomState) {
    this.gameRoomState = { ...state };
    this.messages = this.gameRoomState.messages;
  }

  async authenticate(nickname: string) {
    console.log("Logging in as ", nickname);
    this.nickname = nickname;
    this.waitingForServer = true;
    // TODO: error handling
    try {
      this.clientId = await this.serverConnection.login(nickname);
      this.loggedIn = true;
    } catch (error) {
      this.serverError = true;
      console.error(error);
    } finally {
      this.waitingForServer = false;
    }
    if (!this.loggedIn) {
      return;
    }
    if (this.roomId) {
      await this.joinRoom({
        roomId: this.roomId,
      });
    } else {
      this.dashboardTab = "main";
    }
  }

  async joinRoom(data: ClientJoinRoom) {
    this.waitingForServer = true;
    try {
      await this.serverConnection.joinGameRoom(data);
      this.roomId = data.roomId;
    } catch (error) {
      this.serverError = true;
      console.error(error);
    } finally {
      this.waitingForServer = false;
    }
  }

  async createRoom(data: ClientCreateRoom) {
    this.waitingForServer = true;
    try {
      this.roomId = await this.serverConnection.createGameRoom(data);
    } catch (error) {
      this.serverError = true;
      console.error(error);
    } finally {
      this.waitingForServer = false;
    }
  }

  async changeNickname(nickname: string) {
    this.waitingForServer = true;
    try {
      await this.serverConnection.changeNickname(nickname);
      this.nickname = nickname;
    } catch (error) {
      this.serverError = true;
      console.error(error);
    } finally {
      this.waitingForServer = false;
      this.dashboardTab = "main";
    }
  }

  sendMessage(text: string) {
    this.serverConnection.sendMessage(text);
  }
}
</script>
