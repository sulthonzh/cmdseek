import Fuse from "fuse.js";
import { COMMANDS } from "./commands.js";
/**
 * Search engine for commands using fuzzy matching + context awareness.
 */
export class CommandSearch {
    fuse;
    commands;
    usageData;
    constructor(commands, usageData) {
        this.commands = commands ?? [...COMMANDS];
        this.usageData = usageData ?? [];
        this.fuse = new Fuse(this.commands, {
            keys: [
                { name: "command", weight: 0.3 },
                { name: "description", weight: 0.35 },
                { name: "category", weight: 0.1 },
                { name: "tags", weight: 0.25 },
            ],
            threshold: 0.4,
            includeScore: true,
            ignoreLocation: true,
        });
    }
    /**
     * Search commands by query string.
     */
    search(query, limit = 10) {
        if (!query.trim())
            return [];
        const fuseResults = this.fuse.search(query, { limit: limit * 2 });
        const results = fuseResults.map((r) => ({
            entry: r.item,
            score: r.score ?? 1,
            matchReason: this.describeMatch(r.item, query),
        }));
        // Boost frequently used commands
        const boosted = this.applyUsageBoost(results);
        return boosted.slice(0, limit);
    }
    /**
     * Search with context awareness. Boosts commands from relevant categories.
     */
    searchWithContext(query, context, limit = 10) {
        const baseResults = this.search(query, limit * 2);
        const boosted = baseResults.map((r) => {
            let scoreAdjust = 0;
            // Boost relevant categories based on context
            if (context.isGitRepo && r.entry.category === "git")
                scoreAdjust -= 0.05;
            if (context.isNodeProject && (r.entry.category === "npm" || r.entry.category === "typescript"))
                scoreAdjust -= 0.05;
            if (context.isDockerProject && r.entry.category === "docker")
                scoreAdjust -= 0.05;
            if (context.isRustProject && r.entry.category === "rust")
                scoreAdjust -= 0.05;
            if (context.isPythonProject && r.entry.category === "python")
                scoreAdjust -= 0.05;
            return { ...r, score: Math.max(0, r.score + scoreAdjust) };
        });
        // Re-sort by score (lower is better)
        boosted.sort((a, b) => a.score - b.score);
        return boosted.slice(0, limit);
    }
    /**
     * Get commands by category.
     */
    getByCategory(category) {
        return this.commands.filter((c) => c.category === category);
    }
    /**
     * Get all available categories.
     */
    getCategories() {
        const cats = new Set(this.commands.map((c) => c.category));
        return [...cats].sort();
    }
    /**
     * Get recently used commands from usage data.
     */
    getRecent(limit = 10) {
        const sorted = [...this.usageData]
            .filter((u) => u.success)
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        const seen = new Set();
        const results = [];
        for (const usage of sorted) {
            if (seen.has(usage.command))
                continue;
            seen.add(usage.command);
            const entry = this.commands.find((c) => c.command === usage.command);
            if (entry) {
                results.push({
                    entry,
                    score: 0,
                    matchReason: "Recently used",
                });
            }
            else {
                // Custom command not in database
                results.push({
                    entry: {
                        command: usage.command,
                        description: "Custom command from history",
                        category: "custom",
                        tags: [],
                    },
                    score: 0,
                    matchReason: "Recently used",
                });
            }
            if (results.length >= limit)
                break;
        }
        return results;
    }
    /**
     * Get command usage frequency stats.
     */
    getFrequencyStats() {
        const freq = new Map();
        for (const u of this.usageData) {
            freq.set(u.command, (freq.get(u.command) ?? 0) + 1);
        }
        return freq;
    }
    /**
     * Get all known commands.
     */
    getAllCommands() {
        return [...this.commands];
    }
    applyUsageBoost(results) {
        const freq = this.getFrequencyStats();
        if (freq.size === 0)
            return results;
        return results.map((r) => {
            const count = freq.get(r.entry.command) ?? 0;
            if (count === 0)
                return r;
            // Boost score based on frequency (max -0.1 for very frequent commands)
            const boost = Math.min(0.1, count * 0.02);
            return { ...r, score: Math.max(0, r.score - boost) };
        });
    }
    describeMatch(entry, query) {
        const q = query.toLowerCase();
        const words = q.split(/\s+/);
        if (entry.command.toLowerCase().includes(q))
            return "Exact command match";
        if (entry.description.toLowerCase().includes(q))
            return "Description match";
        for (const word of words) {
            if (entry.command.toLowerCase().includes(word))
                return "Partial command match";
            if (entry.tags.some((t) => t.includes(word)))
                return "Tag match: " + word;
        }
        if (entry.category.toLowerCase().includes(q))
            return "Category match";
        return "Fuzzy match";
    }
}
//# sourceMappingURL=search.js.map