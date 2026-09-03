import { createBot, Intents } from "@discordeno/bot";

export const bot = createBot({
    token: Deno.env.get("DISCORD_TOKEN")!,
    intents: Intents.Guilds | Intents.GuildMessages | Intents.MessageContent,
    desiredProperties: {
        user: {
            id: true,
            username: true
        },
        channel: {
            name: true
        }
    }
});