# cmdseek 🔍

> Fast command search CLI that learns from your usage patterns and suggests commands with fuzzy matching.

[![npm version](https://img.shields.io/npm/v/cmdseek.svg)](https://www.npmjs.com/package/cmdseek)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Stop Googling the same commands. `cmdseek` lets you search for commands using natural language, fuzzy matching, and context-aware suggestions. It learns from your usage patterns over time to surface the commands you actually use.

## Features

- **Fuzzy search** — Type what you remember, get the right command
- **Context-aware** — Detects your project type (Node.js, Docker, Git, Python, Rust) and boosts relevant commands
- **Usage learning** — Records which commands you use most and ranks them higher
- **100+ built-in commands** — Git, Docker, npm, filesystem, shell, network, and more
- **Zero config** — Works out of the box, no setup needed
- **Local only** — All data stays on your machine

## Install

```bash
npm install -g cmdseek
```

Or use without installing:

```bash
npx cmdseek "restart docker container"
```

## Usage

### Search for commands

```bash
# Quick search (default action)
cmdseek "restart docker"

# Explicit search
cmdseek search "show last commits"

# Limit results
cmdseek search "install package" --limit 5

# Disable context awareness
cmdseek search "build image" --no-context
```

Output:
```
  Context: git node in my-project

  1. docker restart <container> — Restart a container [docker] (Exact command match)
  2. docker compose restart <service> — Restart compose services [docker] (Tag match: restart)
```

### Browse commands

```bash
# List all categories
cmdseek categories

# List all commands in a category
cmdseek list docker

# List everything
cmdseek list
```

### Usage tracking

```bash
# Record a command you just used
cmdseek record "git rebase -i HEAD~5"

# Record a failed command
cmdseek record "docker build ." --fail

# See your usage stats
cmdseek stats

# See recently used commands
cmdseek recent
```

### Context detection

```bash
# See what cmdseek detects about your project
cmdseek context
```

## API

You can also use cmdseek as a library:

```typescript
import { CommandSearch, UsageTracker } from "cmdseek";

const search = new CommandSearch();
const results = search.searchWithContext("restart container", {
  isGitRepo: true,
  isNodeProject: true,
  isDockerProject: true,
  isRustProject: false,
  isPythonProject: false,
  directoryName: "my-app",
});

for (const result of results) {
  console.log(result.entry.command, result.score, result.matchReason);
}
```

## How It Works

1. **Search**: Uses [Fuse.js](https://fusejs.io/) for fuzzy matching across command text, descriptions, categories, and tags
2. **Context**: Detects project files (package.json, docker-compose.yml, Cargo.toml, etc.) to boost relevant categories
3. **Learning**: Records command usage in `~/.cmdseek/usage.json` and uses frequency data to boost often-used commands
4. **Scoring**: Combines fuzzy relevance + context boost + usage frequency for final ranking

## Command Categories

| Category | Description |
|----------|-------------|
| `git` | Version control commands |
| `docker` | Container management |
| `npm` | Node.js package manager |
| `filesystem` | File operations (find, grep, sed, awk) |
| `shell` | Process and shell management |
| `typescript` | TypeScript compiler |
| `python` | Python tools |
| `network` | Networking (curl, ssh, scp) |
| `tools` | Miscellaneous dev tools (jq, gh, code) |

## License

MIT © [sulthonzh](https://github.com/sulthonzh)
