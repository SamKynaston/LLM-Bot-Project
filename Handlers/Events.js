const { Events } = require("discord.js");

const fs = require('node:fs');
const path = require('node:path');

// Events Folder
const eventsPath = path.join(__dirname, '../events')
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith(".js"))

module.exports = {
    execute(client) {
        const validEventNames = Object.values(Events);

        for (const file of eventFiles) {
                const filePath = path.join(eventsPath, file);
                const event = require(filePath);

                if (validEventNames.includes(event.name)) {
                    if (event.once) {
                        client.once(event.name, (...args) => event.execute(...args, client));
                    } else {
                        client.on(event.name, (...args) => event.execute(...args, client));
                    }
                }

                console.log(`Loaded event: ${event.name} from ${file}`);
            }
        }
}