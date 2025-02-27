#!/usr/bin/env node
import { Command } from 'commander';
import { createGenerateCommand } from './commands/generate';

const main = () => {
  const program = new Command();

  program.name('writer').description('基于 LLM 的自动写作机器人').version('1.0.0');

  // 注册命令
  program.addCommand(createGenerateCommand());

  // 解析命令行参数
  program.parse(process.argv);

  // 如果没有提供参数，显示帮助信息
  if (!program.args.length) {
    program.help();
  }
};

main();
