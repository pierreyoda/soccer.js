import { Socket } from "socket.io";

import Client from "./client";
export { default as Room } from "./room";

export class Player extends Client {
  constructor(
    socket: Socket,
    protected _name: string,
  ) {
    super(socket);
  }

  get name(): string { return this._name; }
}
