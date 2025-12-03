// Packages
import { Networking } from "@flamework/networking";

// Types
import { ClientToServerEvents, ServerToClientEvents } from "./types";

const GlobalEvents = Networking.createEvent<ClientToServerEvents, ServerToClientEvents>();
// const GlobalFunctions = Networking.createFunction<ClientToServerEvents, ServerToClientEvents>();

export const ServerEvents = GlobalEvents.createServer({});
export const ClientEvents = GlobalEvents.createClient({});

// export const ServerFunctions = GlobalFunctions.createServer({});
// export const ClientFunctions = GlobalFunctions.createClient({});
