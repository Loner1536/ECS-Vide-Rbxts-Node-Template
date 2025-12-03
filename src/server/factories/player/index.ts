// Dependencies
import StoreService from "@server/services/store";

export default class PlayerFactory {
	constructor(
		public player: Player,
		public store: StoreService,
	) {}
}
