import { z } from 'zod';
import { describe, it, expect, vi } from 'vitest';

import { BaseTool } from '../../src/utils/base-tool';

// 创建一个继承BaseTool的具体实现类用于测试
class TestTool extends BaseTool {
  name = 'test_tool';
  description = 'Test tool for unit testing';
  schema = z.object({
    param1: z.string(),
    param2: z.number().optional(),
  });

  // 需要为异步方法，与BaseTool中的定义保持一致
  async execute(args: z.infer<typeof this.schema>) {
    // 模拟异步操作
    return Promise.resolve({
      content: [
        {
          type: 'text' as const,
          text: `Executed with: ${args.param1}, ${args.param2 || 'no param2'}`,
        },
      ],
    });
  }
}

describe('BaseTool', () => {
  it('应该能够创建具体工具实例', () => {
    const tool = new TestTool();
    expect(tool).toBeInstanceOf(BaseTool);
    expect(tool.name).toBe('test_tool');
    expect(tool.description).toBe('Test tool for unit testing');
  });

  it('应该能够注册到MCP服务器', () => {
    const mockServer = {
      tool: vi.fn(),
    };

    const tool = new TestTool();
    tool.register(mockServer as any);

    expect(mockServer.tool).toHaveBeenCalledTimes(1);
    expect(mockServer.tool).toHaveBeenCalledWith(
      'test_tool',
      'Test tool for unit testing',
      tool.schema.shape,
      expect.any(Function),
    );
  });

  it('应该能够执行工具函数', async () => {
    const tool = new TestTool();
    const result = await tool.execute({ param1: 'test' });

    expect(result).toEqual({
      content: [
        {
          type: 'text',
          text: 'Executed with: test, no param2',
        },
      ],
    });
  });

  it('应该能够处理所有必需的参数', async () => {
    const tool = new TestTool();
    const result = await tool.execute({ param1: 'test', param2: 42 });

    expect(result).toEqual({
      content: [
        {
          type: 'text',
          text: 'Executed with: test, 42',
        },
      ],
    });
  });
});
