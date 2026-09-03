import { Hono } from "hono";
import { VERSION } from "../../helper/info.ts";

const app = new Hono()

app.get("/", (c) => c.json({
    version: VERSION
}))

export default app