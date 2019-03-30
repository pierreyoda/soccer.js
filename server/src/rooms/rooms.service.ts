import { Injectable, Logger } from "@nestjs/common";
import { Server } from "socket.io";
import * as debugLib from 'debug';

import { ClientCreateRoom } from "../../../core/src/payloads";
import LobbyRoom from "./lobby-room";
import GameRoom from "./game-room";
import PlayerClient from "../players/player";

const debug = debugLib('soccerjs:rooms:service');

@Injectable()
export class RoomsService {
  private readonly logger = new Logger(RoomsService.name);

  // TODO: persistence (redis?)
  private readonly lobby = new LobbyRoom();
  private readonly rooms: {
    [roomId: string]: GameRoom;
  } = {};

  async playerJoinedLobby(socketServer: Server, player: PlayerClient): Promise<boolean> {
    // TODO: find better way to pass the initialized at runtime socket server
    if (!this.lobby.socketServer) {
      this.lobby.socketServer = socketServer;
    }

    debug(`Player "${player.nickname}" (ID "${player.socket.id}") has joined the lobby.`);
    const success = await this.lobby.clientRequestJoin(player);
    if (!success) {
      this.logger.error(`Player with ID "${player.socket.id}" failed to join the lobby.`);
      return false;
    }
    this.lobby.playerConnected();
    return true;
  }

  playerJoinedGameRoom(room: GameRoom) {
    this.lobby.roomUpdated(room);
  }

  playerLeftGame() {
    this.lobby.playerDisconnected();
  }

  async listAllGameRooms(): Promise<GameRoom[]> {
    return Object.values(this.rooms);
  }

  async findGameRoomById(id: string): Promise<GameRoom | null> {
    return this.rooms[id] || null;
  }

  async createGameRoom(socketServer: Server, data: ClientCreateRoom): Promise<GameRoom> {
    const roomId = this.generateGameRoomId();
    const room = new GameRoom(socketServer, roomId, {
      name: data.name,
      showInList: data.showInList,
      password: data.password || null,
    }, data.maxPlayers);
    this.rooms[roomId] = room;
    this.lobby.roomCreated(room);
    return room;
  }

  /**
   * Generate a new unique Game Room ID.
   */
  private generateGameRoomId(): string {
    const randomId = (): string =>
      Math.random()
        .toString(36)
        .substr(2, 9);
    let id = randomId();
    while (!!this.rooms[id]) {
      id = randomId();
    }
    return `game-${id}`;
  }
}
