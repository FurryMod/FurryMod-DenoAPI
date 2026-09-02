import { Hono } from 'hono'

const app = new Hono()

async function loadEndpoints(app: Hono, dir: URL, base = '') {
  for await (const file of Deno.readDir(dir)) {
    const path = new URL(file.name + (file.isDirectory ? '/' : ''), dir); // I know using a URL is *kinda* stupid, but it works, and it fixes a weird bug I had in Ninji (where this code is from)

    if (file.isDirectory) {
      await loadEndpoints(app, path, `${base}/${file.name}`);
      continue;
    }

    if (!file.isFile || !file.name.endsWith(".ts")) continue;

    const name = file.name.replace(/\.ts$/, '');
    const mod = await import(path.href);

    app.route(`${base}/${name}`, mod.default)
  }
}

await loadEndpoints(app, new URL("./api/", import.meta.url))

Deno.serve(app.fetch)