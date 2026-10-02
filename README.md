# Puzzle plugin

Connects Claude, ChatGPT and Codex to [Puzzle](https://puzzle.io)'s remote MCP server at
`https://app.puzzle.io/mcp`. Users sign in with OAuth and choose which companies to share; the
connection is read-only until they allow write access. The server lives in
[`puzzlefin/gateway`](https://github.com/puzzlefin/gateway) (`src/mcp/`, `docs/mcp/README.md`).

The plugin itself is thin: the MCP endpoint, the logo, and two skills. Puzzle's playbooks
(closing a month, bills, reconciliation) are served by the server through `list_skills` /
`get_skill`, so they change without a plugin release.

## Layout

```
plugins/puzzle/
  plugin.json               ChatGPT / Codex manifest (Agent Plugins 1.0.0 + extensions.com.openai)
  mcp.json                  ChatGPT / Codex MCP server (streamable-http)
  .claude-plugin/plugin.json  Claude / Claude Code manifest
  .mcp.json                 Claude / Claude Code MCP server (http)
  skills/puzzle-books/      how to work with the books: company, write access, cash vs accrual
  skills/get-started/       first-run (ChatGPT onboardingSkill)
  assets/                   logo.png 512², icon.png 96², logo.svg
.claude-plugin/marketplace.json   Claude marketplace for this repo
.agents/plugins/marketplace.json  Codex marketplace for this repo
```

One tree works for both clients: each reads only its own manifests. `node scripts/build.mjs`
writes one ZIP per client to `dist/`, each with only that client's manifests:

| ZIP | Upload to |
|---|---|
| `dist/puzzle-chatgpt.zip` | [platform.openai.com/plugins](https://platform.openai.com/plugins) → Create plugin → **With MCP** |
| `dist/puzzle-claude.zip` | claude.ai → Customize → Plugins → upload |

## Install

**Claude Code**

```bash
claude plugin marketplace add puzzlefin/agent-plugin
claude plugin install puzzle@puzzle
# then /mcp → plugin:puzzle:puzzle → Authenticate
```

**Codex**

```bash
codex plugin marketplace add puzzlefin/agent-plugin
codex plugin add puzzle@puzzle
codex mcp login puzzle
```

**ChatGPT (developer mode, before the directory listing)**: Settings → Security and login →
Developer mode, then upload `dist/puzzle-chatgpt.zip` as a plugin, or add
`https://app.puzzle.io/mcp` at chatgpt.com/plugins.

**Claude without the plugin**: Settings → Connectors → Add custom connector →
`https://app.puzzle.io/mcp`.

## Changing it

- Bump `version` in **both** `plugin.json` and `.claude-plugin/plugin.json`.
- Keep the two manifests' `description` in sync.
- Skills are provider-neutral (OpenAI review rejects Claude-specific wording); say "the model".
- Validate before shipping:

  ```bash
  claude plugin validate ./plugins/puzzle --strict
  claude plugin validate . --strict
  node scripts/build.mjs
  ```

- OpenAI limits: `displayName` and `shortDescription` ≤30 chars, ≤3 `defaultPrompt` of ≤128,
  ≤20 `capabilities` of ≤120, `brandColor` ≥2:1 against white (the brand green `#50F9AB` is
  1.36:1, so light mode uses green 700 `#309667`).
- The MCP origin (`https://app.puzzle.io`) can never change for the ChatGPT listing: a new host
  is a new plugin there.
