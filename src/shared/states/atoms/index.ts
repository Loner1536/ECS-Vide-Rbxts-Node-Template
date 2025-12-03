// Packages
import { atom } from "@rbxts/charm";

// Types
import type Types from "../../types";

const atoms = {
	players: atom<Map<string, Types.PlayerData.Static>>(new Map()),
};

export default atoms;
