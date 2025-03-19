import { describe, it, expect, vi, beforeEach } from 'vitest';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

import { createServer } from '../../src/mcp/server';
import { FetchComponentListTool } from '../../src/mcp/component-list';
import { FetchComponentDetailTool } from '../../src/mcp/component';

// 模拟MCP库
vi.mock('@modelcontextprotocol/sdk/server/mcp.js', () => ({
  McpServer: vi.fn().mockImplementation(() => ({
    name: 'mock-server',
    tool: vi.fn(),
  })),
}));

// 模拟组件工具
vi.mock('../../src/mcp/component-list', () => ({
  FetchComponentListTool: vi.fn().mockImplementation(() => ({
    name: 'get_components_list',
    register: vi.fn(),
  })),
}));

vi.mock('../../src/mcp/component', () => ({
  FetchComponentDetailTool: vi.fn().mockImplementation(() => ({
    name: 'get_component_detail',
    register: vi.fn(),
  })),
}));

describe('MCP Server', () => {
  const mockComponentsDir = '/path/to/components';
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('应该创建MCP服务器实例', () => {
    const server = createServer(mockComponentsDir);

    expect(McpServer).toHaveBeenCalledWith({
      name: 'mdc-mcp',
      version: '1.0.0',
    });
    expect(server).toBeDefined();
  });

  it('应该创建并注册工具', () => {
    createServer(mockComponentsDir);

    // 验证工具被创建并传入了正确的参数
    expect(FetchComponentDetailTool).toHaveBeenCalledWith(mockComponentsDir);
    expect(FetchComponentListTool).toHaveBeenCalledWith(mockComponentsDir);
  });
});
