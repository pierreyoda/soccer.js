import { Socket } from "socket.io";

import LobbyRoom from "../rooms/lobby-room";

export default class PlayerClient {
  constructor(
    public readonly socket: Socket,
    public nickname: string,
    /** ID of the player's current game room, or null if in lobby. */
    private gameRoomId: string | null,
  ) {}

  onRoomJoined(roomId: string) {
    this.gameRoomId = roomId === LobbyRoom.ROOM_ID
      ? null
      : roomId;
  }
  onRoomLeft() {
    this.gameRoomId = null;
  }

  get currentRoomId(): string {
    return this.gameRoomId || LobbyRoom.ROOM_ID;
  }
}
