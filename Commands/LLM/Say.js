const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const personalities = require("../../Data/personalities.json")
const fs = require('node:fs');
const path = require('node:path');

const dataPath = path.join(__dirname, "../../Data/conversations.json");
function loadConversations() {
    if (!fs.existsSync(dataPath)) fs.writeFileSync(dataPath, JSON.stringify({}));
    return JSON.parse(fs.readFileSync(dataPath, "utf8"));
}

function saveConversations(conversations) {
    fs.writeFileSync(dataPath, JSON.stringify(conversations, null, 2));
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('Say anything to the LLM')
        //.addStringOption(option => option.setName("personality").setDescription("Name of the personality to use").setRequired(true))
        .addStringOption(option => option.setName('input').setDescription('What would you like to ask?').setRequired(true)),

    async execute(interaction) { 
        const key = `${interaction.guildId || "dm"}-${interaction.channelId}`;
        const prompt = interaction.options.getString("input");
        const name = interaction.options.getString("personality") || "default";

        const conversations = loadConversations();

        if (!conversations[key]) {
            conversations[key] = {
                model: "llama-3.2-8x3b-moe",
                personality: "default",
                messages: []
            };
        }

        const channelData = conversations[key];
        channelData.messages.push({ role: "user", content: prompt });
        
        const systemMessage = personalities[name] || personalities["default"];
        const messages = [
            { role: "system", content: systemMessage },
            ...channelData.messages // <- only the messages array
        ];
        console.log(`${interaction.user.username} Says "${prompt}"`)

        await interaction.deferReply();

        try {
            const response = await axios.post("http://127.0.0.1:1234/v1/chat/completions", {
                model: "llama-3.2-8x3b-moe-dark-champion-instruct-uncensored-abliterated-18.4b", 
                messages,
                max_tokens: process.env.MAX_TOKENS
            });

            const answer = response.data.choices?.[0]?.message?.content || "No response from the LLM.";

            channelData.messages.push({ role: "assistant", content: answer });
            saveConversations(conversations);

            console.log(`LLM has replied with "${answer}"`)

            const chunkSize = 1900;
            const chunks = [];
            for (let i = 0; i < answer.length; i += chunkSize) {
                chunks.push(answer.slice(i, i + chunkSize));
            }

            await interaction.editReply(chunks[0]);
            for (let i = 1; i < chunks.length; i++) {
                await interaction.followUp(chunks[i]);
            }

        } catch (err) {
            console.error("Error querying local LLM:", err);
            await interaction.editReply("Oops! Something went wrong with the local LLM.");
        }
    },
}