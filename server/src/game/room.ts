import { EventEmitter } from "events";
import * as NanoTimer from "nanotimer";
import * as msgpack from "msgpack-lite";

// FIXME: yarn workspace import
import { RoomDataType } from "../../../core/src/payloads";
import { createBinaryPatch } from "../../../core/src/states";
import Client from "./client";
import logger from "../logger";

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
export default abstract class Room<State, Metadata> extends EventEmitter {
  public clients: Client[] = [];
  protected _state: State;

  /** Latest state shared between all clients. */
  private _previousState: State;
  private _previousStateEncoded: Buffer;
  private _updateTimer = new NanoTimer();
  private _synchronizationTimer = new NanoTimer();

  constructor(
    initialState: State,
    protected _metadata: Metadata,
    private _id: string,
    private _maxClients: number | null,
  ) {
    super();
    this._state = initialState;
    this._updateTimer.setInterval(this.synchronizeClients.bind(this), [], `${SYNCHRONIZATION_RATE}m`);

    this._previousState = initialState;
    this._previousStateEncoded = msgpack.encode(this._previousState);
  }

  /**
   * The identifier of the Room, used by socket.io. Must be unique.
   */
  get id(): string { return this._id; }

  /**
   * The maximum number of clients (null if no limit).
   */
  get maxClients(): number | null { return this._maxClients; }

  public sendToClient(client: Client, data: any) {
    const binaryData = this.encodeData(data);
    client.socket.emit("room_data", this.id, binaryData);
  }

  public broadcastToClients(data: any) {
    if (this.clients.length === 0) { return; }
    const binaryData = this.encodeData(data);
    this.clients[0].socket.nsp.to(this.id).emit("room_data", this.id, binaryData);
  }

  public async clientRequestJoin(client: Client): Promise<boolean> {
    if (!!this.maxClients && this.clients.length + 1 > this.maxClients) {
      return false;
    }

    client.socket.join(this.id);
    this.clients.push(client);
    logger.info(`Room "${this.id}": player "${client.nickname}" has joined`);
    await this.clientHasJoined(client);
    this.emit("client_join");

    const data = msgpack.encode([RoomDataType.ROOM_STATE_FULL, this._state]);
    this.sendToClient(client, data);

    return true;
  }

  public async clientLeave(client: Client): Promise<void> {
    if (client.socket.connected) {
      client.socket.leave(this.id);
    }
    await this.clientHasLeft(client);
    this.emit("client_leave");
  }

  protected abstract async clientHasJoined(client: Client): Promise<void>;
  protected abstract async clientHasLeft(client: Client): Promise<void>;
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

  private encodeData(data: any): Buffer {
    return Buffer.isBuffer(data)
      ? data
      : msgpack.encode([RoomDataType.ROOM_DATA, data]);
  }

  private async dispose() {
    this._updateTimer.clearInterval();
    this._synchronizationTimer.clearInterval();
    // TODO: disconnect all clients
    await this.disposeRoom();
  }
}
