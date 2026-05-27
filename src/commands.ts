import type { CommandEntry } from "./types.js";

/**
 * Built-in command database covering common developer tools.
 */
export const COMMANDS: CommandEntry[] = [
  // === GIT ===
  { command: "git status", description: "Show working tree status", category: "git", tags: ["status", "check", "tree", "working"] },
  { command: "git add -A", description: "Stage all changes for commit", category: "git", tags: ["add", "stage", "all", "changes"] },
  { command: "git commit -m '<message>'", description: "Commit staged changes with message", category: "git", tags: ["commit", "save", "message"] },
  { command: "git push origin <branch>", description: "Push commits to remote branch", category: "git", tags: ["push", "remote", "upload", "sync"] },
  { command: "git pull --rebase", description: "Pull and rebase local commits on top", category: "git", tags: ["pull", "update", "rebase", "fetch"] },
  { command: "git log --oneline -<n>", description: "Show last N commits in one line each", category: "git", tags: ["log", "history", "commits", "recent"] },
  { command: "git log --oneline --graph --all", description: "Show branch graph of all commits", category: "git", tags: ["log", "graph", "branches", "visual", "tree"] },
  { command: "git diff --staged", description: "Show changes that are staged for commit", category: "git", tags: ["diff", "staged", "changes", "review"] },
  { command: "git stash", description: "Temporarily store modified files", category: "git", tags: ["stash", "save", "temp", "shelve"] },
  { command: "git stash pop", description: "Apply and remove the latest stash", category: "git", tags: ["stash", "restore", "apply", "pop"] },
  { command: "git branch -a", description: "List all branches (local and remote)", category: "git", tags: ["branch", "list", "all", "show"] },
  { command: "git checkout -b <branch>", description: "Create and switch to new branch", category: "git", tags: ["branch", "create", "switch", "new"] },
  { command: "git rebase -i HEAD~<n>", description: "Interactive rebase last N commits", category: "git", tags: ["rebase", "interactive", "squash", "edit"] },
  { command: "git reset --soft HEAD~1", description: "Undo last commit but keep changes staged", category: "git", tags: ["reset", "undo", "revert", "last commit"] },
  { command: "git cherry-pick <commit>", description: "Apply changes from a specific commit", category: "git", tags: ["cherry-pick", "apply", "specific", "commit"] },
  { command: "git remote -v", description: "Show remote repository URLs", category: "git", tags: ["remote", "url", "origin", "show"] },
  { command: "git fetch --all", description: "Download objects from all remotes", category: "git", tags: ["fetch", "download", "update", "remote"] },
  { command: "git merge <branch>", description: "Merge another branch into current", category: "git", tags: ["merge", "combine", "branch", "integrate"] },
  { command: "git blame <file>", description: "Show who changed each line in a file", category: "git", tags: ["blame", "who", "author", "line"] },

  // === DOCKER ===
  { command: "docker ps", description: "List running containers", category: "docker", tags: ["list", "running", "containers", "show"] },
  { command: "docker ps -a", description: "List all containers (including stopped)", category: "docker", tags: ["list", "all", "containers", "stopped"] },
  { command: "docker images", description: "List available Docker images", category: "docker", tags: ["images", "list", "available"] },
  { command: "docker build -t <name> .", description: "Build an image from Dockerfile", category: "docker", tags: ["build", "image", "create", "dockerfile"] },
  { command: "docker run --rm -p <host>:<container> <image>", description: "Run a container with port mapping", category: "docker", tags: ["run", "start", "port", "container"] },
  { command: "docker run -it --rm <image> sh", description: "Run container with interactive shell", category: "docker", tags: ["run", "interactive", "shell", "exec", "enter"] },
  { command: "docker exec -it <container> sh", description: "Execute shell inside running container", category: "docker", tags: ["exec", "shell", "inside", "enter", "container"] },
  { command: "docker stop <container>", description: "Stop a running container", category: "docker", tags: ["stop", "halt", "container"] },
  { command: "docker restart <container>", description: "Restart a container", category: "docker", tags: ["restart", "container", "reload"] },
  { command: "docker rm <container>", description: "Remove a stopped container", category: "docker", tags: ["remove", "delete", "container", "clean"] },
  { command: "docker rmi <image>", description: "Remove a Docker image", category: "docker", tags: ["remove", "delete", "image", "clean"] },
  { command: "docker logs -f <container>", description: "Follow container logs in real-time", category: "docker", tags: ["logs", "follow", "tail", "output", "stream"] },
  { command: "docker compose up -d", description: "Start all services in detached mode", category: "docker", tags: ["compose", "up", "start", "services", "background"] },
  { command: "docker compose down", description: "Stop and remove all compose services", category: "docker", tags: ["compose", "down", "stop", "remove", "clean"] },
  { command: "docker compose logs -f <service>", description: "Follow logs for a specific service", category: "docker", tags: ["compose", "logs", "follow", "service"] },
  { command: "docker system prune -a", description: "Remove all unused containers, images, and volumes", category: "docker", tags: ["prune", "clean", "remove", "unused", "free space"] },
  { command: "docker volume ls", description: "List Docker volumes", category: "docker", tags: ["volume", "list", "storage"] },

  // === NPM / NODE ===
  { command: "npm install", description: "Install all dependencies from package.json", category: "npm", tags: ["install", "dependencies", "setup"] },
  { command: "npm install <package>", description: "Install a package as dependency", category: "npm", tags: ["install", "add", "package", "dependency"] },
  { command: "npm install --save-dev <package>", description: "Install a package as dev dependency", category: "npm", tags: ["install", "dev", "save-dev", "development"] },
  { command: "npm uninstall <package>", description: "Remove a package from node_modules", category: "npm", tags: ["uninstall", "remove", "delete", "package"] },
  { command: "npm run <script>", description: "Run a script defined in package.json", category: "npm", tags: ["run", "script", "execute"] },
  { command: "npm run build", description: "Run the build script", category: "npm", tags: ["build", "compile", "bundle"] },
  { command: "npm test", description: "Run the test script", category: "npm", tags: ["test", "spec", "verify"] },
  { command: "npm outdated", description: "Check for outdated dependencies", category: "npm", tags: ["outdated", "check", "update", "version"] },
  { command: "npm audit", description: "Check for known vulnerabilities", category: "npm", tags: ["audit", "security", "vulnerability", "check"] },
  { command: "npm audit fix", description: "Automatically fix vulnerabilities", category: "npm", tags: ["audit", "fix", "security", "patch"] },
  { command: "npm publish --access public", description: "Publish package to npm registry", category: "npm", tags: ["publish", "release", "deploy", "npm"] },
  { command: "npm version <patch|minor|major>", description: "Bump package version", category: "npm", tags: ["version", "bump", "release", "semver"] },
  { command: "npx <package>", description: "Run a package without installing globally", category: "npm", tags: ["npx", "run", "execute", "temporary"] },
  { command: "npm init -y", description: "Create package.json with defaults", category: "npm", tags: ["init", "create", "new", "package"] },

  // === FILESYSTEM ===
  { command: "find . -name '<pattern>' -type f", description: "Find files matching name pattern", category: "filesystem", tags: ["find", "search", "file", "name", "pattern"] },
  { command: "find . -type f -name '*.js' | head -20", description: "Find JavaScript files (first 20)", category: "filesystem", tags: ["find", "javascript", "js", "files"] },
  { command: "grep -r '<pattern>' .", description: "Search for pattern in all files recursively", category: "filesystem", tags: ["grep", "search", "find", "text", "pattern", "recursive"] },
  { command: "grep -ri '<pattern>' .", description: "Case-insensitive recursive search", category: "filesystem", tags: ["grep", "search", "case-insensitive", "text"] },
  { command: "grep -rl '<pattern>' .", description: "List files matching pattern", category: "filesystem", tags: ["grep", "files", "list", "matching"] },
  { command: "du -sh * | sort -hr | head -10", description: "Show top 10 largest files/dirs", category: "filesystem", tags: ["disk", "usage", "size", "largest", "space"] },
  { command: "wc -l <file>", description: "Count lines in a file", category: "filesystem", tags: ["count", "lines", "wc", "file"] },
  { command: "sed -i 's/<old>/<new>/g' <file>", description: "Replace text in file (in-place)", category: "filesystem", tags: ["sed", "replace", "substitute", "find-replace"] },
  { command: "awk '{print $1}' <file>", description: "Print first column of each line", category: "filesystem", tags: ["awk", "column", "extract", "field"] },
  { command: "xargs -I {} <command> {}", description: "Run command for each stdin item", category: "filesystem", tags: ["xargs", "pipe", "batch", "each"] },
  { command: "tar -czf <archive>.tar.gz <dir>", description: "Create compressed tar archive", category: "filesystem", tags: ["tar", "compress", "archive", "zip", "gzip"] },
  { command: "tar -xzf <archive>.tar.gz", description: "Extract compressed tar archive", category: "filesystem", tags: ["tar", "extract", "uncompress", "unzip"] },
  { command: "ln -s <target> <link>", description: "Create a symbolic link", category: "filesystem", tags: ["link", "symlink", "shortcut", "symbolic"] },
  { command: "chmod +x <file>", description: "Make file executable", category: "filesystem", tags: ["chmod", "permission", "executable"] },
  { command: "rsync -avz <src> <dest>", description: "Sync files between locations efficiently", category: "filesystem", tags: ["rsync", "sync", "copy", "backup"] },

  // === SHELL / PROCESS ===
  { command: "ps aux | grep <process>", description: "Find process by name", category: "shell", tags: ["process", "find", "running", "ps"] },
  { command: "kill -9 <pid>", description: "Force kill a process by PID", category: "shell", tags: ["kill", "force", "process", "terminate"] },
  { command: "lsof -i :<port>", description: "Find process using a port", category: "shell", tags: ["port", "process", "lsof", "network", "listen"] },
  { command: "env | grep <var>", description: "Show environment variable value", category: "shell", tags: ["env", "variable", "environment", "show"] },
  { command: "export <VAR>=<value>", description: "Set environment variable", category: "shell", tags: ["export", "set", "variable", "environment"] },
  { command: "alias <name>='<command>'", description: "Create a command alias", category: "shell", tags: ["alias", "shortcut", "command"] },
  { command: "history | grep <pattern>", description: "Search command history", category: "shell", tags: ["history", "search", "past", "commands"] },
  { command: "which <command>", description: "Show full path of a command", category: "shell", tags: ["which", "path", "location", "binary"] },
  { command: "nohup <command> &", description: "Run command that persists after logout", category: "shell", tags: ["nohup", "background", "persist", "daemon"] },
  { command: "watch -n <seconds> '<command>'", description: "Run command repeatedly at intervals", category: "shell", tags: ["watch", "repeat", "monitor", "interval"] },

  // === TYPESCRIPT / BUILD ===
  { command: "tsc --noEmit", description: "Type-check without emitting files", category: "typescript", tags: ["typescript", "typecheck", "check", "types"] },
  { command: "tsc --init", description: "Create tsconfig.json with defaults", category: "typescript", tags: ["typescript", "init", "config", "setup"] },
  { command: "tsc -w", description: "Watch mode for TypeScript compilation", category: "typescript", tags: ["typescript", "watch", "compile", "continuous"] },
  { command: "npx tsc", description: "Run TypeScript compiler via npx", category: "typescript", tags: ["typescript", "compile", "build"] },

  // === PYTHON ===
  { command: "pip install <package>", description: "Install a Python package", category: "python", tags: ["pip", "install", "package", "python"] },
  { command: "pip install -r requirements.txt", description: "Install all packages from requirements file", category: "python", tags: ["pip", "requirements", "install", "python"] },
  { command: "python -m venv .venv", description: "Create a Python virtual environment", category: "python", tags: ["python", "venv", "virtual", "environment"] },
  { command: "source .venv/bin/activate", description: "Activate Python virtual environment", category: "python", tags: ["python", "activate", "venv", "environment"] },
  { command: "pytest", description: "Run Python tests with pytest", category: "python", tags: ["pytest", "test", "python", "spec"] },

  // === NETWORK ===
  { command: "curl -s <url>", description: "Fetch URL content silently", category: "network", tags: ["curl", "fetch", "http", "request", "url"] },
  { command: "curl -X POST -H 'Content-Type: application/json' -d '<body>' <url>", description: "Send POST request with JSON body", category: "network", tags: ["curl", "post", "http", "json", "api"] },
  { command: "curl -o <file> <url>", description: "Download file from URL", category: "network", tags: ["curl", "download", "file", "save"] },
  { command: "ssh <user>@<host>", description: "Connect to remote server via SSH", category: "network", tags: ["ssh", "connect", "remote", "server"] },
  { command: "scp <file> <user>@<host>:<path>", description: "Copy file to remote server", category: "network", tags: ["scp", "copy", "remote", "transfer", "upload"] },
  { command: "ping <host>", description: "Test network connectivity to host", category: "network", tags: ["ping", "test", "network", "connectivity"] },
  { command: "netstat -tlnp", description: "Show all listening TCP ports", category: "network", tags: ["netstat", "ports", "listening", "network", "tcp"] },

  // === GIT WORKTREE ===
  { command: "git worktree add <path> <branch>", description: "Create a new worktree for a branch", category: "git", tags: ["worktree", "branch", "parallel", "checkout"] },
  { command: "git worktree list", description: "List all worktrees", category: "git", tags: ["worktree", "list", "show"] },
  { command: "git worktree remove <path>", description: "Remove a worktree", category: "git", tags: ["worktree", "remove", "delete", "clean"] },

  // === MISC DEV ===
  { command: "jq '.' <file.json>", description: "Pretty-print JSON file", category: "tools", tags: ["jq", "json", "pretty", "format", "parse"] },
  { command: "jq '.<key>' <file.json>", description: "Extract value from JSON by key", category: "tools", tags: ["jq", "json", "extract", "value", "key"] },
  { command: "code .", description: "Open current directory in VS Code", category: "tools", tags: ["vscode", "code", "open", "editor"] },
  { command: "gh repo clone <repo>", description: "Clone a GitHub repository", category: "tools", tags: ["github", "clone", "repo", "download"] },
  { command: "gh pr create --fill", description: "Create a pull request with auto-filled info", category: "tools", tags: ["github", "pr", "create", "pull request"] },
  { command: "gh issue list", description: "List GitHub issues", category: "tools", tags: ["github", "issue", "list", "show"] },
];
