// Imports
import atoms from "./states/atoms";
import Core from "./core";

export type Atoms = typeof atoms;

declare namespace Types {
	export type { Atoms };

	export namespace PlayerData {
		type Static = {};
	}

	export namespace Core {
		type API = typeof Core;
	}
}

export default Types;
