import type { ExtendedClient } from "../Types/Client.js";
import { Events } from "discord.js";
import FS from "node:fs";
import Path from "node:path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Events Folder
const eventsPath = Path.join(__dirname, '../events')
const eventFiles = FS.readdirSync(eventsPath).filter(file => file.endsWith(".ts"))

export default class EventHandler {
    static async execute(client: ExtendedClient) {
        const validEventNames = Object.values(Events);

        for (const file of eventFiles) {
                const filePath = Path.join(eventsPath, file);
                const event = (await import(filePath)).default;

                if (validEventNames.includes(event.name)) {
                    if (event.once) {
                        client.once(event.name, (...args) => event.execute(...args, client));
                    } else {
                        client.on(event.name, (...args) => event.execute(...args, client));
                    }
                }

                console.log(`STARTED ${event.name} from ${file}`);
            }
        }
}