// Types
import type { ExtendedClient } from "../Types/Client.js";
import type { SendableChannel } from "../Types/Message.js";
import type { Message } from "discord.js";

// Handlers
import FilesHandler from "../Handlers/Files.js";

// Imports
import Path from "node:path";
import { Events } from "discord.js";
import Utilities from "../Handlers/Utilities.js";
import Axios from "axios";
import personalitiesJson from "../Data/personalities.json" with { type: "json" };
const personalities: Record<string, string> = personalitiesJson;

const dataPath = Path.join(__dirname, "../Data/conversations.json");

export default {
    name: Events.MessageCreate,
    once: false,
    
    async execute(message: Message, client: ExtendedClient) {
        if (message.author.bot) return;
        
        const Channel = message.channel as SendableChannel
        const conversations = FilesHandler.loadFile(dataPath);
        const key = `${message.guildId || "dm"}-${message.channelId}`;
        const convo = conversations[key];

        if (!convo) return;
        if (!client._availableModels.some(m => m.value === convo.model)) return;

        const userMessage = message.content;
        const personalityKey = convo.personality ?? "default";
        const systemMessage = personalities[personalityKey];        

        convo.messages.push({
            role: "user",
            content: userMessage,
            timestamp: Date.now()
        });

        FilesHandler.saveFile(dataPath, conversations);
        const replyMsg = await message.reply("Thinking...");

        try {
            const response = await Axios.post("http://127.0.0.1:1234/v1/chat/completions", {
                model: "llama-3.2-8x3b-moe-dark-champion-instruct-uncensored-abliterated-18.4b", 
                messages: [
                    { role: "system", content: systemMessage },
                    ...convo.messages
                ],
                max_tokens: process.env.MAX_TOKENS
            });

            const answer = response.data.choices?.[0]?.message?.content || "No response from the LLM.";
            const chunks: string[] = Utilities.splitByWords(answer, 1500);

            if (chunks[0]) {
                await replyMsg.edit(chunks[0]);
            }

            if (chunks.length > 1) {
                const validChunks = chunks.slice(1).filter((chunk): chunk is string => chunk !== undefined);

                for (const chunk of validChunks) {
                    await Channel.send(chunk);
                }
            }

            convo.messages.push({
                role: "assistant",
                content: answer,
                timestamp: Date.now()
            });

            FilesHandler.saveFile(dataPath, conversations);
        } catch (err) {
            console.error(err);
        }
    }
};
