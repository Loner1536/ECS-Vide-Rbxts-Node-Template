// Imports
import type { u32 } from "@rbxts/serio";
import atoms from "./states/atoms";
import Core from "./core";

export type Atoms = typeof atoms;

declare namespace Types {
	export type { Atoms };

	export namespace PlayerData {
		type Static = {
			gems: u32;
		};
	}

	export namespace Core {
		type API = typeof Core;
	}
}

export default Types;
