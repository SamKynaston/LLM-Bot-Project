const { REST, Routes } = require("discord.js");
const fs = require('node:fs');
const path = require('node:path');

// Commands Folder
const commandsPath = path.join(__dirname, '../commands');
const commandFolders = fs.readdirSync(commandsPath);

module.exports = {
    execute(client) {
        for (const folder of commandFolders) {
            const localCommandsPath = path.join(commandsPath, folder);
            const commandFiles = fs.readdirSync(localCommandsPath).filter((file) => file.endsWith('.js'));
            for (const file of commandFiles) {
                const filePath = path.join(localCommandsPath, file);
                const command = require(filePath);

                if ('data' in command && 'execute' in command) {
                    console.log(`STARTED ${filePath}`)
                    client.commands.set(command.data.name, command);
                } else {
                    console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
                }
            }
        }
    },

    async deployCommands(client) {
        const commands = [];

        for (const folder of commandFolders) {
            const localCommandsPath = path.join(commandsPath, folder);
            const commandFiles = fs.readdirSync(localCommandsPath).filter(file => file.endsWith(".js"));
            for (const file of commandFiles) {
                const filePath = path.join(localCommandsPath, file);
                const command = require(filePath);
                if ("data" in command && "execute" in command) {
                    commands.push(command.data.toJSON());
                } else {
                    console.warn(`[WARNING] The command at ${filePath} is missing "data" or "execute".`);
                }
            }
        }

        const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

        try {
            const guilds = await client.guilds.fetch();
            for (const [guildId] of guilds) {
                const data = await rest.put(
                    Routes.applicationGuildCommands(process.env.CLIENT_ID, guildId),
                    { body: commands }
                );
                console.log(`✅ Deployed ${data.length} commands to guild ${guildId}`);
            }
        } catch (error) {
            console.error("Failed to deploy commands:", error);
        }
    }
}