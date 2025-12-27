import "dotenv";
configDotenv();

import CommandHandler from "./Handlers/Commands.js";
import EventHandler from "./Handlers/Events.js";
import Client from "./client.js";
import { configDotenv } from "dotenv";

CommandHandler.deployCommands(Client).then(() => {
    EventHandler.execute(Client);
    CommandHandler.execute(Client);
})

Client.login(process.env.DISCORD_TOKEN);
process.env.DISCORD_TOKEN = undefined;