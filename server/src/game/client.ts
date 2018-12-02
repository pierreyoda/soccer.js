import { Socket } from "socket.io";

export default class Client {
  constructor(
    public socket: Socket,
  ) {}
}
