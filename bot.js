const client = require("./client");
const eventHandler = require("./Handlers/Events")
const commandHandler = require("./Handlers/Commands")

eventHandler.execute(client);
commandHandler.execute(client);

client.login(process.env.DISCORD_TOKEN);
commandHandler.deployCommands(client)