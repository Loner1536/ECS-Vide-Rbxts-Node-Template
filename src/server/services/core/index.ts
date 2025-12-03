// Packages
import { Service, OnInit, OnStart } from "@flamework/core";

// Types
import type Types from "@shared/types";

// Shared
import Core from "@shared/core";

// Decorators
import { initializeLogic, logicServer, logicShared } from "@shared/decorators/system";

@Service()
export default class CoreService implements OnInit, OnStart, Types.Core.API {
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
	}

	onStart() {
		for (const entry of [...logicServer, ...logicShared]) {
			try {
				initializeLogic(entry);
			} catch (err) {
				warn("[LogicBootstrapper] initializeLogic error:", err);
			}
		}
	}
}
