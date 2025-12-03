// Packages
import { type Entity, Name } from "@rbxts/jecs";
import { Shared } from "@rbxts/replecs";

// Types
import Types from "@shared/types";

class BaseComponents {
	constructor(private sim: Types.Core.API) {}

	protected defineComponent<T>(name: string): Entity<T> {
		const id = this.sim.W.component<T>();

		this.sim.W.set(id, Name, name);
		this.sim.W.add(id, Shared);

		return id;
	}

	protected defineTag(name: string) {
		const tag = this.sim.W.entity();
		this.sim.W.set(tag, Name, name);
		this.sim.W.add(tag, Shared);
		return tag;
	}
}

class Tags extends BaseComponents {
	public System = this.defineTag("System");

	public Player = this.defineTag("Player");
	public Host = this.defineTag("Host");
}
class Player extends BaseComponents {}

class Int extends BaseComponents {
	public Speed = this.defineComponent<number>("Speed");
}

export default class Components {
	public readonly Tags: Tags;
	public readonly Player: Player;

	public readonly Int: Int;

	constructor(sim: Types.Core.API) {
		this.Tags = new Tags(sim);
		this.Player = new Player(sim);

		this.Int = new Int(sim);
	}
}
