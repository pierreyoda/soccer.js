export enum RoomDataType {
  ROOM_DATA = 1,
  ROOM_STATE_FULL = 2,
  ROOM_STATE_PATCH = 3,
}
export type ChatMessageType = "server" | "player";

export interface GameRoomStatus {
  id: string;
  name: string;
  players: number;
  maxPlayers: number;
  hasPassword: boolean;
}

// Communication payloads from the client to the server.

export interface ClientLogin {
  nickname: string;
}

export interface ClientCreateRoom {
  name: string;
  password?: string;
  maxPlayers: number;
  showInList: boolean;
}

export interface ClientJoinRoom {
  roomId: string;
}

export interface ClientChatMessage {
  text: string;
}

// Communication payloads from the server to the client.

export interface ServerLoginAck {
  socketId: string;
}

export interface ServerCreateRoomAck {
  roomId: string;
}

export interface ServerChatMessage {
  type: ChatMessageType;
  playerName?: string;
  text: string;
}
