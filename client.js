const { Client, GatewayIntentBits, Collection } = require("discord.js");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages
    ]
});

client.commands = new Collection();
client._availableModels = [];
client._availablePersonalities = [];

const personalities = require("./Data/personalities.json")
Object.keys(personalities).forEach(key => {
    client._availablePersonalities.push({
        name: key, 
        value: key
    });
});

module.exports = client;