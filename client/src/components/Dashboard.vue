<template>
  <div class="w-full max-w-5xl mx-auto dashboard-card px-16">
    <div class="flex flex-col md:flex-row items-center md:justify-between mb-4">
      <h2 class="title">Lobby</h2>
      <span class="text-white text-sm">
        {{ playersInGame }} players in {{ rooms.length }} rooms
        &nbsp;-&nbsp;
        {{ playersInLobby }} in lobby
      </span>
    </div>
    <div class="flex justify-between mb-4">
      <button class="btn primary" @click="joinRoom(selectedRoomId)"
        :disabled="!selectedRoomId">
        Join Room
      </button>
      <button class="btn primary" @click="$emit('create-room')">
        Create Room
      </button>
      <button class="btn" @click="$emit('change-nickname')">
        Change Nickname
      </button>
    </div>
    <rooms-list :rooms="rooms" :selected-room-id="selectedRoomId"
      @select-room="(id) => selectedRoomId = id"
      @join-room="(id) => joinRoom(id)">
    </rooms-list>
  </div>
</template>

<script lang="ts">
/**
 * Output events:
 * - create-room()
 *   go to the room creation form
 * - join-room(roomId: ClientJoinRoom)
 *   join an existing room
 * - change-nickname()
 *   go to the choose player nickname form
 */
import { Component, Prop, Watch, Vue } from "vue-property-decorator";

import RoomsList from "./RoomsList.vue";
import { GameRoomStatus, ClientJoinRoom } from "../../../core/src/payloads";
import { LobbyRoomState } from "../../../core/src/states";

@Component({
  components: {
    RoomsList,
  },
})
export default class Dashboard extends Vue {
  @Prop() private lobbyState!: LobbyRoomState;
  private rooms: [string, GameRoomStatus][] = [];
  private selectedRoomId: string | null = null;
  private playersInGame = 0;
  private playersInLobby = 0;

  @Watch('lobbyState', { immediate: true })
  onLobbyStateChanged(state: LobbyRoomState) {
    this.rooms = Object.entries(state.rooms);
    // test
    // for (let i = 0; i < 50; i++) {
    //   this.rooms.push(['roomtest_' + i, {
    //     players: Math.ceil(Math.random() * 10),
    //     maxPlayers: Math.ceil(Math.random() * 10 + 10),
    //     hasPassword: Math.random() < 0.5 ? true : false,
    //     name: 'room test room test ' + i,
    //   }]);
    // }
    this.playersInGame = this.rooms.reduce(
      (sum, [_, roomStatus]) => sum + roomStatus.players,
      0,
    );
    this.playersInLobby = state.totalPlayers - this.playersInGame;
  }

  joinRoom(roomId: string) {
    const data: ClientJoinRoom = {
      roomId,
    };
    this.$emit('join-room', data);
  }
}
</script>
