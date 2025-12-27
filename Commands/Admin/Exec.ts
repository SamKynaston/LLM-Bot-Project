import type { SlashCommandStringOption } from "discord.js";
import type { ExtendedCommand } from "../../Types/Command.js";
import { SlashCommandBuilder } from "discord.js";

const command: ExtendedCommand = {
    data: new SlashCommandBuilder()
        .setName('exec')
        .setDescription('Execute local commands')
        .addStringOption((option: SlashCommandStringOption) => option.setName('command').setDescription('Command to run').setRequired(true)),

    async execute(interaction) { 
        const cmd = interaction.options.getString("command");
        await interaction.deferReply();

        try {
            const result = await eval(`(async () => { ${cmd} })()`);

            let output = typeof result === "string" ? result : (await import("util")).inspect(result);
            if (output.length > 1900) output = output.slice(0, 1900) + "...";

            await interaction.editReply(`Result:\n\`\`\`js\n${output}\n\`\`\``);
        } catch (err: Error | any) {
            let errorMsg = err.toString();
            if (errorMsg.length > 1900) errorMsg = errorMsg.slice(0, 1900) + "...";
            await interaction.editReply(`Error:\n\`\`\`js\n${errorMsg}\n\`\`\``);
        }
    },
}

export default command;