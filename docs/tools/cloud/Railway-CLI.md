## CLI

The Railway Command Line Interface (CLI) lets you interact with your Railway projects from the command line.

## Installing the CLI

Install the Railway CLI with agent support configured in one step (macOS, Linux, Windows via WSL):

```
curl -fsSL agents.railway.com | sh
```

This installs the CLI to `~/.railway/bin` and runs [`railway setup agent`](https://docs.railway.com/cli/setup) to configure detected agent tools.

To install the CLI without agent configuration:

```
bash <(curl -fsSL railway.com/install.sh)
```

On Windows, use [Windows Subsystem for Linux](https://learn.microsoft.com/en-us/windows/wsl/install) with a Bash shell.

### Other installation methods

#### Homebrew (macOS)

```
brew install railway
```

#### npm (macOS, Linux, Windows)

```
npm i -g @railway/cli
```

Requires Node.js version 16 or higher.

#### Scoop (Windows)

```
scoop install railway
```

#### Pre-built binaries

Download [pre-built binaries](https://github.com/railwayapp/cli/releases/latest) from the [GitHub repository](https://github.com/railwayapp/cli).

#### From source

Build from source using the instructions in the [GitHub repository](https://github.com/railwayapp/cli#from-source).

## Authentication

Before using the CLI, authenticate with your Railway account:

```
railway login
```

For environments without a browser, such as SSH sessions, use browserless login:

```
railway login --browserless
```

### Tokens

For CI/CD pipelines, set environment variables instead of interactive login:

- **Project Token**: Set `RAILWAY_TOKEN` for project-level actions
- **Account/Workspace Token**: Set `RAILWAY_API_TOKEN` for account-level actions

```
RAILWAY_TOKEN=xxx railway up
```

See [Tokens](https://docs.railway.com/integrations/api#project-token) for more information.

## Available commands

### Authentication

```
railway login                   # Login to Railway
railway login --browserless     # Login without browser
railway logout                  # Logout from Railway
railway whoami                  # Show current user
```

[login](https://docs.railway.com/cli/login) · [logout](https://docs.railway.com/cli/logout) · [whoami](https://docs.railway.com/cli/whoami)

### Project management

```
railway init                    # Create a new project
railway link                    # Link to existing project
railway unlink                  # Unlink current directory
railway list                    # List all projects
railway status                  # Show project info
railway open                    # Open in browser
```

[init](https://docs.railway.com/cli/init) · [link](https://docs.railway.com/cli/link) · [unlink](https://docs.railway.com/cli/unlink) · [list](https://docs.railway.com/cli/list) · [status](https://docs.railway.com/cli/status) · [open](https://docs.railway.com/cli/open) · [project](https://docs.railway.com/cli/project)

### Deployment

```
railway up                      # Deploy current directory
railway up --detach             # Deploy without streaming logs
railway deploy --template postgres # Deploy a template
railway redeploy                # Redeploy latest deployment
railway restart                 # Restart a service
railway down                    # Remove latest deployment
railway deployment list         # List deployments
railway templates search        # Search published templates
```

[up](https://docs.railway.com/cli/up) · [deploy](https://docs.railway.com/cli/deploy) · [redeploy](https://docs.railway.com/cli/redeploy) · [restart](https://docs.railway.com/cli/restart) · [down](https://docs.railway.com/cli/down) · [deployment](https://docs.railway.com/cli/deployment) · [templates](https://docs.railway.com/cli/templates) · [Deploying Guide](https://docs.railway.com/cli/deploying)

### Services

```
railway add                     # Add a service (interactive)
railway add --database postgres # Add PostgreSQL
railway add --repo user/repo    # Add from GitHub repo
railway service                 # Link a service
railway service files browse /app # Browse service files in a TUI
railway service files download /app/data.db ./data.db # Download from a service
railway scale                   # Scale a service
railway delete                  # Delete a project
```

[add](https://docs.railway.com/cli/add) · [service](https://docs.railway.com/cli/service) · [scale](https://docs.railway.com/cli/scale) · [delete](https://docs.railway.com/cli/delete)

### Variables

```
railway variable list           # List variables
railway variable set KEY=value  # Set a variable
railway variable delete KEY     # Delete a variable
```

[variable](https://docs.railway.com/cli/variable)

### Environments

```
railway environment             # Switch environment (interactive)
railway environment new staging # Create new environment
railway environment delete dev  # Delete an environment
```

[environment](https://docs.railway.com/cli/environment)

### Local development

```
railway run npm start           # Run command with Railway env vars
railway shell                   # Open shell with Railway env vars
railway dev                     # Run services locally with Docker
```

[run](https://docs.railway.com/cli/run) · [shell](https://docs.railway.com/cli/shell) · [dev](https://docs.railway.com/cli/dev)

### Logs & debugging

```
railway logs                    # Stream deployment logs
railway logs --build            # View build logs
railway logs -n 100             # View last 100 lines
railway ssh                     # SSH into service container
railway connect                 # Connect to database shell
railway metrics                 # View resource and HTTP metrics
```

[logs](https://docs.railway.com/cli/logs) · [ssh](https://docs.railway.com/cli/ssh) · [connect](https://docs.railway.com/cli/connect) · [metrics](https://docs.railway.com/cli/metrics)

### Networking

```
railway domain                  # Generate Railway domain
railway domain example.com      # Add custom domain
railway domain list             # List service domains
railway domain status example.com # Show DNS details
railway cdn status              # Show CDN caching settings
railway cdn enable              # Enable CDN caching
railway cdn purge html          # Purge cached HTML
railway waf under-attack status # Show WAF protection status
railway waf under-attack enable # Enable Under Attack Mode
railway outbound-network status # Show outbound networking status
railway outbound-network static-ip enable # Enable Static Outbound IPs
railway outbound-network ipv6 enable # Stage Outbound IPv6
railway private-network status  # Show private networking status
railway tcp-proxy create --port 5432 # Create a public TCP proxy
```

[domain](https://docs.railway.com/cli/domain) · [cdn](https://docs.railway.com/cli/cdn) · [waf](https://docs.railway.com/cli/waf) · [outbound-network](https://docs.railway.com/cli/outbound-network) · [private-network](https://docs.railway.com/cli/private-network) · [tcp-proxy](https://docs.railway.com/cli/tcp-proxy)

### Volumes

```
railway volume list             # List volumes
railway volume add              # Add a volume
railway volume browse /         # Browse volume files in a TUI
railway volume files download /backup.tar ./backup.tar # Download from a volume
railway volume delete           # Delete a volume
```

[volume](https://docs.railway.com/cli/volume)

### Buckets

```
railway bucket list             # List buckets
railway bucket create           # Create a bucket
railway bucket info             # Show bucket details
railway bucket credentials      # Show or reset S3-compatible credentials
railway bucket delete           # Delete a bucket
```

[bucket](https://docs.railway.com/cli/bucket)

### Functions

```
railway functions list          # List functions
railway functions new           # Create a function
railway functions push          # Push function changes
```

[functions](https://docs.railway.com/cli/functions)

### Sandboxes

```
railway sandbox create          # Create a sandbox
railway sandbox list            # List sandboxes in the environment
railway sandbox ssh             # SSH into the active sandbox
railway sandbox exec -- ls -la  # Run a command in the active sandbox
railway sandbox destroy         # Destroy a sandbox
```

[sandbox](https://docs.railway.com/cli/sandbox)

### AI & agents

```
railway agent                   # Chat with the Railway Agent
railway agent -p "..."          # Send a single prompt
railway agent --list            # List previous agent threads
railway agent --thread-id <ID>  # Resume a previous thread
railway setup agent             # Configure Railway agent tooling
railway mcp install             # Configure MCP for AI coding tools
railway skills install          # Install Railway agent skills
```

[agent](https://docs.railway.com/cli/agent) · [setup](https://docs.railway.com/cli/setup) · [mcp](https://docs.railway.com/cli/mcp) · [skills](https://docs.railway.com/cli/skills)

### Utilities

```
railway completion bash         # Generate shell completions
railway docs                    # Open documentation
railway upgrade                 # Upgrade CLI
railway autoupdate status       # Show auto-update status
```

[completion](https://docs.railway.com/cli/completion) · [docs](https://docs.railway.com/cli/docs) · [upgrade](https://docs.railway.com/cli/upgrade) · [autoupdate](https://docs.railway.com/cli/autoupdate) · [starship](https://docs.railway.com/cli/starship)

## Global options

These flags are available across multiple commands:

| Flag | Description |
| --- | --- |
| `-s, --service` | Target service (name or ID) |
| `-e, --environment` | Target environment (name or ID) |
| `--json` | Output in JSON format |
| `-y, --yes` | Skip confirmation prompts |
| `-h, --help` | Display help information |
| `-V, --version` | Display CLI version |

See [Global Options](https://docs.railway.com/cli/global-options) for more details.

## SSH

The Railway CLI enables you to start a shell session inside your deployed Railway services:

```
railway ssh
```

Copy the exact command from the Railway dashboard by right-clicking on a service and selecting "Copy SSH Command".

See [railway ssh](https://docs.railway.com/cli/ssh) for more details.

## Contributing

The Railway CLI is open source. Contribute to the development of the Railway CLI by opening an issue or Pull Request on the [GitHub Repo](https://github.com/railwayapp/cli).
