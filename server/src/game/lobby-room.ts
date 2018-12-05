import { LobbyRoomState, lobbyRoomInitialState } from "../../../core/src/states"; // FIXME:
import Client from "./client";
import Room from "./room";
import GameRoom from "./game-room";
import logger from "../logger";

/**
 * The LobbyRoom provides a realtime index of all the current active GameRooms.
 */
export default class LobbyRoom extends Room<LobbyRoomState, {}> {
  constructor() {
    super({ ...lobbyRoomInitialState }, {}, "_lobby", null);
  }

  public playerConnected() {
    ++this._state.totalPlayers;
  }
  public playerDisconnected() {
    --this._state.totalPlayers;
  }

  public roomCreated(room: GameRoom) {
    ++this._state.totalRooms;
    this._state.rooms[room.id] = {
      name: room.name,
      players: room.clients.length,
      maxPlayers: room.maxClients,
      hasPassword: room.hasPassword,
    };
    room.on("client_join", () => {
      ++this._state.rooms[room.id].players;
    });
    room.on("client_leave", () => {
      --this._state.rooms[room.id].players;
    });
    logger.info(`Created room "${room.name}" with ID "${room.id}".`);
  }
  public roomDeleted(room: GameRoom) {
    --this._state.totalRooms;
    delete this._state.rooms[room.id];
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
