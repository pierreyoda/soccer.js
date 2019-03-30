import { Server } from "socket.io";
import * as NanoTimer from "nanotimer";
import * as msgpack from "msgpack-lite";
import * as debugLib from 'debug';

// FIXME: yarn workspace import
import { RoomDataType } from "../../../core/src/payloads";
import { createBinaryPatch } from "../../../core/src/states";
import PlayerClient from "../players/player";

/**
 * Time in milliseconds between clients state synchronizations.
 */
const SYNCHRONIZATION_RATE = 1000 / 20;

/**
 * Time in milliseconds between state updates.
 */
const UPDATE_RATE = 1000 / 60;

/**
 * A Room allows sharing a common state in realtime with remote clients.
 *
 * The Room's state is sent fully on first connection, then only patches are sent.
 * All room data is shared in binary (Buffer) with the MessagePack protocol.
 */
export default abstract class Room<State, Metadata> {
  protected debug: debugLib.Debugger;
  protected _clientsCount = 0;

  /** Object fully describing the state of the Room. */
  protected _state: State;

  /** Latest state shared between all clients. */
  private _previousState: State;
  private _previousStateEncoded: Buffer;
  private _updateTimer = new NanoTimer();
  private _synchronizationTimer = new NanoTimer();

  constructor(
    public socketServer: Server | null,
    initialState: State,
    protected _metadata: Metadata,
    private _id: string,
    private _maxClients: number | null,
  ) {
    this.debug = debugLib(`soccerjs:room:${_id}`);

    this._state = { ...initialState };
    this._updateTimer.setInterval(this.synchronizeClients.bind(this), [], `${SYNCHRONIZATION_RATE}m`);

    this._previousState = { ...initialState };
    this._previousStateEncoded = msgpack.encode(this._previousState);
  }

  /**
   * The identifier of the Room, also used by socket.io. Must be unique.
   */
  get id(): string { return this._id; }

  /**
   * The current amount of connected clients.
   */
  get clientsCount(): number { return this._clientsCount; }

  /**
   * The maximum number of concurrent clients (null if no limit).
   */
  get maxClients(): number | null { return this._maxClients; }

  /**
   * Send Room data to a specific client.
   */
  sendToClient<T>(client: PlayerClient, data: T) {
    const binaryData = this.encodeData(data);
    client.socket.emit("room_data", this.id, binaryData);
  }

  /**
   * Broadcast Room data to all connected clients.
   */
  broadcastToClients<T>(data: T) {
    if (!this.socketServer) { return; }
    const binaryData = this.encodeData(data);
    this.socketServer.to(this.id).emit("room_data", this.id, binaryData);
  }

  /**
   * Request for a connected player to join the Room.
   */
  async clientRequestJoin(client: PlayerClient): Promise<boolean> {
    // room capacity check
    if (!!this.maxClients && this._clientsCount + 1 > this.maxClients) {
      return false;
    }
    // leave the previous room and join the new one
    client.socket.leave(client.currentRoomId);
    client.onRoomLeft();
    client.socket.join(this.id);
    client.onRoomJoined(this.id);
    this.debug(`Player "${client.nickname}" has joined`);
    ++this._clientsCount;
    // send the full state to initiate state synchronization
    const data = msgpack.encode([RoomDataType.ROOM_STATE_FULL, this._state]);
    this.sendToClient(client, data);

    await this.clientHasJoined(client);
    return true;
  }

  /**
   * Make a connected player leave the Room.
   */
  async clientLeave(client: PlayerClient) {
    client.socket.leave(this.id);
    if (this._clientsCount > 0) {
      --this._clientsCount;
    }
    await this.clientHasLeft(client);
  }

 /**
  * Clean all resources before destruction.
  */
 async dispose() {
   this._updateTimer.clearInterval();
   this._synchronizationTimer.clearInterval();
   // TODO: disconnect all clients (back to lobby?)
   await this.disposeRoom();
 }

  /** Called whenever a new `PlayerClient` joins. */
  protected abstract async clientHasJoined(client: PlayerClient): Promise<void>;
  /** Called whenever an existing `PlayerClient` leaves. */
  protected abstract async clientHasLeft(client: PlayerClient): Promise<void>;
  /** Called before destroying the Room. */
  protected abstract async disposeRoom(): Promise<void>;

  protected setState(state: State) {
    this._previousState = this._state;
    this._previousStateEncoded = msgpack.encode(this._previousState);
    this._state = state;
  }

  protected synchronizeClients() {
    const stateEncoded = msgpack.encode(this._state);
    if (stateEncoded.equals(this._previousStateEncoded)) { return; }

    const patch = createBinaryPatch(this._previousStateEncoded, stateEncoded);
    this._previousState = this._state;
    this._previousStateEncoded = stateEncoded;

    const data = msgpack.encode([RoomDataType.ROOM_STATE_PATCH, patch]);
    this.broadcastToClients(data);
  }

  /**
   * Encode a payload as a Buffer for transmission.
   */
  private encodeData<T extends any>(data: T): Buffer {
    return Buffer.isBuffer(data)
      ? data
      : msgpack.encode([RoomDataType.ROOM_DATA, data]);
  }
}
