import {
  ApplicationCommandTypes,
  CreateApplicationCommand,
} from "@discordeno/bot";
import { bot } from "../bot.ts";

const publishInteraction: CreateApplicationCommand = {
  name: "Publish",
  type: ApplicationCommandTypes.Message,
};

await bot.rest.createGuildApplicationCommand(
  publishInteraction,
  BigInt(Deno.env.get("DISCORD_SERVER_ID")!)
);

export async function doPublish(interaction) {
  const permissions = interaction.member?.permissions;

  if (!permissions.has("MANAGE_MESSAGES")) {
    await interaction.respond("You need the permission Manage Messages to perform this action.",{isPrivate: true})
  }

  await interaction.respond("Hello, world! You tried to publish a message, but this isn't implemented yet...",{isPrivate: true})
}
