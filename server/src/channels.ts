import { Socket } from "socket.io";

import {
  ClientLogin,
  ServerLoginAck,
  ClientCreateRoom,
  ServerCreateRoomAck,
  ClientJoinRoom,
} from "../../core/src/payloads"; // FIXME: yarn workspace path?
import logger from "./logger";
import { GameRoom, Client } from "./game";
import app from "./app";

const channels = (io: SocketIO.Server) => {
  let totalPlayers = 0;

  io.on("connection", (socket: Socket) => {
    logger.info(`Connection established with client ID = ${socket.id}.`);
    ++totalPlayers;
    let player: Client;

    socket.on("disconnect", () => {
      logger.info(`Connection terminated with client ID = ${socket.id}.`);
      --totalPlayers;
    });

    socket.on(
      "login",
      (data: ClientLogin, ack: (data: ServerLoginAck) => void) => {
        logger.info(`Player logged in as "${data.nickname}".`);
        player = new Client(socket, data.nickname);
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
        const room: GameRoom = await app.service("rooms").create(data);
        logger.info(`Created room "${room.name}" with ID "${room.id}".`);
        room.clientRequestJoin(player);
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
        const room: GameRoom = await app.service("rooms").get(data.roomId);
        if (!room.clientRequestJoin(player)) {
          throw new Error("Channel room_join: cannot join.");
        }
      },
    );
  });
};

export default channels;
