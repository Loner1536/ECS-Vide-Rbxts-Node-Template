// Services
import { Players, RunService } from "@rbxts/services";

// Packages
import { Modding, Reflect } from "@flamework/core";

// Types
import type Types from "@shared/types";

// Shared
import Core from "@shared/core";

// Utility
import safePlayerAdded from "@shared/utils/safePlayerAdded";

const { W, C, Scheduler, JabbyProfiler } = Core;

type Config = {
	loadOrder?: number;
};

type PendingLogic = {
	object: LogicCore;
	cfg?: Config;
};

export const logicServer: PendingLogic[] = [];
export const logicClient: PendingLogic[] = [];
export const logicShared: PendingLogic[] = [];

export function initializeLogic(sys: PendingLogic) {
	const obj = sys.object;

	if ("onStart" in obj) {
		obj.onStart!(Core);
	}

	if ("onTick" in obj) {
		const id = `${obj.jabby?.category ?? "Unknown"}`;

		Scheduler.addSystem(() => {
			for (const [system] of W.query().with(C.Tags.System)) {
				const gameSpeed = W.get(system, C.Int.Speed) ?? 1;
				const dt = Scheduler.getDeltaTime() * math.clamp(gameSpeed, 0, 3);

				JabbyProfiler.Run(JabbyProfiler.EnsureSystem(`${obj.jabby.id}`, id), () =>
					obj.onTick!(Core, dt),
				);
			}
		});
	}

	if ("onPlayerAdded" in obj) {
		safePlayerAdded((player) => obj.onPlayerAdded!(player, Core));
	}
	if ("onPlayerRemoving" in obj) {
		Players.PlayerRemoving.Connect((player) => obj.onPlayerRemoving!(player, Core));
	}
}

export const Config = {
	debug: false satisfies boolean,
};

export const System = Modding.createDecorator<[Config?]>("Class", (descriptor, [cfg]) => {
	Reflect.defineMetadata(descriptor.object, "flamework:singleton", true);

	Modding.onListenerAdded((obj) => {
		if (obj instanceof descriptor.object) {
			const entry: PendingLogic = {
				object: obj as LogicCore,
				cfg,
			};

			if (RunService.IsServer()) logicServer.push(entry);
			else logicClient.push(entry);

			if (logicServer.find((v) => v.object === obj) && logicClient.find((v) => v.object === obj))
				logicShared.push(entry);
		}
	});
});

export type OnTick = {
	jabby: { id: string; category: string };

	onTick(core: Types.Core.API, dt: number): void;
};

export type OnStart = {
	onStart(core: Types.Core.API): void;
};

export type OnPlayer = {
	onPlayerAdded?(player: Player, core: Types.Core.API): void;
	onPlayerRemoving?(player: Player, core: Types.Core.API): void;
};

type LogicCore = OnTick & OnStart & OnPlayer;
