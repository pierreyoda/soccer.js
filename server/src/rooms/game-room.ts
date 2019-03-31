import { Logger } from "@nestjs/common";
import { Server } from "socket.io";

import { GameRoomState, createGameRoomInitialState } from "../../../core/src/states"; // FIXME:
import Room from "./room";
import { PlayersService } from "../players/players.service";
import PlayerClient from "../players/player";

export interface GameRoomMetadata {
  name: string;
  showInList: boolean;
  password: string | null;
}

/**
 * A GameRoom defines a Soccer.js game session with real-time chat
 * and gameplay between its connected clients.
 */
export default class GameRoom extends Room<GameRoomState, GameRoomMetadata> {
  private static readonly logger = new Logger(GameRoom.name);

  constructor(
    socketServer: Server,
    id: string,
    meta: GameRoomMetadata,
    maxPlayers: number,
  ) {
    super(socketServer, createGameRoomInitialState(), {
      ...meta,
    }, id, maxPlayers);
  }

  get name(): string { return this._metadata.name; }
  get showInList(): boolean { return this._metadata.showInList; }
  get hasPassword(): boolean { return !!this._metadata.password; }

  async messageFromPlayer(player: PlayerClient, message: string) {
    this._state.messages.push({
      type: "player",
      playerName: player.nickname,
      text: message,
    });
  }

  protected messageFromServer(message: string) {
    this._state.messages.push({
      type: "server",
      text: message,
    });
  }

  protected async clientHasJoined(client: PlayerClient): Promise<void> {
    this.messageFromServer(`${client.nickname} has joined.`);
  }
  protected async clientHasLeft(client: PlayerClient): Promise<void> {
    this.messageFromServer(`${client.nickname} has left.`);
  }
  protected async disposeRoom(): Promise<void> {
    // TODO: notify rooms service
  }
}
