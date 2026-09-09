import { ApplicationCommandTypes, InteractionTypes } from "@discordeno/bot";
import { bot } from "../bot.ts";
import { doPublish } from "../interaction/publish.ts";

bot.events.interactionCreate = async function (interaction) {
  if (interaction.type === InteractionTypes.ApplicationCommand && interaction.data?.type === ApplicationCommandTypes.Message) {
    if (interaction.data.name === "Publish") {
      await doPublish(interaction);
    }
  }
}
