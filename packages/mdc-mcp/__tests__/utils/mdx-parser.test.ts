import { promises as fs } from 'fs';

import { describe, it, expect, vi, beforeEach } from 'vitest';

import {
  componentMetaSchema,
  readMdxContent,
  parseMdxMeta,
  parseMdxContent,
} from '../../src/utils/mdx-parser';

// 模拟fs模块
vi.mock('fs', () => ({
  promises: {
    readFile: vi.fn(),
  },
}));

describe('MDX Parser', () => {
  const mockFilePath = '/path/to/mock.mdx';
  const mockMdxContent = `---
name: Button
description: 按钮组件
props:
  variant: 按钮样式变体
  size: 按钮大小
---

# Button 按钮

这是一个按钮组件的文档。

## 示例

\`\`\`jsx
import { Button } from 'antd';

export default () => <Button>点击我</Button>;
\`\`\`

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| variant | 按钮样式变体 | 'primary' \| 'secondary' \| 'text' | 'primary' |
| size | 按钮大小 | 'small' \| 'medium' \| 'large' | 'medium' |
`;

  beforeEach(() => {
    vi.resetAllMocks();
    // 模拟readFile方法返回mockMdxContent
    vi.mocked(fs.readFile).mockResolvedValue(mockMdxContent);
  });

  it('应该正确读取MDX文件内容', async () => {
    const content = await readMdxContent(mockFilePath);
    expect(fs.readFile).toHaveBeenCalledWith(mockFilePath, 'utf-8');
    expect(content).toBe(mockMdxContent);
  });

  it('应该正确解析MDX文件元数据', async () => {
    const meta = await parseMdxMeta(mockFilePath);
    expect(fs.readFile).toHaveBeenCalledWith(mockFilePath, 'utf-8');
    expect(meta).toEqual({
      name: 'Button',
      description: '按钮组件',
      props: {
        variant: '按钮样式变体',
        size: '按钮大小',
      },
    });
  });

  it('应该正确验证元数据格式', () => {
    const validMeta = {
      name: 'Button',
      description: '按钮组件',
    };

    const result = componentMetaSchema.safeParse(validMeta);
    expect(result.success).toBe(true);
  });

  it('应该在缺少必填字段时验证失败', () => {
    const invalidMeta = {
      name: 'Button',
      // 缺少description字段
    };

    const result = componentMetaSchema.safeParse(invalidMeta);
    expect(result.success).toBe(false);
  });

  it('应该正确返回MDX内容', async () => {
    const content = await parseMdxContent(mockFilePath);
    expect(fs.readFile).toHaveBeenCalledWith(mockFilePath, 'utf-8');
    expect(content).toBe(mockMdxContent);
  });

  it('应该在读取文件失败时抛出错误', async () => {
    const error = new Error('文件读取失败');
    vi.mocked(fs.readFile).mockRejectedValue(error);

    await expect(readMdxContent(mockFilePath)).rejects.toThrow('文件读取失败');
  });
});
