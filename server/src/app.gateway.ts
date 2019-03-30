import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import * as debugLib from 'debug';

import { RoomsService } from './rooms/rooms.service';
import { PlayersService } from './players/players.service';
import { ClientLogin, ClientChangeNickname, ClientCreateRoom, ServerCreateRoomAck, ClientJoinRoom, ServerLoginAck } from '../../core/src/payloads';
import { Logger } from '@nestjs/common';

const debug = debugLib('soccerjs:rooms:gateway');

@WebSocketGateway()
export class RoomsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(RoomsGateway.name);

  @WebSocketServer()
  server!: Server;

  constructor(
    private readonly playersService: PlayersService,
    private readonly roomsService: RoomsService,
  ) {}

  handleConnection(client: Socket) {
    debug(`Connection established with client ID = "${client.id}".`);
  }

  async handleDisconnect(client: Socket) {
    debug(`Connection terminated with client ID = "${client.id}".`);
    const player = await this.playersService.playerDisconnected(client);
    if (player) {
      const room = await this.roomsService.findGameRoomById(player.currentRoomId);
      if (room) {
        await room.clientLeave(player);
      }
    }
    this.roomsService.playerLeftGame();
  }

  @SubscribeMessage("login")
  async handleLogin(client: Socket, data: ClientLogin): Promise<ServerLoginAck | null> {
    const player = await this.playersService.playerConnected(client, data.nickname);
    return await this.roomsService.playerJoinedLobby(this.server, player)
      ? { clientId: client.id }
      : null;
  }

  @SubscribeMessage("change_nickname")
  async handleChangeNickname(client: Socket, data: ClientChangeNickname) {
    await this.playersService.changeNickname(client.id, data.nickname);
  }

  @SubscribeMessage("room_create")
  async handleRoomCreate(client: Socket, data: ClientCreateRoom): Promise<ServerCreateRoomAck | null> {
    const player = await this.playersService.findById(client.id);
    if (!player) {
      this.logger.error(`handleRoomJoin: cannot find player with ID "${client.id}".`);
      return null;
    }
    const room = await this.roomsService.createGameRoom(this.server, data);
    if (!await room.clientRequestJoin(player)) {
      this.logger.error(
        `handleRoomJoin: player with ID "${player.socket.id}" cannot join newly created room "${room.id}".`,
      );
      return null;
    }
    return {
      roomId: room.id,
    };
  }

  @SubscribeMessage("room_join")
  async handleRoomJoin(client: Socket, data: ClientJoinRoom): Promise<boolean> {
    const player = await this.playersService.findById(client.id);
    if (!player) {
      this.logger.error(`handleRoomJoin: cannot find player with ID "${client.id}".`);
      return false;
    }
    const gameRoom = await this.roomsService.findGameRoomById(data.roomId);
    if (!gameRoom) {
      this.logger.error(`handleRoomJoin: cannot find room with ID "${player.currentRoomId}".`);
      return false;
    }
    const success = await gameRoom.clientRequestJoin(player);
    if (success) {
      this.roomsService.playerJoinedGameRoom(gameRoom);
    }
    return success;
  }

  @SubscribeMessage("chat_message")
  async handleChatMessage(client: Socket, message: string) {
    const player = await this.playersService.findById(client.id);
    if (!player) {
      this.logger.error(`handleChatMessage: cannot find player with ID "${client.id}".`);
      return;
    }
    const gameRoom = await this.roomsService.findGameRoomById(player.currentRoomId);
    if (!gameRoom) {
      this.logger.error(`handleChatMessage: cannot find room with ID "${player.currentRoomId}".`);
      return;
    }
    await gameRoom.messageFromPlayer(player, message);
  }
}
