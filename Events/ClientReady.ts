import { Events, Client } from "discord.js";
import type { ExtendedClient } from "../Types/Client.js";

export default {
    name: Events.ClientReady,
    once: true,
    execute(client: ExtendedClient) {
        console.log(`Logged in as ${client.user?.tag}!`);
    },
};