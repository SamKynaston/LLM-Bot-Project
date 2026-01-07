import { Events, type Interaction } from "discord.js";
import type { ExtendedClient } from "../Types/Client.js";

export default {
    name: Events.InteractionCreate,  
    once: false,

    async execute(interaction: Interaction, client: ExtendedClient) {
        if (!interaction.isCommand()) return;

        const command = client._commands.get(interaction.commandName);
        if (!command) return;

        try {
            if (command.permission) {
                return await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
            }

            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            if (!interaction.replied) {
                await interaction.reply({ content: 'There was an error!', ephemeral: true });
            }
        }
    },
};