// Minimal dependency-free CDP client. Launches headless Chrome, serves a
// directory over HTTP so pages can load local images, and evaluates JS.
import { spawn } from "node:child_process";
import http from "node:http";
import fs from "node:fs";
import path from "node:path";

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const MIME = {
  ".html": "text/html", ".png": "image/png", ".jpg": "image/jpeg",
  ".avif": "image/avif", ".webp": "image/webp", ".css": "text/css",
  ".js": "text/javascript", ".json": "application/json", ".svg": "image/svg+xml",
};

export function serve(root, port) {
  const server = http.createServer((req, res) => {
    const rel = decodeURIComponent(req.url.split("?")[0]);
    if (rel === "/") {
      // Synthetic host page so images load same-origin (an untainted canvas is
      // required for getImageData).
      res.writeHead(200, { "content-type": "text/html" });
      res.end("<!doctype html><meta charset=utf-8><title>qa</title>");
      return;
    }
    const file = path.join(root, rel);
    if (!file.startsWith(path.resolve(root))) { res.writeHead(403).end(); return; }
    fs.readFile(file, (err, buf) => {
      if (err) { res.writeHead(404).end("not found"); return; }
      res.writeHead(200, { "content-type": MIME[path.extname(file)] ?? "application/octet-stream" });
      res.end(buf);
    });
  });
  return new Promise((r) => server.listen(port, () => r(server)));
}

export async function launch(port = 9333, extraArgs = []) {
  const proc = spawn(CHROME, [
    "--headless=new", `--remote-debugging-port=${port}`,
    "--no-first-run", "--no-default-browser-check", "--disable-gpu",
    "--hide-scrollbars", "--force-device-scale-factor=1",
    `--user-data-dir=/tmp/.chrome-qa-profile-${port}`,
    ...extraArgs, "about:blank",
  ], { stdio: "ignore" });

  for (let i = 0; i < 100; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (r.ok) return { proc, wsUrl: (await r.json()).webSocketDebuggerUrl, port };
    } catch {}
    await new Promise((r) => setTimeout(r, 100));
  }
  proc.kill();
  throw new Error("Chrome did not start");
}

export class Session {
  constructor(ws) { this.ws = ws; this.id = 0; this.pending = new Map(); this.sessionId = null;
    ws.addEventListener("message", (e) => {
      const m = JSON.parse(e.data);
      if (m.id && this.pending.has(m.id)) {
        const { resolve, reject } = this.pending.get(m.id);
        this.pending.delete(m.id);
        m.error ? reject(new Error(JSON.stringify(m.error))) : resolve(m.result);
      }
    });
  }
  send(method, params = {}) {
    const id = ++this.id;
    const msg = { id, method, params };
    if (this.sessionId) msg.sessionId = this.sessionId;
    this.ws.send(JSON.stringify(msg));
    return new Promise((resolve, reject) => this.pending.set(id, { resolve, reject }));
  }
}

export async function connect(wsUrl) {
  const ws = new WebSocket(wsUrl);
  await new Promise((r, j) => { ws.addEventListener("open", r); ws.addEventListener("error", j); });
  const browser = new Session(ws);
  const { targetId } = await browser.send("Target.createTarget", { url: "about:blank" });
  const { sessionId } = await browser.send("Target.attachToTarget", { targetId, flatten: true });
  browser.sessionId = sessionId;
  await browser.send("Page.enable");
  await browser.send("Runtime.enable");
  return browser;
}

export async function goto(s, url) {
  const done = new Promise((r) => {
    const h = (e) => {
      const m = JSON.parse(e.data);
      if (m.method === "Page.loadEventFired") { s.ws.removeEventListener("message", h); r(); }
    };
    s.ws.addEventListener("message", h);
  });
  await s.send("Page.navigate", { url });
  await done;
}

export async function evaluate(s, expression) {
  const r = await s.send("Runtime.evaluate", {
    expression, awaitPromise: true, returnByValue: true,
  });
  if (r.exceptionDetails) throw new Error(JSON.stringify(r.exceptionDetails, null, 2));
  return r.result.value;
}
