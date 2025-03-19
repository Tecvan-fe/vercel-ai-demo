import path from 'path';
import { spawn, type ChildProcess } from 'child_process';

import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';

describe('mdc-mcp http e2e tests', () => {
  let mcpClient: Client;
  let childProcess: ChildProcess;

  beforeAll(async () => {
    const fixturesDir = path.join(__dirname, 'fixtures');
    const port = Math.floor(Math.random() * (6553 - 1024) + 1024);
    // 启动 CLI 进程
    const cliPath = path.resolve(__dirname, '../src/cli.ts');
    childProcess = spawn('npx', [
      'tsx',
      cliPath,
      'serve',
      '--components-dir',
      fixturesDir,
      '--port',
      port.toString(),
    ]);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const transport = new SSEClientTransport(new URL(`http://localhost:${port}/sse`));

    mcpClient = new Client(
      {
        name: 'mdc-mcp-test-client',
        version: '1.0.0',
      },
      {
        capabilities: {
          prompts: {},
          resources: {},
          tools: {},
        },
      }
    );

    await mcpClient.connect(transport);
  });

  afterAll(async () => {
    if (mcpClient) {
      await mcpClient.close();
    }
    if (childProcess) {
      childProcess.kill();
    }
  });

  it('应该能够获取组件列表', async () => {
    // 调用 get_components_list 函数
    const result = await mcpClient.callTool({
      name: 'get_components_list',
      arguments: {},
    });

    // 验证结果
    expect(result.content).toBeDefined();
    const response = result.content[0];
    expect(response.text).toContain('- `Button` ');
    expect(response.text).toContain('- `Input` ');
    expect(response.text).toContain('- `Table` ');
    expect(response.text).toContain('- `Modal` ');
    expect(response.text).not.toContain('echo');
  });

  it('应该能够获取 Button 组件详情', async () => {
    // 调用 get_component_detail 函数
    const result = await mcpClient.callTool({
      name: 'get_component_detail',
      arguments: {
        componentName: 'button',
      },
    });

    // 验证结果
    expect(result.content).toBeDefined();
    const res = result.content[0].text;
    expect(res).toContain('Button 按钮');
    expect(res).toContain('按钮用于触发一个操作');
    expect(res).toContain('基本用法');
    expect(res).toContain('API');
  });

  it('获取不存在的组件应该返回错误', async () => {
    try {
      // 调用 get_component_detail 函数，使用不存在的组件名
      const res = await mcpClient.callTool({
        name: 'get_component_detail',
        arguments: {
          componentName: 'non-existent-component',
        },
      });
      // 如果没有抛出错误，测试应该失败
      expect(res.content).toBeDefined();
      expect(res.content[0].text).toContain('Component not found');
    } catch (error) {
      // 验证错误信息
      expect(error instanceof Error).toBe(true);
      expect((error as Error).message).toContain('Component not found');
    }
  });

  it('调用不存在的方法应该返回错误', async () => {
    try {
      // 调用不存在的方法
      await mcpClient.callTool({
        name: 'non_existent_method',
        arguments: {},
      });
      // 如果没有抛出错误，测试应该失败
      expect(true).toBe(false);
    } catch (error) {
      // 验证错误信息
      expect(error instanceof Error).toBe(true);
      expect((error as Error).message).toContain('Tool non_existent_method not found');
    }
  });
});
