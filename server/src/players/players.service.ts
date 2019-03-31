import { Injectable, Logger } from "@nestjs/common";
import { Socket } from "socket.io";
import * as debugLib from 'debug';

import PlayerClient from "./player";

const debug = debugLib("soccerjs:players:service");

@Injectable()
export class PlayersService {
  private readonly logger = new Logger(PlayersService.name);

  // TODO: persistence (redis?)
  private readonly connectedPlayers: {
    [clientId: string]: PlayerClient;
  } = {};

  async playerConnected(socket: Socket, nickname: string): Promise<PlayerClient> {
    debug(`Player with ID "${socket.id}" logged in as "${nickname}".`);
    const player = new PlayerClient(socket, nickname, null);
    this.connectedPlayers[socket.id] = player;
    return player;
  }

  async playerDisconnected(socket: Socket): Promise<PlayerClient | null> {
    const player = await this.findById(socket.id);
    if (!player) {
      this.logger.warn(`Unregistered client with ID "${socket.id}" disconnected`);
      return null;
    }
    delete this.connectedPlayers[socket.id];
    return player;
  }

  async findById(clientId: string): Promise<PlayerClient | null> {
    const player = this.connectedPlayers[clientId];
    return player || null;
  }

  async changeNickname(clientId: string, newNickname: string) {
    if (!newNickname || !newNickname.trim()) {
      // TODO: throw exception?
      this.logger.error(`Cannot change nickname to empty string.`);
      return;
    }
    const player = await this.findById(clientId);
    if (!player) {
      this.logger.error(`Cannot change nickname for unknown player ID "${clientId}".`);
      return;
    }
    debug(`Player with ID "${clientId}" changed nickname from "${player.nickname}" to "${newNickname}".`);
    player.nickname = newNickname;
  }
}
