import type {
    CommandInteraction,
    CommandInteractionOptionResolver,
    SlashCommandBuilder,
    SlashCommandSubcommandsOnlyBuilder,
    SlashCommandOptionsOnlyBuilder,
    Permissions
} from "discord.js";

export interface ExtendedInteraction extends CommandInteraction {
    options: CommandInteractionOptionResolver;
}

export interface ExtendedCommand {
    data:
        | SlashCommandBuilder
        | SlashCommandSubcommandsOnlyBuilder
        | SlashCommandOptionsOnlyBuilder;
    permission?: Permissions;
    execute: (interaction: ExtendedInteraction) => Promise<void>;
}

export type PersonalityMap = Record<string, unknown>;