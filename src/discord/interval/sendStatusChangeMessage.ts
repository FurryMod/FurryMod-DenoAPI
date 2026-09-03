import { Status } from "../../helper/enum.ts";
import { bot } from "../bot.ts";

function getStatusEmbed(serviceName: string, status: Status) {
    switch (status) {
        case Status.OPERATIONAL:
            return {
                embeds: [
                    {
                        title: "A service is now up.",
                        description: `The service ${serviceName} was down/degraded.\n${serviceName} is now back up.`,
                        author: {
                            name: "Furi Status Updates",
                        },
                        color: 6615074,
                },
            ],
        };

        case Status.DEGRADED:
            return {
            embeds: [
                {
                    title: "A service has degraded availability.",
                    description: `The service ${serviceName} has degraded performance.\n${serviceName} may take some time to respond.`,
                    author: {
                        name: "Furi Status Updates",
                    },
                    color: 15768610,
                },
            ],
        };

        case Status.DOWN:
            return {
                embeds: [
                    {
                        title: "A service has gone down.",
                        description: `The service ${serviceName} has gone down.\n${serviceName} will not respond.`,
                        author: {
                            name: "Furi Status Updates",
                        },
                        color: 14495792,
                    },
                ],
            };

        default:
        return undefined;
    }
}

export async function sendStatusNotif(serviceName: string, status: Status, channel: string) {
    const embed = getStatusEmbed(serviceName, status);

    if (!embed) return;

    await bot.helpers.sendMessage(channel, embed);

    console.log(`[STATUS] Sent Discord notification of ${serviceName} being ${status}`);
}