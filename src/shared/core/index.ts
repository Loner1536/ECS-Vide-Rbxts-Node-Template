// Packages
import { Plugin } from "@rbxts/planck-runservice";
import { Scheduler } from "@rbxts/planck";
import { world } from "@rbxts/jecs";

// Components
import Components from "./components";

// Shared
import StateManager from "@shared/states";
import JabbyProfiler from "./jabby";

class Core {
	public W = world();
	public S = new StateManager();
	public C = new Components(this);

	public Scheduler: Scheduler<[this]>;
	public JabbyProfiler = new JabbyProfiler();

	constructor() {
		this.Scheduler = new Scheduler(this);
		this.Scheduler.addPlugin(new Plugin());
		this.JabbyProfiler.Init("Gameplay");
	}
}

const singleton = new Core();

export default singleton;
