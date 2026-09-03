import { bot } from "./bot.ts";
import "./event/ready.ts"
import { doStatusChannelUpdates } from "./interval/applyStatusChannelName.ts";

export async function startDiscordBot() {
    console.log("[DISCORD] Starting bot...");
    await bot.start();

    doStatusChannelUpdates();
}

export { bot }