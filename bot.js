const fs = require('node:fs');
const path = require('node:path');
const { Client, Events, GatewayIntentBits, Collection } = require("discord.js");

const client = new Client(({ intents: [GatewayIntentBits.Guilds] }));

// Events Folder
const eventsPath = path.join(__dirname, 'events')
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith(".js"))

// Commands Folder
const commandsPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(commandsPath);

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);

    if (Events[event.name]) {
        if (event.once) {
            client.once(Events[event.name], (...args) => event.execute(...args, client));
        } else {
            client.on(event.name, (...args) => event.execute(...args, client));
        }
    }

    console.log(`Loaded event: ${event.name} from ${file}`);
}

client.commands = new Collection();

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

client.login(process.env.DISCORD_TOKEN);