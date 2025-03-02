#!/usr/bin/env node

import { program } from 'commander';
import { logger } from '@demo/common';
import { generateReadme } from './generator';
import { version } from '../package.json';

// 主函数
async function main() {
  // 定义命令行参数
  program
    .version(version)
    .description('基于LLM的README自动生成机器人')
    .requiredOption('-d, --dir <directory>', '指定需要分析的目录', '.')
    .option('-o, --output <filename>', '指定输出文件名', 'README.auto.md')
    .option('-e, --extensions <extensions>', '指定需要分析的文件扩展名', 'ts,tsx')
    .option('-v, --verbose', '输出调试信息', false)
    .parse(process.argv);

  const options = program.opts();

  try {
    logger.info(`开始分析目录: ${options.dir}`);

    await generateReadme({
      targetDir: options.dir,
      outputFile: options.output,
      extensions: options.extensions.split(','),
      verbose: options.verbose,
    });

    logger.success(`README生成成功: ${options.output}`);
  } catch (error) {
    logger.error(`生成README失败: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}

// 执行主函数
main();
