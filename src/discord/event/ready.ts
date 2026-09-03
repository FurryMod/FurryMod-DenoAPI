import { bot } from "../bot.ts";

bot.events.ready = (payload) => {
    console.log(`[DISCORD] Logged in as ${payload.user.username}`)
}