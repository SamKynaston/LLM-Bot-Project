const fileHandler = require("../Handlers/Files");
const path = require("node:path");
const { Events } = require("discord.js");
const axios = require("axios");

const dataPath = path.join(__dirname, "../Data/conversations.json");

module.exports = {
    name: Events.MessageCreate,
    once: false,
    
    async execute(message, client) {
        if (message.author.bot) return;
        
        const conversations = fileHandler.loadFile(dataPath);
        const key = `${message.guildId || "dm"}-${message.channelId}`;
        const convo = conversations[key];

        if (!convo) return;
        if (!client._availableModels.some(m => m.value === convo.model)) return;

        const userMessage = message.content;
        convo.messages.push({
            role: "user",
            content: userMessage,
            timestamp: Date.now()
        });

        fileHandler.saveFile(dataPath, conversations);
        const replyMsg = await message.reply("Thinking...");

        try {
            const response = await axios.post("http://127.0.0.1:1234/v1/chat/completions", {
                model: "llama-3.2-8x3b-moe-dark-champion-instruct-uncensored-abliterated-18.4b", 
                messages: convo.messages,
                max_tokens: process.env.MAX_TOKENS
            });

            const answer = response.data.choices?.[0]?.message?.content || "No response from the LLM.";
            replyMsg.edit(answer)

            convo.messages.push({
                role: "assistant",
                content: answer,
                timestamp: Date.now()
            });

            fileHandler.saveFile(dataPath, conversations);
        } catch (err) {
            console.error(err);
        }
    }
};
