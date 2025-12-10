const { SlashCommandBuilder } = require("discord.js");
const personalities = require("../../personalities")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('personality')
        .setDescription('Sets the personality of LLM responses (SESSION ONLY!)')
        .addStringOption((option) => option.setName('name').setDescription('Name this personality').setRequired(true))
        .addStringOption((option) => option.setName('personality').setDescription('Describe the personality in any way you like').setRequired(true)),

    async execute(interaction) { 
        const name = interaction.options.getString("name");
        const descriptor = interaction.options.getString("personality");

        personalities[name] = descriptor;

        await interaction.reply(`✅ Personality updated to:\n"${descriptor}"`);
    },
}