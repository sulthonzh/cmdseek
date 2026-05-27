import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { UsageTracker } from "../src/tracker.js";
import { mkdtempSync, existsSync, readFileSync, rmSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";

describe("UsageTracker", () => {
  it("record creates usage file", () => {
    const dir = mkdtempSync(join(tmpdir(), "cmdseek-test-"));
    const tracker = new UsageTracker(dir);
    tracker.record("git status", "/tmp", true);

    const file = join(dir, "usage.json");
    assert.ok(existsSync(file));

    const data = JSON.parse(readFileSync(file, "utf-8"));
    assert.equal(data.length, 1);
    assert.equal(data[0].command, "git status");
    assert.equal(data[0].success, true);

    rmSync(dir, { recursive: true });
  });

  it("load returns empty array for missing file", () => {
    const dir = mkdtempSync(join(tmpdir(), "cmdseek-test-"));
    const tracker = new UsageTracker(dir);
    const records = tracker.load();
    assert.equal(records.length, 0);
    rmSync(dir, { recursive: true });
  });

  it("clear empties the usage file", () => {
    const dir = mkdtempSync(join(tmpdir(), "cmdseek-test-"));
    const tracker = new UsageTracker(dir);
    tracker.record("git status", "/tmp", true);
    tracker.clear();

    const records = tracker.load();
    assert.equal(records.length, 0);
    rmSync(dir, { recursive: true });
  });

  it("getStats returns correct counts", () => {
    const dir = mkdtempSync(join(tmpdir(), "cmdseek-test-"));
    const tracker = new UsageTracker(dir);
    tracker.record("git status", "/tmp", true);
    tracker.record("git status", "/tmp", true);
    tracker.record("npm test", "/tmp", true);

    const stats = tracker.getStats();
    assert.equal(stats.totalCommands, 3);
    assert.equal(stats.uniqueCommands, 2);
    assert.equal(stats.topCommands[0].command, "git status");
    assert.equal(stats.topCommands[0].count, 2);

    rmSync(dir, { recursive: true });
  });

  it("detectContext identifies Node.js project", () => {
    const dir = mkdtempSync(join(tmpdir(), "cmdseek-test-"));
    writeFileSync(join(dir, "package.json"), "{}");
    const ctx = UsageTracker.detectContext(dir);
    assert.equal(ctx.isNodeProject, true);
    assert.equal(ctx.isDockerProject, false);
    rmSync(dir, { recursive: true });
  });

  it("detectContext identifies Docker project", () => {
    const dir = mkdtempSync(join(tmpdir(), "cmdseek-test-"));
    writeFileSync(join(dir, "docker-compose.yml"), "version: '3'");
    const ctx = UsageTracker.detectContext(dir);
    assert.equal(ctx.isDockerProject, true);
    rmSync(dir, { recursive: true });
  });

  it("detectContext identifies Python project", () => {
    const dir = mkdtempSync(join(tmpdir(), "cmdseek-test-"));
    writeFileSync(join(dir, "requirements.txt"), "flask");
    const ctx = UsageTracker.detectContext(dir);
    assert.equal(ctx.isPythonProject, true);
    rmSync(dir, { recursive: true });
  });

  it("detectContext returns directory name", () => {
    const dir = mkdtempSync(join(tmpdir(), "my-project-"));
    const ctx = UsageTracker.detectContext(dir);
    assert.ok(ctx.directoryName.startsWith("my-project-"));
    rmSync(dir, { recursive: true });
  });
});
