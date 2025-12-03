// Types
import type Types from "@shared/types";

declare global {
	type AppGroups = readonly [];
	type AppNames = readonly [];
	type AppProps = {
		player: Player;

		core: Types.Core.API;
	};
}

export {};
