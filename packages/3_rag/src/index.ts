#!/usr/bin/env node
import { Command } from 'commander';
import { addCommand } from './commands/add';
import { startCommand } from './commands/start';
import { env } from '@demo/common';

const main = () => {
  if (!process.env.OPENAI_API_KEY) {
    console.error(
      'OPENAI_API_KEY 未设置，请通过 `OPENAI_API_KEY=<your-openai-api-key> DATABASE_URL=<your-database-url> npx tsx src/index.ts` 命令启动'
    );
    process.exit(1);
  }
  if (!env.DATABASE_URL) {
    console.error(
      'DATABASE_URL 未设置，请通过 `OPENAI_API_KEY=<your-openai-api-key> DATABASE_URL=<your-database-url> npx tsx src/index.ts` 命令启动'
    );
    process.exit(1);
  }

  const program = new Command();

  program.name('rag').description('RAG (Retrieval Augmented Generation) CLI 工具').version('1.0.0');

  program.addCommand(addCommand);
  program.addCommand(startCommand);

  program.parse();
};

main();
