import * as fossilDelta from "fossil-delta";

import {
  GameRoomStatus,
  ServerChatMessage,
} from "./payloads";

export interface GameRoomState {
  messages: ServerChatMessage[];
}
export const createGameRoomInitialState = (): GameRoomState => ({
  messages: [],
});

export interface LobbyRoomState {
  rooms: {
    [roomId: string]: GameRoomStatus;
  };
  totalPlayers: number;
  totalRooms: number;
}
export const lobbyRoomInitialState: LobbyRoomState = {
  rooms: {},
  totalPlayers: 0,
  totalRooms: 0,
};

export type BinaryPatch = number[];

export const createBinaryPatch = (previous: Buffer, current: Buffer): BinaryPatch =>
  fossilDelta.create(previous, current);

export const applyBinaryPatch = (current: fossilDelta.ByteArray, patch: BinaryPatch): Buffer =>
  Buffer.from(fossilDelta.apply(current, patch));
