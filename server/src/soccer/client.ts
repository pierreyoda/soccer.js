import { Socket } from "socket.io";

export default class Client {
  constructor(
    protected socket: Socket,
  ) {}
}
