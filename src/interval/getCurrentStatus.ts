import { sendStatusNotif } from "../discord/interval/sendStatusChangeMessage.ts";
import { Status } from "../helper/enum.ts";

export let overallStatus: Status = Status.UNKNOWN

let previousHomeStatus: Status = Status.UNKNOWN
export let homeStatus: Status = Status.UNKNOWN;
export const homeIsUpUrl: URL = new URL("https://studio.furrymod.tutel.page/is_up");

let previousEditorStatus: Status = Status.UNKNOWN
export let editorStatus: Status = Status.UNKNOWN;
export const editorIsUpUrl: URL = new URL("https://studio.furrymod.tutel.page/is_up");
// TODO: The rest of the services, currently we only host Editor and Home

// Good functions don't change depending on seemingly unrelated variables, pass in urls
async function checkStates(homeUrl: URL, editorUrl: URL): Promise<Status> {
    console.log("[STATUS] Checking states...");

    const [homeResponse, editorResponse] = await Promise.all([
        fetch(homeUrl).then(resp => resp.text()),
        fetch(editorUrl).then(resp => resp.text()),
    ]);

    // TODO: Make this better, because just checking if a static file returns ok isnt the best way to detect downtime...
    const homeOk = homeResponse.startsWith("ok");
    const editorOk = editorResponse.startsWith("ok");

    homeStatus = homeOk ? Status.OPERATIONAL : Status.DOWN;
    editorStatus = editorOk ? Status.OPERATIONAL : Status.DOWN;

    if (!homeOk) {
        console.warn("[STATUS] Home detected as DOWN");
    }
    if (!editorOk) {
        console.warn("[STATUS] Editor detected as DOWN");
    }

    let newOverallStatus: Status;

    if (homeOk && editorOk) {
        newOverallStatus = Status.OPERATIONAL;
    } else if (!homeOk && !editorOk) {
        newOverallStatus = Status.DOWN;
    } else {
        newOverallStatus = Status.DEGRADED;
    }

    console.log(`[STATUS] Overall status is currently: ${newOverallStatus}`);

    // Kinda stupid but oh well what you gonna do, skin me?
    if (previousHomeStatus!==Status.UNKNOWN && previousHomeStatus!==homeStatus) {
        await sendStatusNotif("Home", homeStatus, Deno.env.get("DISCORD_STATUS_CHANNEL_ID")!)
    }

    if (previousEditorStatus!==Status.UNKNOWN && previousEditorStatus!==editorStatus) {
        await sendStatusNotif("Editor", editorStatus, Deno.env.get("DISCORD_STATUS_CHANNEL_ID")!)
    }

    previousEditorStatus = editorStatus;
    previousHomeStatus = homeStatus;

    return newOverallStatus;
}


export async function beginCheckingStates() {
    overallStatus = await checkStates(homeIsUpUrl, editorIsUpUrl);

    setInterval(async () => {
        overallStatus = await checkStates(homeIsUpUrl, editorIsUpUrl);
    }, 1 * 60 * 1000);
}
