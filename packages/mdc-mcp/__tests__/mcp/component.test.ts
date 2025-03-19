import { describe, it, expect, vi, beforeEach } from 'vitest';

import { FetchComponentDetailTool } from '../../src/mcp/component';

// 模拟ComponentService
vi.mock('../../src/services/component-service', () => ({
  ComponentService: vi.fn().mockImplementation(() => ({
    getComponentDetail: vi.fn(),
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

describe('FetchComponentDetailTool', () => {
  let tool: FetchComponentDetailTool;
  const mockComponentsDir = '/path/to/components';
  const mockComponentName = 'Button';
  const mockComponentContent = '# Button组件文档\n\n这是Button组件的详细文档';

  beforeEach(() => {
    vi.clearAllMocks();
    tool = new FetchComponentDetailTool(mockComponentsDir);

    // 设置模拟返回值
    tool.componentService.getComponentDetail = vi.fn().mockResolvedValue(mockComponentContent);
  });

  it('应该正确创建工具实例', () => {
    expect(tool).toBeInstanceOf(FetchComponentDetailTool);
    expect(tool.name).toBe('get_component_detail');
    expect(tool.description).toContain('Get detailed documentation for a specific component');
  });

  it('应该有正确的参数模式定义', () => {
    expect(tool.schema.shape).toHaveProperty('componentName');
  });

  it('应该正确执行并返回组件详情', async () => {
    const result = await tool.execute({ componentName: mockComponentName });

    // 验证调用了组件服务的正确方法和参数
    expect(tool.componentService.getComponentDetail).toHaveBeenCalledTimes(1);
    expect(tool.componentService.getComponentDetail).toHaveBeenCalledWith(mockComponentName);

    // 验证返回格式正确
    expect(result).toHaveProperty('content');
    expect(result.content).toBeInstanceOf(Array);
    expect(result.content[0]).toHaveProperty('type', 'text');
    expect(result.content[0].text).toBe(mockComponentContent);
  });

  it('应该在获取组件时处理错误', async () => {
    const mockError = new Error('组件不存在');
    tool.componentService.getComponentDetail = vi.fn().mockRejectedValue(mockError);

    // 模拟logger.error以便验证错误处理
    const { logger } = await import('../../src/utils/logger');

    await expect(tool.execute({ componentName: 'NonExistent' })).rejects.toThrow('组件不存在');

    expect(logger.error).toHaveBeenCalledWith('Error executing tool', mockError);
  });
});
