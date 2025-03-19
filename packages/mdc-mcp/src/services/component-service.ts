import path from 'path';
import { promises as fs } from 'fs';

import { logger } from '../utils/logger';

import { type ComponentMeta, parseMdxMeta, parseMdxContent } from '../utils/mdx-parser';
import { Cache } from '../utils/cache';

// 缓存过期时间：5分钟
const CACHE_TTL = 5 * 60 * 1000;

// 组件元数据缓存
const metaCache = new Cache<ComponentMeta[]>({ ttl: CACHE_TTL });
// 组件内容缓存
const contentCache = new Cache<string>({ ttl: CACHE_TTL });

/**
 * 组件服务
 */
export class ComponentService {
  private componentsDir: string;

  /**
   * 创建组件服务实例
   * @param componentsDir 组件文档目录
   */
  constructor(componentsDir: string) {
    this.componentsDir = componentsDir;
    logger.debug(`ComponentService 初始化，组件目录: ${componentsDir}`);
  }

  /**
   * 获取所有组件元数据
   * @returns 组件元数据列表
   */
  getComponentsList = async (): Promise<ComponentMeta[]> => {
    // 尝试从缓存获取
    const cacheKey = `components:${this.componentsDir}`;
    const cachedMeta = metaCache.get(cacheKey);
    if (cachedMeta) {
      logger.debug(`从缓存获取组件列表，共 ${cachedMeta.length} 个组件`);
      return cachedMeta;
    }

    logger.info('正在读取组件目录...');
    // 读取组件目录
    const files = await fs.readdir(this.componentsDir);
    const mdxFiles = files.filter((file) => file.endsWith('.mdx'));
    logger.debug(`找到 ${mdxFiles.length} 个 MDX 文件`);

    // 解析每个组件的元数据
    const componentsMeta: ComponentMeta[] = [];
    for (const file of mdxFiles) {
      try {
        const filePath = path.join(this.componentsDir, file);
        logger.debug(`解析组件元数据: ${file}`);
        const meta = await parseMdxMeta(filePath);
        componentsMeta.push(meta);
      } catch (error) {
        logger.error(
          `解析组件元数据失败 ${file}: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    }

    // 更新缓存
    logger.debug(`更新组件列表缓存，共 ${componentsMeta.length} 个组件`);
    metaCache.set(cacheKey, componentsMeta);

    return componentsMeta;
  };

  /**
   * 获取组件详情
   * @param componentName 组件名称
   * @returns 组件内容
   */
  getComponentDetail = async (componentName: string): Promise<string> => {
    // 尝试从缓存获取
    const cacheKey = `component:${this.componentsDir}:${componentName}`;
    const cachedContent = contentCache.get(cacheKey);
    if (cachedContent) {
      logger.debug(`从缓存获取组件详情: ${componentName}`);
      return cachedContent;
    }

    logger.info(`正在查找组件: ${componentName}`);
    // 查找组件文件
    const files = await fs.readdir(this.componentsDir);
    const componentFile = files.find((file) => {
      const fileName = path.basename(file, path.extname(file));
      return fileName.toLowerCase() === componentName.toLowerCase();
    });

    if (!componentFile) {
      logger.error(`组件未找到: ${componentName}`);
      throw new Error(`Component not found: ${componentName}`);
    }

    // 读取组件内容
    logger.debug(`解析组件内容: ${componentFile}`);
    const filePath = path.join(this.componentsDir, componentFile);
    const content = await parseMdxContent(filePath);

    // 更新缓存
    logger.debug(`更新组件详情缓存: ${componentName}`);
    contentCache.set(cacheKey, content);

    return content;
  };
}
