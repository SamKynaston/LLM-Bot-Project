const { Events } = require("discord.js");

module.exports = {
    name: Events.InteractionCreate,  
    once: false,
    async execute(interaction, client) {
        console.log(interaction)

        if (!interaction.isCommand()) return;

        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            if (!interaction.replied) {
                await interaction.reply({ content: 'There was an error!', ephemeral: true });
            }
        }
    },
};