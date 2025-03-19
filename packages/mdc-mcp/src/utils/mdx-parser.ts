import { promises as fs } from 'fs';

import { z } from 'zod';
import markdownMeta from 'markdown-it-meta';
import MarkdownIt from 'markdown-it';
import { logger } from './logger';

// 扩展 MarkdownIt 类型，添加 meta 属性
declare module 'markdown-it' {
  interface MarkdownIt {
    meta?: Record<string, unknown>;
  }
}

// 组件元数据模型
export const componentMetaSchema = z.object({
  name: z.string(),
  description: z.string(),
  props: z.record(z.string(), z.string()).optional(),
});

export type ComponentMeta = z.infer<typeof componentMetaSchema>;

/**
 * 创建 Markdown 解析器实例
 * @returns Markdown 解析器实例
 */
const createMarkdownParser = (): MarkdownIt => {
  logger.debug('创建 Markdown 解析器实例');
  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
  });
  md.use(markdownMeta);
  return md;
};

/**
 * 读取 Markdown 文件内容
 * @param filePath Markdown 文件路径
 * @returns Markdown 文件内容
 */
export const readMdxContent = async (filePath: string): Promise<string> => {
  logger.debug(`读取文件内容: ${filePath}`);
  return await fs.readFile(filePath, 'utf-8');
};

/**
 * 解析 Markdown 文档中的元数据
 * @param filePath Markdown 文件路径
 * @returns 组件元数据
 */
export const parseMdxMeta = async (filePath: string): Promise<ComponentMeta> => {
  logger.debug(`解析文件元数据: ${filePath}`);
  const content = await readMdxContent(filePath);
  const md = createMarkdownParser();

  // 解析内容，元数据会被存储在 md.meta 中
  md.render(content);

  // 验证元数据格式
  // @ts-expect-error markdown-it-meta 插件会在 md 对象上添加 meta 属性
  const metaData = md.meta || {};
  try {
    const parsedData = componentMetaSchema.parse(metaData);
    logger.debug(`元数据解析成功: ${parsedData.name}`);
    return parsedData;
  } catch (error) {
    logger.error(`元数据验证失败: ${error instanceof Error ? error.message : String(error)}`);
    throw error;
  }
};

/**
 * 解析 Markdown 文档内容
 * @param filePath Markdown 文件路径
 * @returns 解析后的 HTML 内容
 */
export const parseMdxContent = async (filePath: string): Promise<string> => {
  logger.debug(`解析文件内容: ${filePath}`);
  const content = await readMdxContent(filePath);
  return content;
};
