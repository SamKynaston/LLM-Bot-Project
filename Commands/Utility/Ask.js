const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ask')
        .setDescription('Asks an LLM your question')
        .addStringOption((option) => option.setName('input').setDescription('What would you like to ask?').setRequired(true)),

    async execute(interaction) { 
        const prompt = interaction.options.getString("input");

        await interaction.deferReply();

        try {
            const response = await axios.post("http://127.0.0.1:1234/v1/chat/completions", {
                model: "llama-3.2-8x3b-moe-dark-champion-instruct-uncensored-abliterated-18.4b", 
                messages: [
                    { role: "user", content: prompt }
                ],
                max_tokens: 200
            });

            const answer = response.data.choices?.[0]?.message?.content || "No response from the LLM.";
            await interaction.editReply(answer);
        } catch (err) {
            console.error("Error querying local LLM:", err);
            await interaction.editReply("Oops! Something went wrong with the local LLM.");
        }
    },
}