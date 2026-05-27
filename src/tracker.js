import { readdirSync, existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
/**
 * Manages command usage history for learning patterns.
 * Stores data in ~/.cmdseek/usage.json
 */
export class UsageTracker {
    dataDir;
    usageFile;
    constructor(dataDir) {
        this.dataDir = dataDir ?? join(homedir(), ".cmdseek");
        this.usageFile = join(this.dataDir, "usage.json");
    }
    /**
     * Record a command usage.
     */
    record(command, directory, success) {
        const records = this.load();
        records.push({
            command,
            timestamp: new Date().toISOString(),
            directory,
            success,
        });
        // Keep last 10000 records to prevent unbounded growth
        const trimmed = records.slice(-10000);
        this.save(trimmed);
    }
    /**
     * Load all usage records.
     */
    load() {
        if (!existsSync(this.usageFile))
            return [];
        try {
            const data = readFileSync(this.usageFile, "utf-8");
            return JSON.parse(data);
        }
        catch {
            return [];
        }
    }
    /**
     * Save usage records to disk.
     */
    save(records) {
        if (!existsSync(this.dataDir)) {
            mkdirSync(this.dataDir, { recursive: true });
        }
        writeFileSync(this.usageFile, JSON.stringify(records, null, 2), "utf-8");
    }
    /**
     * Clear all usage data.
     */
    clear() {
        if (existsSync(this.usageFile)) {
            writeFileSync(this.usageFile, "[]", "utf-8");
        }
    }
    /**
     * Detect context hints from the current directory.
     */
    static detectContext(dir) {
        let entries = [];
        try {
            entries = readdirSync(dir);
        }
        catch {
            // Permission denied or doesn't exist
        }
        const hasFile = (name) => entries.includes(name);
        const hasDir = (name) => {
            try {
                return entries.includes(name);
            }
            catch {
                return false;
            }
        };
        // Check for .git directory (walk up to find it)
        let isGitRepo = hasDir(".git");
        if (!isGitRepo) {
            // Check parent directories up to root
            let current = dir;
            for (let i = 0; i < 10; i++) {
                const parent = join(current, "..");
                if (parent === current)
                    break;
                try {
                    if (readdirSync(parent).includes(".git")) {
                        isGitRepo = true;
                        break;
                    }
                }
                catch {
                    break;
                }
                current = parent;
            }
        }
        return {
            isGitRepo,
            isNodeProject: hasFile("package.json"),
            isDockerProject: hasFile("docker-compose.yml") || hasFile("docker-compose.yaml") || hasFile("Dockerfile"),
            isRustProject: hasFile("Cargo.toml"),
            isPythonProject: hasFile("pyproject.toml") || hasFile("requirements.txt") || hasFile("setup.py"),
            directoryName: dir.split("/").pop() ?? dir,
        };
    }
    /**
     * Get usage statistics summary.
     */
    getStats() {
        const records = this.load();
        const freq = new Map();
        for (const r of records) {
            freq.set(r.command, (freq.get(r.command) ?? 0) + 1);
        }
        const topCommands = [...freq.entries()]
            .map(([command, count]) => ({ command, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);
        return {
            totalCommands: records.length,
            uniqueCommands: freq.size,
            topCommands,
        };
    }
}
//# sourceMappingURL=tracker.js.map