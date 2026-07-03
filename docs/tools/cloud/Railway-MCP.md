## Railway MCP Server

The [Railway MCP Server](https://github.com/railwayapp/railway-mcp-server) is a [Model Context Protocol (MCP)](https://modelcontextprotocol.org/) server that enables natural language interaction with your Railway projects and infrastructure. Ask your IDE or AI assistant to create projects, deploy templates, manage environments, pull variables, redeploy services, and more.

Railway offers two ways to connect:

- **Local MCP** — runs through the [Railway CLI](https://docs.railway.com/cli) on your machine. Recommended for most coding-agent workflows since it shares the CLI's authentication and project context.
- **Remote MCP** — a hosted endpoint at `mcp.railway.com`. No local install or CLI required; clients authenticate through OAuth in the browser.

## Quick start

Install the Railway CLI and configure agent support — skills, MCP, and authentication — in one command. Toggle the options to tailor the command to what you want set up:

```
curl -fsSL agents.railway.com | sh
```

If the CLI is already installed, skip the bootstrap and run:

```
railway setup agent          # local MCP
railway setup agent --remote # remote MCP
```

Read on for per-editor manual configuration, the available tool list, and security considerations.

## Per-editor configuration

If you'd rather wire up an editor by hand — or want to see exactly what `railway mcp install` writes — use the toggle to switch between the local stdio config and the remote HTTP config:

```
railway mcp install
```

Configures detected tools to run the Railway MCP server through the local Railway CLI.

### Cursor

Run `railway mcp install --agent cursor`, or add the following to `.cursor/mcp.json`:

```
{
  "mcpServers": {
    "railway": {
      "command": "railway",
      "args": ["mcp"]
    }
  }
}
```

### VS Code

Add the following to `.vscode/mcp.json`:

```
{
  "servers": {
    "railway": {
      "type": "stdio",
      "command": "railway",
      "args": ["mcp"]
    }
  }
}
```

### Claude Code

Run `railway mcp install --agent claude-code`, or:

```
claude mcp add railway railway mcp
```

### Codex

Run `railway mcp install --agent codex`, or use the [OpenAI Codex CLI](https://developers.openai.com/codex/cli):

```
codex mcp add railway -- railway mcp
```

### GitHub Copilot CLI

Run `railway mcp install --agent copilot`, or add the following to `~/.copilot/mcp-config.json`:

```
{
  "mcpServers": {
    "railway": {
      "type": "local",
      "command": "railway",
      "args": ["mcp"],
      "tools": ["*"]
    }
  }
}
```

### Factory Droid

Run `railway mcp install --agent factory-droid`, or install in [Factory](https://docs.factory.ai/cli/configuration/mcp):

```
droid mcp add railway "railway mcp"
```

### OpenCode

Run `railway mcp install --agent opencode`, or add the following to `opencode.json`:

```
{
  "mcp": {
    "railway": {
      "type": "local",
      "command": ["railway", "mcp"]
    }
  }
}
```

### Windsurf

Windsurf only supports **Remote** MCP.

### Cline

Cline only supports **Remote** MCP.

### Devin

Devin only supports **Remote** MCP.

`railway mcp install` merges the Railway server entry into existing configs without removing other MCP servers. Re-run it any time to update.

## Understanding MCP

The **Model Context Protocol (MCP)** defines a standard for how AI applications (hosts) can interact with external tools and data sources through a client-server architecture.

- **Hosts**: Applications such as Cursor, VS Code, Claude Code, or Windsurf that connect to MCP servers.
- **Clients**: The layer within hosts that maintains one-to-one connections with individual MCP servers.
- **Servers**: Standalone programs (like the Railway MCP Server) that expose tools and workflows for managing external systems.

The local Railway MCP Server translates natural language requests into CLI workflows powered by the [Railway CLI](https://docs.railway.com/cli). The remote MCP server runs on Railway's infrastructure and authenticates via OAuth.

## Prerequisites

- **Local MCP** — install and authenticate the [Railway CLI](https://docs.railway.com/cli).
- **Remote MCP** — a [Railway account](https://railway.com/login). No local install required.

## Example usage

- **Create and deploy a new app**
	```
	Create a Next.js app in this directory and deploy it to Railway.
	Also assign it a domain.
	```
- **Deploy from a template**
	```
	Deploy a Postgres database
	```
- **Pull environment variables**
	```
	Pull environment variables for my project and save them to a .env file
	```
- **Debug a failing deployment** (remote-only `railway-agent` tool)
	```
	Use the railway agent to figure out why my backend service is
	crashing on deploy
	```
- **Redeploy a service**
	```
	Redeploy my api service in the production environment
	```

## Available MCP tools

The Railway MCP Server provides a curated set of tools. Your AI assistant calls these automatically based on the context of your request.

### Local MCP

The local server runs through the Railway CLI and exposes a broader set of CRUD tools:

- **Status**
	- `check-railway-status` — verify CLI installation and authentication
- **Projects & services**
	- `list-projects`, `create-project-and-link`
		- `list-services`, `link-service`
		- `deploy` — deploy a service
		- `deploy-template` — deploy from the [Railway Template Library](https://railway.com/deploy)
- **Environments**
	- `create-environment`, `link-environment`
- **Configuration**
	- `list-variables`, `set-variables`
		- `generate-domain`
- **Observability**
	- `get-logs`

### Remote MCP

The remote server exposes a focused set of tools plus a powerful agent entry point. For anything complex, delegate to `railway-agent`.

- **Account**
	- `whoami`
- **Projects**
	- `list-projects`, `create-project`, `list-services`
- **Deployments**
	- `redeploy`
		- `accept-deploy` — commit staged changes and deploy (destructive; clients prompt for confirmation)
- **Agent**
	- `railway-agent` — hand a natural-language request to Railway's AI agent for multi-step operations like log analysis, debugging, and service configuration

## Security considerations

The Railway MCP Server runs CLI commands or invokes Railway APIs on your behalf. Destructive operations are intentionally excluded from the local server's tool list, but you should still:

- **Review actions** requested by the LLM before approving them, especially destructive ones (`redeploy`, `accept-deploy`, `railway-agent`).
- **Restrict access** to ensure only trusted users can invoke the MCP server.
- **Avoid production risks** by limiting usage to non-critical environments where possible.

For the remote server specifically:

- **OAuth scoping.** When you consent, you choose which workspaces and projects the client can access. Tokens are short-lived and can be revoked from your Railway account settings.
- **Destructive actions** are marked at the protocol level. Clients that respect these hints will prompt for confirmation.
- **Project tokens are not accepted.** The remote MCP server requires a user identity for billing and audit trails.

## Feature requests

The Railway MCP Server is a work in progress. We are actively adding more tools and features. If you have a feature request, leave your feedback on this [Central Station](https://station.railway.com/feedback/model-context-protocol-for-railway-railw-c040b796) post.
