import { describe, it, expect, vi, beforeEach } from 'vitest';

import type { ComponentMeta } from '../../src/types';
import { FetchComponentListTool } from '../../src/mcp/component-list';

// 模拟ComponentService
vi.mock('../../src/services/component-service', () => ({
  ComponentService: vi.fn().mockImplementation(() => ({
    getComponentsList: vi.fn(),
  })),
}));

// 模拟logger
vi.mock('../../src/utils/logger', () => ({
  logger: {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    success: vi.fn(),
  },
}));

describe('FetchComponentListTool', () => {
  let tool: FetchComponentListTool;
  const mockComponentsDir = '/path/to/components';

  // 模拟组件列表
  const mockComponents: ComponentMeta[] = [
    {
      name: 'Button',
      description: '按钮组件',
      props: {
        variant: '按钮样式变体',
        size: '按钮大小',
      },
    },
    {
      name: 'Input',
      description: '输入框组件',
      props: {
        size: '输入框大小',
        disabled: '是否禁用',
      },
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    tool = new FetchComponentListTool(mockComponentsDir);

    // 设置模拟返回值
    tool.componentService.getComponentsList = vi.fn().mockResolvedValue(mockComponents);
  });

  it('应该正确创建工具实例', () => {
    expect(tool).toBeInstanceOf(FetchComponentListTool);
    expect(tool.name).toBe('get_components_list');
    expect(tool.description).toContain('Use this tool when the user requests a new UI component');
  });

  it('应该正确执行并格式化组件列表', async () => {
    const result = await tool.execute();

    // 验证调用了组件服务
    expect(tool.componentService.getComponentsList).toHaveBeenCalledTimes(1);

    // 验证返回格式正确
    expect(result).toHaveProperty('content');
    expect(result.content).toBeInstanceOf(Array);
    expect(result.content[0]).toHaveProperty('type', 'text');

    // 验证内容包含所有组件信息
    const { text } = result.content[0];
    expect(text).toContain('Button');
    expect(text).toContain('按钮组件');
    expect(text).toContain('Input');
    expect(text).toContain('输入框组件');
  });

  it('应该在获取组件时处理错误', async () => {
    const mockError = new Error('测试错误');
    tool.componentService.getComponentsList = vi.fn().mockRejectedValue(mockError);

    // 模拟logger.error以便验证错误处理
    const { logger } = await import('../../src/utils/logger');

    await expect(tool.execute()).rejects.toThrow('测试错误');

    expect(logger.error).toHaveBeenCalledWith('Error executing tool', mockError);
  });
});
