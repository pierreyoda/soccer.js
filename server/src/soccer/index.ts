import { Socket } from "socket.io";

import Client from "./client";
export { default as Room } from "./room";

export class Player extends Client {
  constructor(
    protected socket: Socket,
    protected name: string,
  ) {
    super(socket);
  }
}
