import io from "socket.io-client";
import feathers from "@feathersjs/feathers";
import socketio from "@feathersjs/socketio-client";
import * as msgpack from "msgpack-lite";

import {
  RoomDataType,
  ClientCreateRoom,
  ServerCreateRoomAck,
  ClientLogin,
  ClientJoinRoom,
  ServerLoginAck,
  ClientChangeNickname,
} from "../../../core/src/payloads";
import {
  LobbyRoomState,
  lobbyRoomInitialState,
  GameRoomState,
  applyBinaryPatch,
  createGameRoomInitialState,
} from "../../../core/src/states";

const socket = io("http://localhost:3030", {
  transports: ["websocket"],
  forceNew: true,
});

const client = feathers();
client.configure(socketio(socket));

export type OnServerDisconnection = () => void;
export type OnRoomStateChanged<State> = (state: State) => void;

export class ClientServerConnection {
  private readonly defaultTimeOut = 5000; // in ms
  private _clientRooms: {
    [roomId: string]: RoomClient<any>,
  } = {};

  constructor(
    onDisconnect: OnServerDisconnection,
    onLobbyRoomStateChanged: OnRoomStateChanged<LobbyRoomState>,
    onGameRoomStateChanged: OnRoomStateChanged<GameRoomState>,
  ) {
    this._clientRooms._lobby = new RoomClient<LobbyRoomState>({
      ...lobbyRoomInitialState,
    });

    socket.on("disconnect", () => onDisconnect());

    socket.on("room_data", (roomId: string, binaryData: Buffer) => {
      const clientRoom = this._clientRooms[roomId];
      if (!clientRoom) {
        console.error(`Unregistered room client "${roomId}"`,
          Object.keys(this._clientRooms));
        return;
      }
      const data = msgpack.decode(new Uint8Array(binaryData));
      const type = data[0] as RoomDataType;
      switch (type) {
        case RoomDataType.ROOM_STATE_FULL:
          clientRoom.state = data[1];
          break;
        case RoomDataType.ROOM_STATE_PATCH:
          clientRoom.patchState(data[1]);
          break;
      }
      if (roomId === "_lobby") {
        onLobbyRoomStateChanged(clientRoom.state);
      } else {
        onGameRoomStateChanged(clientRoom.state);
      }
    });
  }

  public async login(nickname: string): Promise<string> {
    const connection = new Promise<string>((resolve) => {
      const payload: ClientLogin = {
        nickname,
      };
      socket.emit("login", payload,
        (ackData: ServerLoginAck) => resolve(ackData.clientId),
      );
    });
    return Promise.race([
      connection,
      this.serverTimeOut<string>(this.defaultTimeOut, "Server timed out on login."),
    ]);
  }

  public async changeNickname(nickname: string): Promise<void> {
    const update = new Promise<void>((resolve) => {
      const payload: ClientChangeNickname = {
        nickname,
      };
      socket.emit("change_nickname", payload, () => resolve());
    });
    return Promise.race([
      update,
      this.serverTimeOut<void>(this.defaultTimeOut, "Server timed out on nickname change."),
    ]);
  }

  public async joinGameRoom(data: ClientJoinRoom): Promise<void> {
    const join = new Promise<void>((resolve) => {
      socket.emit("room_join", data, () => {
        this._clientRooms[data.roomId] = new RoomClient<GameRoomState>(
          createGameRoomInitialState(),
        );
        resolve();
      });
    });
    return Promise.race([
      join,
      this.serverTimeOut<void>(this.defaultTimeOut, "Server timed out on room join."),
    ]);
  }

  public async createGameRoom(data: ClientCreateRoom): Promise<string> {
    const creation = new Promise<string>((resolve) => {
      socket.emit("room_create", data, (ackData: ServerCreateRoomAck) => {
        this._clientRooms[ackData.roomId] = new RoomClient<GameRoomState>(
          createGameRoomInitialState(),
        );
        resolve(ackData.roomId);
      });
    });
    return Promise.race([
      creation,
      this.serverTimeOut<string>(this.defaultTimeOut, "Server timed out on room creation."),
    ]);
  }

  public sendMessage(text: string) {
    socket.emit("chat_message", text);
  }

  private serverTimeOut<T>(ms: number, message: string): Promise<T> {
    return new Promise<T>((_, reject) => setTimeout(() => reject(message), ms));
  }
}

export class RoomClient<State> {
  protected _state: State;
  protected _stateEncoded = new Uint8Array();

  constructor(
    initialState: State,
  ) {
    this._state = initialState;
  }

  get state(): State { return this._state; }
  set state(state: State) {
    this._state = state;
    this._stateEncoded = msgpack.encode(this._state);
  }

  public patchState(patch: number[]) {
    this._stateEncoded = applyBinaryPatch(this._stateEncoded, patch);
    this._state = msgpack.decode(this._stateEncoded);
  }
}
