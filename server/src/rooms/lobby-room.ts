import { Logger } from "@nestjs/common";

import Room from "./room";
import { LobbyRoomState, lobbyRoomInitialState } from "../../../core/src/states"; // FIXME:
import GameRoom from "./game-room";
import PlayerClient from "../players/player";

/**
 * The LobbyRoom provides a realtime index of all the current active GameRooms.
 */
export default class LobbyRoom extends Room<LobbyRoomState, {}> {
  static readonly ROOM_ID = "_lobby";
  private readonly logger = new Logger(LobbyRoom.name);

  constructor() {
    super(null, { ...lobbyRoomInitialState }, {}, LobbyRoom.ROOM_ID, null);
  }

  playerConnected() {
    ++this._state.totalPlayers;
  }
  playerDisconnected() {
    --this._state.totalPlayers;
  }

  roomCreated(room: GameRoom) {
    ++this._state.totalRooms;
    this._state.rooms[room.id] = {
      name: room.name,
      players: room.clientsCount,
      maxPlayers: room.maxClients,
      hasPassword: room.hasPassword,
    };
    this.debug.log(`Created room "${room.name}" with ID "${room.id}".`);
  }
  roomUpdated(room: GameRoom) {
    this._state.rooms[room.id] = {
      name: room.name,
      players: room.clientsCount,
      maxPlayers: room.maxClients,
      hasPassword: room.hasPassword,
    };
  }
  roomDeleted(room: GameRoom) {
    --this._state.totalRooms;
    delete this._state.rooms[room.id];
    this.debug.log(`Deleted room "${room.name}" with ID "${room.id}".`);
  }

  protected async clientHasJoined(player: PlayerClient): Promise<void> {
    this.debug(`Player "${player.nickname}" has joined the lobby.`);
  }
  protected async clientHasLeft(player: PlayerClient): Promise<void> {
    this.debug(`Player "${player.nickname}" has left the lobby.`);
  }
  protected async disposeRoom(): Promise<void> {
    // TODO: handle gracefully
  }
}
