import { Socket } from "socket.io";

export default class Client {
  constructor(
    public socket: Socket,
    private _nickname: string,
    /** ID of the player's current game room. Undefined if in lobby. */
    public gameRoomId?: string,
  ) {}

  get nickname(): string { return this._nickname; }
  set nickname(value: string) { this._nickname = value; }
}
