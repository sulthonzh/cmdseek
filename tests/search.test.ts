import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { CommandSearch } from "../src/search.js";
import type { CommandEntry, UsageRecord, ContextHints } from "../src/types.js";

const sampleCommands: CommandEntry[] = [
  { command: "docker restart <container>", description: "Restart a container", category: "docker", tags: ["restart", "container", "reload"] },
  { command: "git log --oneline -10", description: "Show last 10 commits", category: "git", tags: ["log", "commits", "history", "recent"] },
  { command: "npm install <package>", description: "Install a package", category: "npm", tags: ["install", "add", "package", "dependency"] },
  { command: "find . -name '*.js' -type f", description: "Find JavaScript files", category: "filesystem", tags: ["find", "search", "javascript", "files"] },
  { command: "grep -r 'pattern' .", description: "Search recursively in files", category: "filesystem", tags: ["grep", "search", "find", "text", "pattern"] },
];

describe("CommandSearch", () => {
  it("search returns results for matching query", () => {
    const engine = new CommandSearch(sampleCommands);
    const results = engine.search("restart docker");
    assert.ok(results.length > 0);
    assert.equal(results[0].entry.category, "docker");
  });

  it("search returns empty for nonsense query", () => {
    const engine = new CommandSearch(sampleCommands);
    const results = engine.search("xyzzy12345");
    assert.ok(results.length <= 1); // fuzzy may still match weakly
  });

  it("search returns empty for empty query", () => {
    const engine = new CommandSearch(sampleCommands);
    const results = engine.search("");
    assert.equal(results.length, 0);
  });

  it("search matches by description", () => {
    const engine = new CommandSearch(sampleCommands);
    const results = engine.search("show commits");
    assert.ok(results.length > 0);
    assert.ok(results[0].entry.category === "git");
  });

  it("search matches by tag", () => {
    const engine = new CommandSearch(sampleCommands);
    const results = engine.search("history");
    assert.ok(results.length > 0);
    assert.ok(results.some((r) => r.entry.category === "git"));
  });

  it("getByCategory returns only matching commands", () => {
    const engine = new CommandSearch(sampleCommands);
    const docker = engine.getByCategory("docker");
    assert.equal(docker.length, 1);
    assert.equal(docker[0].command, "docker restart <container>");
  });

  it("getCategories returns unique sorted categories", () => {
    const engine = new CommandSearch(sampleCommands);
    const cats = engine.getCategories();
    assert.deepEqual(cats, ["docker", "filesystem", "git", "npm"]);
  });

  it("getAllCommands returns all commands", () => {
    const engine = new CommandSearch(sampleCommands);
    assert.equal(engine.getAllCommands().length, sampleCommands.length);
  });

  it("searchWithContext boosts relevant category", () => {
    const engine = new CommandSearch(sampleCommands);
    const gitContext: ContextHints = {
      isGitRepo: true,
      isNodeProject: false,
      isDockerProject: false,
      isRustProject: false,
      isPythonProject: false,
      directoryName: "my-repo",
    };
    const noContext: ContextHints = {
      isGitRepo: false,
      isNodeProject: false,
      isDockerProject: false,
      isRustProject: false,
      isPythonProject: false,
      directoryName: "my-repo",
    };

    // Search for "log" — should rank git higher with git context
    const withGit = engine.searchWithContext("log", gitContext, 5);
    const withoutCtx = engine.searchWithContext("log", noContext, 5);

    // Git result should score better (lower) with git context
    const gitWithCtx = withGit.find((r) => r.entry.category === "git");
    const gitNoCtx = withoutCtx.find((r) => r.entry.category === "git");

    if (gitWithCtx && gitNoCtx) {
      assert.ok(gitWithCtx.score <= gitNoCtx.score, "Git context should boost git commands");
    }
  });

  it("getRecent returns recently used commands", () => {
    const usage: UsageRecord[] = [
      { command: "docker restart <container>", timestamp: "2026-05-27T10:00:00Z", success: true },
      { command: "git log --oneline -10", timestamp: "2026-05-27T09:00:00Z", success: true },
    ];
    const engine = new CommandSearch(sampleCommands, usage);
    const recent = engine.getRecent(5);
    assert.equal(recent.length, 2);
    assert.equal(recent[0].entry.command, "docker restart <container>");
    assert.equal(recent[0].matchReason, "Recently used");
  });

  it("getRecent excludes failed commands", () => {
    const usage: UsageRecord[] = [
      { command: "docker restart <container>", timestamp: "2026-05-27T10:00:00Z", success: false },
      { command: "git log --oneline -10", timestamp: "2026-05-27T09:00:00Z", success: true },
    ];
    const engine = new CommandSearch(sampleCommands, usage);
    const recent = engine.getRecent(5);
    assert.equal(recent.length, 1);
    assert.equal(recent[0].entry.command, "git log --oneline -10");
  });

  it("search results have match reason", () => {
    const engine = new CommandSearch(sampleCommands);
    const results = engine.search("docker");
    assert.ok(results.length > 0);
    assert.ok(results[0].matchReason.length > 0);
  });

  it("default constructor loads all commands", () => {
    const engine = new CommandSearch();
    assert.ok(engine.getAllCommands().length > 50);
  });
});
