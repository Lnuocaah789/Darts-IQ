# Connecting Claude to Palmier Pro

[Palmier Pro](https://github.com/palmier-io/palmier-pro) is a macOS video editor
(Apple Silicon, macOS 26+) that exposes an MCP server while running, letting
AI agents like Claude drive editing actions. It is a standalone desktop app,
not a Claude Code skill — you install it locally on your Mac, then point your
agent at its MCP endpoint.

## Prerequisites

1. Download and run Palmier Pro from the
   [GitHub releases](https://github.com/palmier-io/palmier-pro/releases).
2. With the app open, it serves an MCP endpoint at:

   ```
   http://127.0.0.1:19789/mcp
   ```

## Connect Claude Code

```bash
claude mcp add --transport http palmier-pro http://127.0.0.1:19789/mcp
```

## Connect Claude Desktop

In Palmier Pro: `Help` → `MCP Instructions` → `Install in Claude Desktop`
(one-click setup).

## Connect Cursor

Add to `~/.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "palmier-pro": {
      "type": "http",
      "url": "http://127.0.0.1:19789/mcp"
    }
  }
}
```

Or use `Help` → `MCP Instructions` → `Install in Cursor` from within the app.

## Connect Codex

```bash
codex mcp add palmier-pro --url http://127.0.0.1:19789/mcp
```

## Notes

- The MCP server only runs while Palmier Pro is open on your Mac; it is not
  reachable from a remote/cloud environment like this one.
- The editor core and MCP server are GPLv3; generative AI features are a
  separate proprietary, subscription-gated layer.
