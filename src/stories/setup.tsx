// Packages
import AppForge, { Render, type NameProps } from "@rbxts/app-forge";
import React, { useMemo } from "@rbxts/react";
import { Flamework } from "@flamework/core";

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
	callback: (props: AppProps, Forge: AppForge) => void;
	storyProps: T;
} & NameProps;

export default function Setup<T extends InferProps<{}>>(setupProps: SetupProps<T>) {
	const { names, name, callback, storyProps } = setupProps;

	const coreController = useMemo(() => new CoreController(), []);
	const appController = useMemo(() => new AppController(coreController), []);

	const props = appController.createProps(mockedPlayer);
	const target = storyProps.target;

	const { S } = coreController;

	S.playerData.set(mockedPlayer, playerDataTemplate);

	const forge = new AppForge();

	task.defer(() => callback(props, forge));

	const appNames = name ? name : names;

	const mainProps = { props, forge, target, appNames };

	return <Render {...mainProps} />;
}
