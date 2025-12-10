const { SlashCommandBuilder } = require("discord.js");
const fileHandler = require("../../Handlers/Files")
const path = require('node:path');
const client = require("../../client");

const dataPath = path.join(__dirname, "../../Data/conversations.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('start')
        .setDescription('Start a new chat with the LLM')
        .addStringOption((option) => option
			.setName('model')
			.setDescription('Select a model to use for this conversation')
			.setRequired(true)
			.addChoices(...client._availableModels),
	    ),
    async execute(interaction) { 
        await interaction.deferReply();

        try {
            const conversations = fileHandler.loadFile(dataPath);
            const key = `${interaction.guildId || "dm"}-${interaction.channelId}`;
            const selectedModel = interaction.options.getString("model");

            if (!client._availableModels.some(m => m.value === selectedModel)) {
                await interaction.editReply("Oops! This isn't an available model!");
            } else {
                if (!conversations[key]) {
                    conversations[key] = {
                        model: selectedModel,
                        personality: "default",
                        messages: []
                    };
                }

                fileHandler.saveFile(dataPath, conversations)
                await interaction.editReply(`Started a new chat using **${selectedModel}**`);
            }
        } catch(err) {
            console.log(err)
        }
    },
}