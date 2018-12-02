import { Player } from ".";
import { ServerChatMessage } from "../../../core/src/payloads";
import logger from "../logger";

export interface RoomState {
  messages: ServerChatMessage[];
}

/**
 * A Room defines a Soccer.js gaming session with real-time chat
 * and gameplay between its connected clients.
 */
export default class Room {
  protected players: Player[] = [];
  protected state: RoomState = {
    messages: [],
  };

  constructor(
    protected _id: string,
    protected _name: string,
    protected _maxClients: number,
    protected _showInList: boolean,
    protected _password?: string,
  ) {}

  get id(): string { return this._id; }
  get name(): string { return this._name; }
  get maxClients(): number { return this._maxClients; }
  get showInList(): boolean { return this._showInList; }
  get hasPassword(): boolean { return !!this._password; }

  public clientRequestJoin(player: Player): boolean {
    if (this.players.length + 1 <= this.maxClients) {
      this.clientHasJoined(player);
      return true;
    }
    return false;
  }

  public messageFromPlayer(clientId: string, message: string) {
    const player = this.players.find(p => p.socket.id === clientId);
    if (!player) {
      throw new Error(`Room ID = "${this.id}": cannot find client with ID = "${clientId}."`);
    }
    this.state.messages.push({
      type: "player",
      playerName: player.name,
      text: message,
    });
  }

  protected clientHasJoined(player: Player) {
    player.socket.leaveAll();
    player.socket.join(`room-${this.id}`);
    this.players.push(player);
    logger.info(`Room "${this.id}": player "${player.name}" has joined`);
    this.messageFromServer(`${player.name} has joined.`)
  }
  protected clientHasLeft() {
    // TODO
  }

  protected messageFromServer(message: string) {
    this.state.messages.push({
      type: "server",
      text: message,
    });
  }

  protected destroy() {}
}
