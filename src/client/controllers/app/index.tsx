// Services
import { Players, RunService, Workspace } from "@rbxts/services";

// Packages
import { createPortal, createRoot } from "@rbxts/react-roblox";
import AppForge, { MainProps, Render } from "@rbxts/app-forge";
import { Controller, OnInit } from "@flamework/core";
import React, { StrictMode } from "@rbxts/react";

// Controller
import CoreController from "../core";

@Controller({ loadOrder: 1 })
export default class AppController implements OnInit {
	constructor(private core: CoreController) {}

	onInit() {
		const props = this.createProps(Players.LocalPlayer!);
		const forge = new AppForge();

		const root = createRoot(new Instance("Folder"));
		const target = Workspace.CurrentCamera!;

		function RenderApp({ props, forge, target }: MainProps) {
			return (
				<screengui key="App" ZIndexBehavior="Sibling" ResetOnSpawn={false}>
					<Render {...{ props, forge, target }} />
				</screengui>
			);
		}

		root.render(
			createPortal(
				RunService.IsStudio() ? (
					<StrictMode>
						<RenderApp props={props} forge={forge} target={target} />
					</StrictMode>
				) : (
					<RenderApp props={props} forge={forge} target={target} />
				),
				Players.LocalPlayer!.WaitForChild("PlayerGui"),
			),
		);
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
