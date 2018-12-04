import { Socket } from "socket.io";

import {
  ClientLogin,
  ServerLoginAck,
  ClientCreateRoom,
  ServerCreateRoomAck,
  ClientJoinRoom,
} from "../../core/src/payloads"; // FIXME: yarn workspace path?
import logger from "./logger";
import { GameRoom, Client, LobbyRoom } from "./game";
import app from "./app";

const channels = (io: SocketIO.Server) => {
  // TODO: refactor
  const lobby = new LobbyRoom();
  const rooms = app.service("rooms");

  rooms.on("created", (room: GameRoom) => {
    lobby.roomCreated(room);
  });
  rooms.on("removed", (room: GameRoom) => {
    lobby.roomDeleted(room);
  })

  io.on("connection", (socket: Socket) => {
    logger.info(`Connection established with client ID = ${socket.id}.`);
    lobby.playerConnected();
    let player: Client;

    socket.on("disconnect", async () => {
      logger.info(`Connection terminated with client ID = ${socket.id}.`);
      if (player && player.gameRoomId) {
        const room: GameRoom = await rooms.get(player.gameRoomId);
        room.clientLeave(player);
      }
      lobby.playerDisconnected();
    });

    socket.on(
      "login",
      (data: ClientLogin, ack: (data: ServerLoginAck) => void) => {
        logger.info(`Player logged in as "${data.nickname}".`);
        player = new Client(socket, data.nickname);
        if (!lobby.clientRequestJoin(player)) {
          throw new Error("Channel login: join lobby room.")
        }
        ack({
          socketId: socket.id,
        });
      },
    );

    socket.on(
      "room_create",
      async (data: ClientCreateRoom, ack: (data: ServerCreateRoomAck) => void) => {
        if (!player) {
          throw new Error("Channel room_create: not logged in.");
        }
        const room: GameRoom = await rooms.create(data);
        lobby.clientLeave(player);
        if (!room.clientRequestJoin(player)) {
          throw new Error("Channel room_create: cannot join.");
        }
        ack({
          roomId: room.id,
        });
      },
    );

    socket.on(
      "room_join",
      async (data: ClientJoinRoom) => {
        if (!player) {
          throw new Error("Channel room_join: not logged in.");
        }
        const room: GameRoom = await rooms.get(data.roomId);
        lobby.clientLeave(player);
        if (!room.clientRequestJoin(player)) {
          throw new Error("Channel room_join: cannot join.");
        }
      },
    );

    socket.on("chat_message", async (text: string) => {
      if (!player) {
        throw new Error("Channel chat_message: not logged in.");
      }
      if (!player.gameRoomId) {
        throw new Error("Channel chat_message: not in game room.");
      }
      const room: GameRoom = await rooms.get(player.gameRoomId);
      room.messageFromPlayer(player.socket.id, text);
    });
  });
};

export default channels;
