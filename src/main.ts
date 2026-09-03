import { beginCheckingStates } from "./interval/getCurrentStatus.ts";
import { startDiscordBot } from "./discord/main.ts";
import { startApi } from "./api/main.ts";

await beginCheckingStates()
startDiscordBot()
await startApi()