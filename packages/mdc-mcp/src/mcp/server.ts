import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { logger } from '../utils/logger';

import { type BaseTool } from '../utils/base-tool';
import { FetchComponentListTool } from './component-list';
import { FetchComponentDetailTool } from './component';

const SERVER_NAME = 'mdc-mcp';

export const createServer = (componentsDir: string) => {
  logger.debug(`创建 MCP 服务器: ${SERVER_NAME}`);
  const server = new McpServer({ name: SERVER_NAME, version: '1.0.0' });

  const tools: BaseTool[] = [
    new FetchComponentDetailTool(componentsDir),
    new FetchComponentListTool(componentsDir),
  ];

  logger.debug(`注册 ${tools.length} 个工具函数`);
  tools.forEach((tool) => {
    logger.debug(`注册工具函数: ${tool.name}`);
    tool.register(server);
  });

  return server;
};
