import * as fossilDelta from "fossil-delta";

import {
  GameRoomStatus,
  ServerChatMessage,
} from "./payloads";

export interface GameRoomState {
  messages: ServerChatMessage[];
}

export interface LobbyRoomState {
  list: GameRoomStatus[];
  totalPlayers: number;
  totalRooms: number;
}

export type BinaryPatch = number[];

export const createBinaryPatch = (previous: Buffer, current: Buffer): BinaryPatch =>
  fossilDelta.create(previous, current);

export const applyBinaryPatch = (current: fossilDelta.ByteArray, patch: BinaryPatch): Buffer =>
  Buffer.from(fossilDelta.apply(current, patch));
