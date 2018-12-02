import Client from "./client";

export interface PlayerMessage {
  clientId: string;
  text: string;
}

export interface RoomState {
  messages: PlayerMessage[];
}

/**
 * A Room defines a Soccer.js gaming session with real-time chat
 * and gameplay between its connected clients.
 */
export default class Room {
  protected clients: Client[] = [];
  protected latestState: RoomState = {
    messages: [],
  };

  constructor(
    protected name: string,
    protected maxClients: number,
  ) {}

  public clientRequestJoin(client: Client): boolean {
    return true;
  }
  protected clientHasJoined(client: Client) {}
  protected clientHasLeft() {}

  protected init() {}
  protected destroy() {}
}
