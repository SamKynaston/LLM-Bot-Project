import { Message, TextChannel, DMChannel, NewsChannel, ThreadChannel } from "discord.js";

export interface MessageChunks {

}

export type SendableChannel = TextChannel | DMChannel | NewsChannel | ThreadChannel;