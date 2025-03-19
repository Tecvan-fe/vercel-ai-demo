import { promises as fs } from 'fs';

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import * as mdxParser from '../../src/utils/mdx-parser';
import { type ComponentMeta } from '../../src/types';
import { ComponentService } from '../../src/services/component-service';

// 模拟依赖模块
vi.mock('fs', () => ({
  promises: {
    readdir: vi.fn(),
    readFile: vi.fn(),
  },
}));

vi.mock('../../src/utils/mdx-parser', () => ({
  parseMdxMeta: vi.fn(),
  parseMdxContent: vi.fn(),
}));

describe('ComponentService', () => {
  const mockComponentsDir = '/path/to/components';
  let componentService: ComponentService;

  // 模拟组件元数据
  const mockComponentsMeta: ComponentMeta[] = [
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

  // 模拟组件内容
  const mockComponentContent = '# Button 组件\n\n这是Button组件的详细文档';

  beforeEach(() => {
    // 重置所有模拟
    vi.resetAllMocks();

    // 创建组件服务实例
    componentService = new ComponentService(mockComponentsDir);

    // 模拟目录读取结果
    vi.mocked(fs.readdir).mockResolvedValue(['Button.mdx', 'Input.mdx'] as any);

    // 模拟MDX解析结果
    vi.mocked(mdxParser.parseMdxMeta).mockImplementation(
      async (filePath: string) => {
        if (filePath.includes('Button')) {
          return Promise.resolve(mockComponentsMeta[0]);
        } else {
          return Promise.resolve(mockComponentsMeta[1]);
        }
      },
    );

    vi.mocked(mdxParser.parseMdxContent).mockResolvedValue(
      mockComponentContent,
    );
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('应该正确创建组件服务实例', () => {
    expect(componentService).toBeInstanceOf(ComponentService);
  });

  it('应该获取所有组件元数据', async () => {
    const components = await componentService.getComponentsList();

    expect(fs.readdir).toHaveBeenCalledWith(mockComponentsDir);
    expect(mdxParser.parseMdxMeta).toHaveBeenCalledTimes(2);
    expect(components).toEqual(mockComponentsMeta);
  });

  it('应该从缓存获取组件列表', async () => {
    // 首次调用会读取文件
    await componentService.getComponentsList();

    // 重置模拟计数器
    vi.mocked(fs.readdir).mockClear();
    vi.mocked(mdxParser.parseMdxMeta).mockClear();

    // 再次调用应该使用缓存
    const components = await componentService.getComponentsList();

    // 应该没有再次调用文件读取和解析函数
    expect(fs.readdir).not.toHaveBeenCalled();
    expect(mdxParser.parseMdxMeta).not.toHaveBeenCalled();
    expect(components).toEqual(mockComponentsMeta);
  });

  it('应该获取特定组件的详情', async () => {
    const componentName = 'Button';
    const content = await componentService.getComponentDetail(componentName);

    expect(fs.readdir).toHaveBeenCalledWith(mockComponentsDir);
    expect(mdxParser.parseMdxContent).toHaveBeenCalledWith(
      expect.stringContaining('Button.mdx'),
    );
    expect(content).toBe(mockComponentContent);
  });

  it('应该处理组件名称的大小写不敏感', async () => {
    const componentName = 'button'; // 小写
    const content = await componentService.getComponentDetail(componentName);

    expect(fs.readdir).toHaveBeenCalledWith(mockComponentsDir);
    expect(mdxParser.parseMdxContent).toHaveBeenCalledWith(
      expect.stringContaining('Button.mdx'),
    );
    expect(content).toBe(mockComponentContent);
  });

  it('应该在组件不存在时抛出错误', async () => {
    const componentName = 'NonExistent';

    await expect(
      componentService.getComponentDetail(componentName),
    ).rejects.toThrow('Component not found');
  });

  it('应该从缓存获取组件详情', async () => {
    const componentName = 'Button';

    // 首次调用会读取文件
    await componentService.getComponentDetail(componentName);

    // 重置模拟计数器
    vi.mocked(fs.readdir).mockClear();
    vi.mocked(mdxParser.parseMdxContent).mockClear();

    // 再次调用应该使用缓存
    const content = await componentService.getComponentDetail(componentName);

    // 应该没有再次调用文件读取和解析函数
    expect(fs.readdir).not.toHaveBeenCalled();
    expect(mdxParser.parseMdxContent).not.toHaveBeenCalled();
    expect(content).toBe(mockComponentContent);
  });
});
