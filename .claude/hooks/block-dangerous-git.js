#!/usr/bin/env node
import fs from "node:fs";

try {
  const input = fs.readFileSync(0, "utf-8");
  const parsed = JSON.parse(input);
  const command = parsed?.tool_input?.command || "";

  const dangerousPatterns = [
    "git push",
    "git reset --hard",
    "git clean -fd",
    "git clean -f",
    "git branch -D",
    "git checkout .",
    "git restore .",
    "push --force",
    "reset --hard",
  ];

  for (const pattern of dangerousPatterns) {
    if (command.includes(pattern)) {
      console.error(
        `BLOCKED: '${command}' matches dangerous pattern '${pattern}'. The user has prevented you from doing this.`
      );
      process.exit(2);
    }
  }

  process.exit(0);
} catch (err) {
  process.exit(0);
}
