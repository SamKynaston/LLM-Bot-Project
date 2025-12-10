const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const personalities = require("../../personalities")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription('Say anything to the LLM')
        .addStringOption(option => option.setName("personality").setDescription("Name of the personality to use").setRequired(true))
        .addStringOption(option => option.setName('input').setDescription('What would you like to ask?').setRequired(true)),

    async execute(interaction) { 
        const prompt = interaction.options.getString("input");
        const name = interaction.options.getString("personality") || "default";

        const systemMessage = personalities[name] || personalities["default"];

        await interaction.deferReply();

        try {
            const response = await axios.post("http://127.0.0.1:1234/v1/chat/completions", {
                model: "llama-3.2-8x3b-moe-dark-champion-instruct-uncensored-abliterated-18.4b", 
                messages: [
                    { role: "system", content: systemMessage },
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