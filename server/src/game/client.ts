import { Socket } from "socket.io";

export default class Client {
  constructor(
    public socket: Socket,
    private _nickname: string,
  ) {}

  get nickname(): string { return this._nickname; }
}
