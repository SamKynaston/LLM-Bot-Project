import Axios from "axios";
import { REST, Routes } from "discord.js";
import FS from "node:fs";
import Path from "node:path";
import type { ExtendedClient } from "../Types/Client.ts";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Commands Folder
const commandsPath = Path.join(__dirname, '../commands');
const commandFolders = FS.readdirSync(commandsPath);

export default class CommandHandler {
    static async execute(client: ExtendedClient) {
        for (const folder of commandFolders) {
            const localCommandsPath = Path.join(commandsPath, folder);
            const commandFiles = FS.readdirSync(localCommandsPath).filter((file) => file.endsWith('.ts'));

            for (const file of commandFiles) {
                const filePath = Path.join(localCommandsPath, file);
                const command = (await import(filePath)).default;

                if (command?.data && command?.execute) {
                    console.log(`STARTED ${command.data.name}`);
                    client._commands.set(command.data.name, command);
                }
            }
        }
    }

    static async deployModelOptions(client: ExtendedClient) {
       const response = await Axios.get("http://127.0.0.1:1234/v1/models");

        if (response) {
            response.data.data.forEach((item: any, i: any) => {
                client._availableModels.push({name : item.id, value: item.id})
            });
        }
    }

    static async deployCommands(client: ExtendedClient) {
        const commands = [];
        
        const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN ?? "");
        await this.deployModelOptions(client)

        for (const folder of commandFolders) {
            const localCommandsPath = Path.join(commandsPath, folder);
            const commandFiles = FS.readdirSync(localCommandsPath).filter(file => file.endsWith(".ts"));
            for (const file of commandFiles) {
                const filePath = Path.join(localCommandsPath, file);
                const command = (await import(filePath)).default;

                if (command?.data && command?.execute) {
                    commands.push(command.data.toJSON());
                }
            }
        }

        try {
            const guilds = await client.guilds.fetch();
            for (const [guildId] of guilds) {
                const data: any = await rest.put(
                    Routes.applicationGuildCommands(process.env.CLIENT_ID ?? "", guildId),
                    { body: commands }
                );
                console.log(`Deployed ${data.length} commands to guild ${guildId}`);
            }
        } catch (error) {
            console.error("Failed to deploy commands:", error);
        }
    }
}