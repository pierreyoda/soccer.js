import { Socket } from "socket.io";

import logger from "./logger";

const channels = (io: SocketIO.Server) => {
  io.on("connection", (socket: Socket) => {
    logger.info(`Connection established with client ID = ${socket.id}.`);

    socket.on("disconnect", () => {
      logger.info(`Connection terminated with client ID = ${socket.id}.`);
    });

    socket.on("login", ({ nickname }: { nickname: string }, ack: any) => {
      logger.info(`Player logged in as "${nickname}".`);
      ack();
    });

    socket.emit("chat_message", {
      text: "Welcome to Soccer.js!",
    });
  });
};

export default channels;
