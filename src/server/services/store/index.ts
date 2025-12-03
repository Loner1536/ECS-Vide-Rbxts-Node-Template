// Services
import { Players, RunService } from "@rbxts/services";

// Packages
import { MockDataStoreService, MockMemoryStoreService, createPlayerStore } from "@rbxts/lyra";
import { Service, OnInit } from "@flamework/core";

// Types
import type Types from "@shared/types";

// Utility
import safePlayerAdded from "@shared/utils/safePlayerAdded";

// Components
import template from "./template";
import schema from "./schema";

// Dependencies
import CoreService from "../core";

@Service({ loadOrder: 2 })
export default class StoreService implements OnInit {
	constructor(private core: CoreService) {}

	private store = createPlayerStore<Types.PlayerData.Static>({
		name: "PlayerData",
		template: template,
		schema: schema,
		dataStoreService: new MockDataStoreService(),
		memoryStoreService: new MockMemoryStoreService(),
		changedCallbacks: [
			(userId, newData, _oldData) => {
				const { S } = this.core;

				S.playerData.update(tostring(userId), (data) => ({
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

				S.playerData.set(tostring(player.UserId), await this.store.get(player));

				Promise.fromEvent(Players.PlayerRemoving, (left) => player === left)
					.then(() => S.playerData.delete(tostring(player.UserId)))
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

	public getPlayerDataStore(player: Player) {
		return this.store.get(player);
	}
}
