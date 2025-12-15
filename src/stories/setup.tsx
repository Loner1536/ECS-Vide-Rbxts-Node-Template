// Packages
import { CreateVideForge, VideRenderProps, type VideProps } from "@rbxts/app-forge";
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
} & VideRenderProps;

function buildRender({
	name,
	names,
	group,
}: Pick<VideRenderProps, "name" | "names" | "group">): VideRenderProps | undefined {
	if (group) {
		if (name) return { name, group };
		if (names) return { names, group };
		return { group };
	}

	if (name) return { name };
	if (names) return { names };

	return undefined;
}

export default function Setup<T extends InferProps<{}>>(setupProps: SetupProps<T>) {
	const { callback, storyProps, name, names, group } = setupProps;

	const coreController = new CoreController();
	const appController = new AppController(coreController);

	const props = appController.createProps(mockedPlayer);

	const { S } = coreController;

	S.playerData.set(mockedPlayer, playerDataTemplate);

	const forge = new CreateVideForge();

	callback(props, forge);

	const config: VideProps["config"] = {
		px: {
			target: storyProps.target,
		},
	};

	const defProps: VideProps = { props, forge, config };
	const render = buildRender({ name, names, group });

	const mainProps: VideProps = { ...defProps, render };
	return forge.story(mainProps);
}
