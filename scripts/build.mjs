// Builds one upload ZIP per client from plugins/puzzle. All share skills/ and assets/; each gets
// only its own manifests, so no client sees another's files.
//   dist/puzzle-chatgpt.zip            ChatGPT desktop / Codex, installed by the user:
//                                      plugin.json + mcp.json (Agent Plugins 1.0.0) on /mcp.
//   dist/puzzle-chatgpt-directory.zip  The ChatGPT directory submission (platform.openai.com/plugins,
//                                      "With MCP"): the same, on /mcp/chatgpt, where the server runs
//                                      in directory mode (no upsells), with review.json merged
//                                      into extensions.com.openai.
//   dist/puzzle-claude.zip             Claude / Claude Code: .claude-plugin/plugin.json + .mcp.json
import { spawnSync } from "node:child_process";
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const plugin = join(root, "plugins/puzzle");
const dist = join(root, "dist");
const shared = ["skills", "assets"];
const DIRECTORY_PATH = "/mcp/chatgpt";

const readJson = (path) => JSON.parse(readFileSync(path, "utf8"));
const writeJson = (path, value) => writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);

const zip = (name, cwd, paths) => {
  const result = spawnSync("zip", ["-q", "-r", "-X", join(dist, name), ...paths, "-x", "*.DS_Store"], {
    cwd,
    encoding: "utf8",
  });
  if (result.status !== 0) {
    throw new Error(`${name}: ${result.stderr || "zip failed"}`);
  }
  console.log(`dist/${name}`);
};

const buildDirectoryZip = () => {
  const work = mkdtempSync(join(tmpdir(), "puzzle-chatgpt-directory-"));
  for (const path of shared) {
    cpSync(join(plugin, path), join(work, path), { recursive: true });
  }
  const manifest = readJson(join(plugin, "plugin.json"));
  Object.assign(manifest.extensions["com.openai"], readJson(join(plugin, "review.json")));
  writeJson(join(work, "plugin.json"), manifest);

  const mcp = readJson(join(plugin, "mcp.json"));
  for (const server of Object.values(mcp.mcpServers)) {
    const url = new URL(server.url);
    url.pathname = DIRECTORY_PATH;
    server.url = url.href;
  }
  writeJson(join(work, "mcp.json"), mcp);

  zip("puzzle-chatgpt-directory.zip", work, ["plugin.json", "mcp.json", ...shared]);
  rmSync(work, { recursive: true, force: true });
};

rmSync(dist, { recursive: true, force: true });
mkdirSync(dist);
zip("puzzle-chatgpt.zip", plugin, ["plugin.json", "mcp.json", ...shared]);
buildDirectoryZip();
zip("puzzle-claude.zip", plugin, [".claude-plugin/plugin.json", ".mcp.json", ...shared]);
