import { Status } from "../helper/enum.ts";

export let overallStatus: Status = Status.UNKNOWN

export let homeStatus: Status = Status.UNKNOWN;
export const homeIsUpUrl: URL = new URL("https://studio.furrymod.tutel.page/is_up");

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

    if (homeOk && editorOk) {
        console.log("[STATUS] Status is currently: OPERATIONAL");
        return Status.OPERATIONAL;
    } else if (!homeOk && !editorOk) {
        console.log("[STATUS] Status is currently: DOWN");
        return Status.DOWN;
    } else {
        console.log("[STATUS] Status is currently: DEGRADED");
        return Status.DEGRADED;
    }
}


export async function beginCheckingStates() {
    // Don't wanna sit for 5 minutes on UNKNOWN
    overallStatus = await checkStates(homeIsUpUrl, editorIsUpUrl);

    setInterval(async () => {
        overallStatus = await checkStates(homeIsUpUrl, editorIsUpUrl);
    }, 5 * 60 * 1000);
}
