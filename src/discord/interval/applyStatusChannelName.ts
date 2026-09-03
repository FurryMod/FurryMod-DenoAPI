import { Status } from "../../helper/enum.ts";
import { overallStatus } from "../../interval/getCurrentStatus.ts";
import { bot } from "../bot.ts";

function generateStatusChannelName(status: Status) {
    switch (status) {
        case Status.OPERATIONAL: return "🟢┃status"
        case Status.DEGRADED: return "🟡┃status"
        case Status.DOWN: return "🔴┃status"
        case Status.UNKNOWN: return "❔┃status"
        default: return "❔┃status"
    }
}

export async function doStatusChannelUpdates() {
    while (true) {
        try {
            const channel = await bot.helpers.getChannel(Deno.env.get("DISCORD_STATUS_CHANNEL_ID")!)
            const statusName = generateStatusChannelName(overallStatus)

            if (channel.name !== statusName) {
                await bot.helpers.editChannel(Deno.env.get("DISCORD_STATUS_CHANNEL_ID")!, {
                    name: statusName
                })

                console.log(`[DISCORD] Renamed status channel to ${statusName}`)
            }
        } catch (e) {
            console.error("[DISCORD] Failed to rename status channel:", e)
        }

        // Sadly cannot do this any faster (than maybe like, 5.1+ or something) becasue of Discord's idiotic ratelimit, of 2 changes per 10 minutes (???)
        await new Promise((resolve) => setTimeout(resolve, 6 * 60 * 1000))
    }
}