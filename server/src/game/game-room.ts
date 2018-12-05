import { GameRoomState, gameRoomInitialState } from "../../../core/src/states"; // FIXME:
import Client from "./client";
import Room from "./room";

export interface GameRoomMetadata {
  name: string;
  showInList: boolean;
  password?: string;
}

/**
 * A GameRoom defines a Soccer.js gaming session with real-time chat
 * and gameplay between its connected clients.
 */
export default class GameRoom extends Room<GameRoomState, GameRoomMetadata> {
  constructor(
    id: string,
    name: string,
    maxClients: number,
    showInList: boolean,
    password?: string,
  ) {
    super({
      ...gameRoomInitialState,
    }, {
      name,
      showInList,
      password,
    }, id, maxClients);
  }

  get name(): string { return this._metadata.name; }
  get showInList(): boolean { return this._metadata.showInList; }
  get hasPassword(): boolean { return !!this._metadata.password; }

  public messageFromPlayer(clientId: string, message: string) {
    const player = this.clients.find(p => p.socket.id === clientId);
    if (!player) {
      throw new Error(`Room ID = "${this.id}": cannot find client with ID = "${clientId}."`);
    }
    this._state.messages.push({
      type: "player",
      playerName: player.nickname,
      text: message,
    });
  }

  protected messageFromServer(message: string) {
    this._state.messages.push({
      type: "server",
      text: message,
    });
  }

  protected async clientHasJoined(client: Client): Promise<void> {
    client.gameRoomId = this.id;
    this.messageFromServer(`${client.nickname} has joined.`);
  }
  protected async clientHasLeft(client: Client): Promise<void> {
    client.gameRoomId = undefined;
    this.messageFromServer(`${client.nickname} has left.`);
  }
  protected async disposeRoom(): Promise<void> {
    // TODO: notify rooms service
  }
}
