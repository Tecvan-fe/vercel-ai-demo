#!/usr/bin/env node

import path from 'path';
import fs from 'fs';

import { Command } from 'commander';
import { logger } from './utils/logger';

import { startAction } from './actions/start';
import { serveAction } from './actions/serve';

// 默认组件文档目录
const DEFAULT_COMPONENTS_DIR = process.env.DEFAULT_DOCS_DIR;

const main = () => {
  // 创建命令行程序
  const program = new Command();

  // 设置版本号和描述
  program
    .name('mdc-mcp')
    .description('MCP server for common mdc docs library')
    .version(
      JSON.parse(fs.readFileSync(path.resolve(__dirname, '../package.json'), 'utf-8')).version
    );

  // 添加全局选项
  program.option(
    '-d, --components-dir <dir>',
    '组件文档目录路径，默认为 @flow-infra/components-doc 的 docs/resource/components',
    DEFAULT_COMPONENTS_DIR
  );

  // 添加 serve 命令 - 启动 HTTP 服务器
  program
    .command('serve')
    .description('Start the MCP HTTP server')
    .option('-p, --port <port>', 'Port to listen on', '3000')
    .action(async (options) => {
      const port = parseInt(options.port, 10);
      const { componentsDir } = program.opts();
      if (!componentsDir) {
        logger.error('请设置 components-dir 选项');
        process.exit(1);
      }
      logger.info(`启动 HTTP 服务，端口: ${port}，组件目录: ${componentsDir}`);
      await serveAction(port, componentsDir);
    });

  // 添加 start 命令 - 在命令行中直接运行 MCP 服务
  program
    .command('start')
    .description('Start the MCP service in command line mode')
    .action(async () => {
      const { componentsDir } = program.opts();
      if (!componentsDir) {
        logger.error('请设置 components-dir 选项');
        process.exit(1);
      }
      logger.info(`启动命令行交互模式，组件目录: ${componentsDir}`);
      await startAction(componentsDir);
    });

  const SPLIT_LINE = `${'='.repeat(35)}`;
  // 解析命令行参数
  logger.success(
    `\n🎉 欢迎使用 Common MDC MCP CLI! 🎉\n${
      SPLIT_LINE
    }\n🚀 让我们一起探索组件的奥秘吧!   🚀\n${SPLIT_LINE}`
  );
  program.parse(process.argv);

  // 如果没有提供命令，显示帮助信息
  if (!process.argv.slice(2).length) {
    program.outputHelp();
  }
};

// 执行主函数
main();
