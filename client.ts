import { Client, GatewayIntentBits, Collection } from "discord.js";
import personalities from "./Data/personalities.json" with { type: "json" };
import type { ExtendedClient } from "./Types/Client.js";

const client: ExtendedClient = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages
    ]
}) as ExtendedClient;

client.commands = new Collection();
client._availableModels = [];
client._availablePersonalities = [];

Object.keys(personalities).forEach(key => {
    client._availablePersonalities.push({
        name: key, 
        value: key
    });
});

export default client;