// Services
import { RunService } from "@rbxts/services";

// Packages
import { fromSerializeablePayload, toSerializeablePayload } from "@rbxts/charm-payload-converter";
import CharmSync, { client, server, type SyncPayload } from "@rbxts/charm-sync";

// Shared
import { ClientEvents, ServerEvents } from "@shared/events";
import atoms from "./atoms";

// Dependencies
import PlayerData from "./playerData";
import Events from "./events";

export default class StateManager {
	private init = {
		server: false,
		client: false,
	};

	public playerData = new PlayerData();
	public events = new Events();

	public Init() {
		if (!RunService.IsRunning()) {
			this.server();
			this.client();
		} else if (RunService.IsServer() && !this.init.server) this.server();
		else if (RunService.IsClient() && !this.init.client) this.client();
	}

	private server() {
		const syncer = server({ atoms, autoSerialize: false });

		syncer.connect((player, payload) => {
			const filteredPayload = this.filterPayload(player, payload);
			if (CharmSync.isNone(filteredPayload)) return;

			ServerEvents.syncState.fire(player, toSerializeablePayload(filteredPayload));
		});

		ServerEvents.initState.connect((player) => {
			syncer.hydrate(player);
		});

		this.init.server = true;
	}
	private client() {
		const syncer = client({ atoms });

		ClientEvents.syncState.connect((payload) => {
			syncer.sync(fromSerializeablePayload(payload));
		});

		ClientEvents.initState.fire();

		this.init.client = true;
	}

	private filterPayload(player: Player, payload: unknown) {
		const data = payload as SyncPayload<typeof atoms>;

		return {
			...data,
			...this.playerData.filterPayload(player, data),
		};
	}
}
