export type ChatMessageType = "server" | "player";

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
