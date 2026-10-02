// Builds one upload ZIP per client from plugins/puzzle. Both share skills/ and assets/; each
// gets only its own manifests, so neither client sees the other's files.
//   dist/puzzle-chatgpt.zip  ChatGPT / Codex: plugin.json + mcp.json (Agent Plugins 1.0.0)
//   dist/puzzle-claude.zip   Claude / Claude Code: .claude-plugin/plugin.json + .mcp.json
import { spawnSync } from "node:child_process";
import { mkdirSync, rmSync } from "node:fs";
import { join, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const plugin = join(root, "plugins/puzzle");
const dist = join(root, "dist");

const shared = ["skills", "assets"];
const bundles = {
  "puzzle-chatgpt.zip": ["plugin.json", "mcp.json", ...shared],
  "puzzle-claude.zip": [".claude-plugin/plugin.json", ".mcp.json", ...shared],
};

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist);
for (const [zip, paths] of Object.entries(bundles)) {
  const result = spawnSync("zip", ["-q", "-r", "-X", join(dist, zip), ...paths, "-x", "*.DS_Store"], {
    cwd: plugin,
    encoding: "utf8",
  });
  if (result.status !== 0) {
    throw new Error(`${zip}: ${result.stderr || "zip failed"}`);
  }
  console.log(`dist/${zip}`);
}
