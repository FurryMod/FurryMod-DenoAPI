import { Hono } from "hono";
import { editorStatus, homeStatus, overallStatus } from "../../../interval/getCurrentStatus.ts";

const app = new Hono()

app.get("/", (c) => c.json({
    status: overallStatus.toString(),
    states: {
        home: homeStatus,
        editor: editorStatus
    }
}))

export default app