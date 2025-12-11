import type { Interaction } from "discord.js";

const { SlashCommandBuilder } = require("discord.js");
const fileHandler = require("../../Handlers/Files")
const path = require('node:path');
const client = require("../../client");
const personalities = require("../../Data/personalities.json")

const dataPath = path.join(__dirname, "../../Data/conversations.json");

export default {
    data: new SlashCommandBuilder()
        .setName('start')
        .setDescription('Start a new chat with the LLM')
        .addStringOption((option) => option
			.setName('model')
			.setDescription('Select a model to use for this conversation')
			.setRequired(true)
			.addChoices(...client._availableModels),
	    )
        .addStringOption((option) => option
			.setName('personality')
			.setDescription('Select a personality to use for this conversation')
			.setRequired(true)
			.addChoices(...client._availablePersonalities),
	    ),

    async execute(interaction: Interaction) { 
        await interaction.deferReply();

        try {
            const conversations = fileHandler.loadFile(dataPath);
            const key = `${interaction.guildId || "dm"}-${interaction.channelId}`;
            const selectedModel = interaction.options.getString("model");
            const selectedPersonality = interaction.options.getString("personality");

            if (!client._availableModels.some(m => m.value === selectedModel)) {
                await interaction.editReply("Oops! This isn't an available model!");
            } else {
                if (personalities[selectedPersonality]) {
                    if (!conversations[key]) {
                        conversations[key] = {
                            model: selectedModel,
                            personality: selectedPersonality,
                            messages: []
                        };
                    }

                    fileHandler.saveFile(dataPath, conversations)
                    await interaction.editReply(`Started a new chat using **${selectedModel}**`);
                } else {
                    await interaction.editReply(`${selectedPersonality} is not a valid personality`);
                }
            }
        } catch(err) {
            console.log(err)
        }
    },
}