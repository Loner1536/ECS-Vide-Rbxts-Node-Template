// Services
import { Players } from "@rbxts/services";

// Packages
import { CreateVideForge, RenderVide } from "@rbxts/app-forge";
import { Controller, OnInit } from "@flamework/core";
import Vide, { mount } from "@rbxts/vide";

// Controller
import CoreController from "../core";

@Controller({ loadOrder: 1 })
export default class AppController implements OnInit {
	constructor(private core: CoreController) {}

	onInit() {
		const props = this.createProps(Players.LocalPlayer!);
		const forge = new CreateVideForge();

		const target = Players.LocalPlayer.WaitForChild("PlayerGui");

		mount(() => {
			return (
				<screengui Name={"App"} ZIndexBehavior="Sibling" ResetOnSpawn={false}>
					<RenderVide {...{ props, forge }} />
				</screengui>
			);
		}, target);
	}

	public createProps(player: Player) {
		const local_player = Players.LocalPlayer ?? player;

		if (!player) error("No LocalPlayer nor MockedPlayer found for AppController props");

		return {
			player: local_player,

			core: this.core,
		} as const satisfies AppProps;
	}
}
