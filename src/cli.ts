#!/usr/bin/env node
/**
 * cmdseek — Fast command search CLI that learns from your usage.
 */

import { Command } from "commander";
import chalk from "chalk";
import { CommandSearch } from "./search.js";
import { UsageTracker } from "./tracker.js";
import type { ContextHints } from "./types.js";

const program = new Command();
const search = new CommandSearch();
const tracker = new UsageTracker();

function formatResult(index: number, entry: { command: string; description: string; category: string; tags: string[] }, reason: string): string {
  const num = chalk.dim(`${index + 1}.`);
  const cmd = chalk.bold.cyan(entry.command);
  const desc = chalk.white(entry.description);
  const cat = chalk.dim(`[${entry.category}]`);
  const match = chalk.dim(`(${reason})`);
  return `  ${num} ${cmd} — ${desc} ${cat} ${match}`;
}

function printResults(results: Array<{ entry: { command: string; description: string; category: string; tags: string[] }; score: number; matchReason: string }>): void {
  if (results.length === 0) {
    console.log(chalk.yellow("  No commands found. Try a different query."));
    return;
  }

  for (let i = 0; i < results.length; i++) {
    console.log(formatResult(i, results[i].entry, results[i].matchReason));
  }
}

function getContext(): ContextHints {
  return UsageTracker.detectContext(process.cwd());
}

function printContextBanner(hints: ContextHints): void {
  const badges: string[] = [];
  if (hints.isGitRepo) badges.push(chalk.green("git"));
  if (hints.isNodeProject) badges.push(chalk.blue("node"));
  if (hints.isDockerProject) badges.push(chalk.blue("docker"));
  if (hints.isRustProject) badges.push(chalk.red("rust"));
  if (hints.isPythonProject) badges.push(chalk.yellow("python"));

  if (badges.length > 0) {
    console.log(chalk.dim(`  Context: ${badges.join(" ")} in ${hints.directoryName}`));
    console.log();
  }
}

program
  .name("cmdseek")
  .description("Fast command search CLI that learns from your usage")
  .version("1.0.0");

program
  .command("search <query>")
  .description("Search for commands matching query")
  .option("-n, --limit <number>", "Number of results", "10")
  .option("--no-context", "Disable context-aware boosting")
  .action((query: string, opts: { limit: string; context: boolean }) => {
    const limit = parseInt(opts.limit, 10) || 10;
    const hints = getContext();

    if (opts.context) printContextBanner(hints);

    const results = opts.context
      ? search.searchWithContext(query, hints, limit)
      : search.search(query, limit);

    printResults(results);
  });

program
  .command("recent")
  .description("Show recently used commands")
  .option("-n, --limit <number>", "Number of results", "10")
  .action((opts: { limit: string }) => {
    const limit = parseInt(opts.limit, 10) || 10;
    const results = tracker.load();
    if (results.length === 0) {
      console.log(chalk.dim("  No usage history yet. Use 'cmdseek record <command>' to start tracking."));
      return;
    }
    const recent = search.getRecent(limit);
    console.log(chalk.bold("  Recently Used Commands:"));
    console.log();
    printResults(recent);
  });

program
  .command("categories")
  .description("List all command categories")
  .action(() => {
    const categories = search.getCategories();
    console.log(chalk.bold("  Available Categories:"));
    console.log();
    for (const cat of categories) {
      const count = search.getByCategory(cat).length;
      console.log(`  ${chalk.cyan(cat.padEnd(15))} ${chalk.dim(`(${count} commands)`)}`);
    }
    console.log();
    console.log(chalk.dim(`  Total: ${search.getAllCommands().length} commands`));
  });

program
  .command("list [category]")
  .description("List all commands, optionally filtered by category")
  .action((category?: string) => {
    const commands = category
      ? search.getByCategory(category)
      : search.getAllCommands();

    if (commands.length === 0) {
      console.log(chalk.yellow(`  No commands found for category '${category}'.`));
      console.log(chalk.dim("  Use 'cmdseek categories' to see available categories."));
      return;
    }

    const title = category ? `Commands in '${category}'` : "All Commands";
    console.log(chalk.bold(`  ${title}:`));
    console.log();

    for (const cmd of commands) {
      console.log(`  ${chalk.cyan(cmd.command.padEnd(50))} ${chalk.white(cmd.description)}`);
    }
  });

program
  .command("record <command>")
  .description("Record a command usage for learning")
  .option("--fail", "Mark command as failed (non-zero exit)")
  .action((command: string, opts: { fail?: boolean }) => {
    tracker.record(command, process.cwd(), !opts.fail);
    console.log(chalk.dim(`  Recorded: ${command}`));
  });

program
  .command("stats")
  .description("Show usage statistics")
  .action(() => {
    const stats = tracker.getStats();
    if (stats.totalCommands === 0) {
      console.log(chalk.dim("  No usage data yet. Use 'cmdseek record <command>' to start tracking."));
      return;
    }
    console.log(chalk.bold("  Usage Statistics:"));
    console.log();
    console.log(`  Total commands tracked: ${chalk.cyan(String(stats.totalCommands))}`);
    console.log(`  Unique commands:        ${chalk.cyan(String(stats.uniqueCommands))}`);
    console.log();
    if (stats.topCommands.length > 0) {
      console.log(chalk.bold("  Top Commands:"));
      for (const { command, count } of stats.topCommands) {
        console.log(`  ${chalk.cyan(command.padEnd(45))} ${chalk.bold(String(count))}x`);
      }
    }
  });

program
  .command("context")
  .description("Show detected context for current directory")
  .action(() => {
    const hints = getContext();
    console.log(chalk.bold("  Detected Context:"));
    console.log();
    console.log(`  Directory:    ${chalk.cyan(hints.directoryName)}`);
    console.log(`  Git repo:     ${hints.isGitRepo ? chalk.green("Yes") : chalk.red("No")}`);
    console.log(`  Node.js:      ${hints.isNodeProject ? chalk.green("Yes") : chalk.red("No")}`);
    console.log(`  Docker:       ${hints.isDockerProject ? chalk.green("Yes") : chalk.red("No")}`);
    console.log(`  Rust:         ${hints.isRustProject ? chalk.green("Yes") : chalk.red("No")}`);
    console.log(`  Python:       ${hints.isPythonProject ? chalk.green("Yes") : chalk.red("No")}`);
  });

// Default action: treat first arg as search query
program
  .argument("[query]", "Search query (shorthand for 'search')")
  .action((query?: string) => {
    if (query) {
      const hints = getContext();
      printContextBanner(hints);
      const results = search.searchWithContext(query, hints, 10);
      printResults(results);
    } else {
      program.help();
    }
  });

program.parse();
