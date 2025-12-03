// Services
import { Players, RunService } from "@rbxts/services";

// Packages
import { MockDataStoreService, MockMemoryStoreService, createPlayerStore } from "@rbxts/lyra";
import { Service, OnInit, Flamework } from "@flamework/core";

// Types
import type Types from "@shared/types";

// Utility
import safePlayerAdded from "@shared/utils/safePlayerAdded";

// Components
import template from "./template";

// Dependencies
import CoreService from "../core";

// Factories
import PlayerFactory from "@server/factories/player";

@Service({ loadOrder: 2 })
export default class StoreService implements OnInit {
	private Factory: Map<Player, PlayerFactory> = new Map();

	constructor(private core: CoreService) {}

	private store = createPlayerStore<Types.PlayerData.Static>({
		name: "PlayerData",
		template: template,
		schema: Flamework.createGuard<Types.PlayerData.Static>(),
		dataStoreService: new MockDataStoreService(),
		memoryStoreService: new MockMemoryStoreService(),
		changedCallbacks: [
			(userId, newData, _oldData) => {
				const { S } = this.core;

				const mockedPlayer = {
					Name: "Lyra(Changed Callback)" + userId,
					UserId: tonumber(userId),
				} as Partial<Player> as Player;

				S.playerData.update(mockedPlayer, (data) => ({
					...data,
					...newData,
				}));
			},
		],
		logCallback: this.createLogger(),

		// Add migration steps if needed
		/**
		 * Example of how to add Lyra migrations when needed:
		 *
		 * migrationSteps: [
		 *     Lyra.MigrationStep.addFields("addGems", { gems: 0 }),
		 *     Lyra.MigrationStep.transform("renameInventory", (data) => {
		 *         data.items = data.inventory;
		 *         data.inventory = undefined;
		 *         return data;
		 *     }),
		 * ],
		 *
		 * importLegacyData: (key: string) => {
		 *     // Import data from old DataStore if needed
		 *     return undefined; // or legacy data
		 * },
		 */

		// Legacy data import if needed
		// importLegacyData: (key: string) => { /* ... */ },
	});

	onInit(): void {
		const { S } = this.core;

		safePlayerAdded(async (player) => {
			try {
				await this.store.loadAsync(player);

				S.playerData.set(player, await this.store.get(player));

				this.Factory.set(player, new PlayerFactory(player, this));

				Promise.fromEvent(Players.PlayerRemoving, (left) => player === left)
					.then(() => S.playerData.delete(player))
					.then(() => this.store.unloadAsync(player));
			} catch (error) {
				this.handlePlayerDataError(player, error);
			}
		});

		game.BindToClose(() => {
			this.store.closeAsync();
		});
	}

	private handlePlayerDataError(player: Player, err: unknown) {
		const errorMessage = typeIs(err, "string") === true ? err : tostring(err);
		warn(`Failed to load document for player ${player.Name}: ${errorMessage}`);
		player.Kick(`Your data failed to load. Please rejoin the game.\n\nError: ${errorMessage}`);
	}

	private createLogger() {
		if (RunService.IsStudio() === true) {
			return (message: { level: string; message: string; context?: unknown }) => {
				print(`[Lyra][${message.level}] ${message.message}`);
				if (message.context !== undefined) {
					print("Context:", message.context);
				}
			};
		} else {
			return (message: { level: string; message: string; context?: unknown }) => {
				if (message.level === "error" || message.level === "fatal") {
					warn(`[Lyra] ${message.message}`);
				}
			};
		}
	}

	public getFactory(player: Player) {
		return this.Factory.get(player);
	}
	public getStore() {
		return this.store;
	}
}
