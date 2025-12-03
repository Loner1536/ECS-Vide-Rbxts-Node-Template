// Types
import { type SerializeablePayload } from "@rbxts/charm-payload-converter";
import type Types from "@shared/types";

export type ClientToServerEvents = {
	initState(): void;
};

export type ServerToClientEvents = {
	syncState(payload: SerializeablePayload<Types.Atoms>): void;
};
