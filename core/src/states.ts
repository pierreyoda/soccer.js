import * as fossilDelta from "fossil-delta";

import { ServerChatMessage } from "./payloads";

export interface GameRoomState {
  messages: ServerChatMessage[];
}

export type BinaryPatch = number[];

export const createBinaryPatch = (previous: Buffer, current: Buffer): BinaryPatch =>
  fossilDelta.create(previous, current);

export const applyBinaryPatch = (current: fossilDelta.ByteArray, patch: BinaryPatch): Buffer =>
  Buffer.from(fossilDelta.apply(current, patch));
