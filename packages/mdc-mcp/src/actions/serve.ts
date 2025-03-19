import morgan from 'morgan';
import express from 'express';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { logger } from '../utils/logger';

import { createServer } from '../mcp/server';

const createApp = () => {
  const app = express();
  app.use(morgan('tiny'));
  // app.use(express.json());
  // app.use(express.urlencoded({ extended: true }));
  logger.debug('Express 应用创建成功');
  return app;
};

/**
 * 启动 HTTP 服务器
 * @param port 端口号
 * @param componentsDir 组件文档目录
 */
export const serveAction = (port: number, componentsDir: string) => {
  logger.info(`正在创建 MCP 服务器，组件目录: ${componentsDir}`);
  const server = createServer(componentsDir);
  try {
    const app = createApp();

    let transport: SSEServerTransport;
    app.get('/sse', async (req, res) => {
      logger.debug(`收到 SSE 连接请求: ${req.ip}`);
      transport = new SSEServerTransport('/messages', res);
      await server.connect(transport);
    });

    app.post('/messages', async (req, res) => {
      // Note: to support multiple simultaneous connections, these messages will
      // need to be routed to a specific matching transport. (This logic isn't
      // implemented here, for simplicity.)
      logger.debug(`收到消息请求: ${req.ip}`);
      await transport.handlePostMessage(req, res);
    });

    app.listen(port, () => {
      logger.success(`MCP 服务器已启动，监听端口: ${port}`);
    });
  } catch (error) {
    logger.error(`启动 MCP 服务器失败: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
};
