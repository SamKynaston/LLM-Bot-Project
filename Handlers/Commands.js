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
    }
}