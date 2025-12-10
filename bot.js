const client = require("./client");
const eventHandler = require("./Handlers/Events")
const commandHandler = require("./Handlers/Commands")

commandHandler.deployCommands(client).then(() => {
    eventHandler.execute(client);
    commandHandler.execute(client);
})

client.login(process.env.DISCORD_TOKEN);
process.env.DISCORD_TOKEN = null