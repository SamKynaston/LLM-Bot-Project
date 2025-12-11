import { Client, GatewayIntentBits, Collection } from "discord.js";

export interface ExtendedClient extends Client {
    _commands: Collection<string, any>;
    _availableModels: { name: string; value: string }[];
    _availablePersonalities: { name: string; value: string }[];
}