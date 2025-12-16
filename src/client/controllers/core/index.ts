// Services
import { ContextActionService } from "@rbxts/services";

// Packages
import { Controller, OnInit, OnStart } from "@flamework/core";
import jabby from "@rbxts/jabby";

// Types
import type Types from "@shared/types";

// Shared
import Core from "@shared/core";

// Decorators
import { initializeLogic, logicClient, logicShared } from "@shared/decorators/system";

@Controller()
export default class CoreController implements OnInit, OnStart, Types.Core.API {
	public W;
	public S;
	public C;

	public Scheduler;
	public JabbyProfiler;

	constructor() {
		this.W = Core.W;
		this.S = Core.S;
		this.C = Core.C;

		this.Scheduler = Core.Scheduler;
		this.JabbyProfiler = Core.JabbyProfiler;
	}

	onInit() {
		this.S.Init();

		const client = jabby.obtain_client();

		function createWidget(_: string, state: Enum.UserInputState) {
			if (state !== Enum.UserInputState.Begin) return;
			client.spawn_app(client.apps.home);
		}
		ContextActionService.BindAction("Open Jabby Home", createWidget, false, Enum.KeyCode.F3);
	}

	onStart() {
		for (const entry of [...logicClient, ...logicShared]) {
			try {
				initializeLogic(entry);
			} catch (err) {
				warn("[LogicBootstrapper] initializeLogic error:", err);
			}
		}
	}
}
