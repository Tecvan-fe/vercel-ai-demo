import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { logger } from '../utils/logger';

import { createServer } from '../mcp/server';

/**
 * 在命令行模式下启动 MCP 服务
 * @param componentsDir 组件文档目录
 */
export const startAction = async (componentsDir: string): Promise<void> => {
  try {
    logger.info(`正在创建 MCP 服务器，组件目录: ${componentsDir}`);
    const server = createServer(componentsDir);
    const transport = new StdioServerTransport();
    logger.debug('正在连接 StdioServerTransport');
    server.connect(transport);

    logger.success('MDC MCP 服务已启动（命令行模式）');
    logger.info(`组件文档目录: ${componentsDir}`);

    logger.info('使用 Ctrl+C 退出服务');
    // 保持进程运行，直到用户手动退出
    return new Promise<void>((resolve) => {
      process.on('SIGINT', () => {
        resolve();
        logger.info('正在关闭 MCP 服务...');
        process.exit(0);
      });
    });
  } catch (error) {
    logger.error(`启动 MCP 服务失败: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
};
