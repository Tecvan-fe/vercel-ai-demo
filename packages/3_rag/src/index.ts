#!/usr/bin/env node
import { Command } from 'commander';
import { addCommand } from './commands/add';

const main = () => {
  const program = new Command();

  program.name('rag').description('RAG (Retrieval Augmented Generation) CLI 工具').version('1.0.0');

  program.addCommand(addCommand);

  program.parse();
};

main();
