import type { SlashCommandStringOption } from "discord.js";
import { SlashCommandBuilder } from "discord.js";
import type { ExtendedCommand, PersonalityMap } from "../../Types/Command.js";
import fileHandler from "../../Handlers/Files.js";
import path from "node:path";
import client from "../../client.js";
import personalities from "../../Data/personalities.json" with { type: "json" };
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dataPath = path.join(__dirname, "../../Data/conversations.json");
const personalitiesTyped = personalities as unknown as PersonalityMap;

const command: ExtendedCommand = {
    data: new SlashCommandBuilder()
        .setName('start')
        .setDescription('Start a new chat with the LLM')
        .addStringOption((option: SlashCommandStringOption) => option
			.setName('model')
			.setDescription('Select a model to use for this conversation')
			.setRequired(true)
			.addChoices(...client._availableModels),
	    )
        .addStringOption((option: SlashCommandStringOption) => option
			.setName('personality')
			.setDescription('Select a personality to use for this conversation')
			.setRequired(true)
			.addChoices(...client._availablePersonalities),
	    ),

    async execute(interaction) { 
        await interaction.deferReply();
        
        try {
            const conversations = fileHandler.loadFile(dataPath);
            const key = `${interaction.guildId || "dm"}-${interaction.channelId}`;
            const selectedModel = interaction.options.getString("model");
            const selectedPersonality = interaction.options.getString("personality") || "default";

            if (!client._availableModels.some((m: { value: any; }) => m.value === selectedModel)) {
                await interaction.editReply("Oops! This isn't an available model!");
            } else {
                if (personalitiesTyped[selectedPersonality]) {
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

export default command;