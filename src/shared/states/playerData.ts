// Services
import { RunService } from "@rbxts/services";

// Packages
import { SyncPayload } from "@rbxts/charm-sync";
import { useAtom } from "@rbxts/react-charm";
import Object from "@rbxts/object-utils";

// Shared
import atoms from "./atoms";

// Types
import type Types from "@shared/types";

export default class PlayerData {
	private state = atoms.players;

	// Helpers
	public filterPayload(
		player: Player,
		payload: SyncPayload<typeof atoms>,
	): SyncPayload<typeof atoms> {
		if (payload.type === "init") {
			return {
				...payload,
				data: {
					...payload.data,
					players: new Map([
						[tostring(player.UserId), payload.data.players.get(tostring(player.UserId))!],
					]),
				},
			};
		}

		return {
			...payload,
			data: {
				...payload.data,
				players: payload.data.players
					? new Map([[tostring(player.UserId), payload.data.players.get(tostring(player.UserId))!]])
					: undefined,
			},
		};
	}

	// Actions
	public getProps(player: Player): Types.PlayerData.Static {
		return {} satisfies Types.PlayerData.Static;
	}
	public getStatic(userId: number): Types.PlayerData.Static {
		const data = this.state().get(tostring(userId));
		if (!data) return {};

		return {} satisfies Types.PlayerData.Static;
	}

	// Core
	public set(player: Player, newData: Types.PlayerData.Static) {
		const id = tostring(player.UserId);

		return this.state((state) => {
			const newState = Object.deepCopy(state);
			newState.set(id, newData);
			return newState;
		});
	}
	public update(
		player: Player,
		updater: (data: Types.PlayerData.Static) => Types.PlayerData.Static,
	) {
		if (RunService.IsClient() && RunService.IsRunning()) {
			return warn("[PlayerData] update should only be called on the server");
		}

		const id = tostring(player.UserId);

		this.state((state) => {
			const newState = Object.deepCopy(state);

			const data = newState.get(id);

			if (!data) return state;

			newState.set(id, updater(data));

			return newState;
		});
	}
	public delete(player: Player) {
		if (RunService.IsClient())
			return warn("[PlayerData] delete should only be called on the server");

		const id = tostring(player.UserId);

		this.state((state) => {
			const newState = Object.deepCopy(state);
			newState.delete(id);
			return newState;
		});
	}
}
