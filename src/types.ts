/**
 * Command database entry
 */
export interface CommandEntry {
  /** The command to execute (with placeholders like <file>) */
  command: string;
  /** Short description of what the command does */
  description: string;
  /** Category: git, docker, npm, shell, filesystem, etc. */
  category: string;
  /** Tags for additional search context */
  tags: string[];
  /** Examples of usage */
  examples?: string[];
}

/**
 * Usage record for learning
 */
export interface UsageRecord {
  /** The command that was used */
  command: string;
  /** ISO timestamp of usage */
  timestamp: string;
  /** Working directory context */
  directory?: string;
  /** Whether the command succeeded (exit code 0) */
  success: boolean;
}

/**
 * Search result with relevance scoring
 */
export interface SearchResult {
  entry: CommandEntry;
  /** Relevance score (0 = perfect match, 1 = no match) */
  score: number;
  /** Why this result matched */
  matchReason: string;
}

/**
 * Context hints for better suggestions
 */
export interface ContextHints {
  /** Whether we're in a git repo */
  isGitRepo: boolean;
  /** Whether package.json exists (Node.js project) */
  isNodeProject: boolean;
  /** Whether docker-compose.yml exists */
  isDockerProject: boolean;
  /** Whether Cargo.toml exists (Rust project) */
  isRustProject: boolean;
  /** Whether pyproject.toml or requirements.txt exist */
  isPythonProject: boolean;
  /** Current directory name */
  directoryName: string;
}

export type SortMode = "relevance" | "recent" | "frequency";
