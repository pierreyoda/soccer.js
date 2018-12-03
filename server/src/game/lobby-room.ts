import { LobbyRoomState } from "../../../core/src/states"; // FIXME:
import Client from "./client";
import Room from "./room";
import GameRoom from "./game-room";
import logger from "../logger";

/**
 * The LobbyRoom provides a realtime index of all the current active GameRooms.
 */
export default class LobbyRoom extends Room<LobbyRoomState, {}> {
  constructor() {
    super({
      list: [],
      totalPlayers: 0,
      totalRooms: 0,
    }, {}, "_lobby", null);
  }

  public playerConnected() {
    ++this._state.totalPlayers;
  }
  public playerDisconnected() {
    --this._state.totalPlayers;
  }

  public roomCreated(room: GameRoom) {
    // TODO: update index
    ++this._state.totalRooms;
    logger.info(`Created room "${room.name}" with ID "${room.id}".`);
  }
  public roomDeleted(room: GameRoom) {
    // TODO: update index
    --this._state.totalRooms;
    logger.info(`Deleted room "${room.name}" with ID "${room.id}".`);
  }

  protected async clientHasJoined(client: Client): Promise<void> {
    logger.info(`Player ${client.nickname} has joined the lobby.`);
  }
  protected async clientHasLeft(client: Client): Promise<void> {
    logger.info(`Player ${client.nickname} has left the lobby.`);
  }
  protected async disposeRoom(): Promise<void> {
    // TODO
  }
}
