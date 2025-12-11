// Packages
import { CreateVideForge, RenderVide, type NameProps } from "@rbxts/app-forge";
import { Flamework } from "@flamework/core";
import Vide from "@rbxts/vide";

// Types
import type { InferProps } from "@rbxts/ui-labs";

// Controllers
import CoreController from "@client/controllers/core";
import AppController from "@client/controllers/app";

// Components
import playerDataTemplate from "./template";

const mockedPlayer = {
	Name: "UI-Labs",
	UserId: 123456,
} as const satisfies Partial<Player> as Player;

// IMPORTANT: Ensures all decorators under @shared/apps are registered
Flamework.addPaths("src/shared/apps");

type SetupProps<T extends InferProps<{}>> = {
	callback: (props: AppProps, Forge: CreateVideForge) => void;
	storyProps: T;
} & NameProps;

export default function Setup<T extends InferProps<{}>>(setupProps: SetupProps<T>) {
	const { names, name, callback, storyProps } = setupProps;

	const coreController = new CoreController();
	const appController = new AppController(coreController);

	const props = appController.createProps(mockedPlayer);
	const target = storyProps.target;

	const { S } = coreController;

	S.playerData.set(mockedPlayer, playerDataTemplate);

	const forge = new CreateVideForge();

	task.defer(() => callback(props, forge));

	const appNames = name ? name : names;

	const mainProps = { props, forge, target, appNames };

	return <RenderVide {...mainProps} />;
}
