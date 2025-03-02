import fs from 'fs';
import path from 'path';
import { logger } from '@demo/common';
import { FileTask, TaskCache } from './types';

// 缓存目录
const CACHE_DIR = '.cache';
const CACHE_FILE = 'readme-tasks.json';

/**
 * 确保缓存目录存在
 */
function ensureCacheDir(): void {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }
}

/**
 * 保存任务到缓存
 */
export function saveTasks(tasks: FileTask[], targetDir: string): void {
  try {
    ensureCacheDir();

    const cache: TaskCache = {
      tasks,
      lastUpdated: new Date().toISOString(),
      targetDir,
    };

    fs.writeFileSync(path.join(CACHE_DIR, CACHE_FILE), JSON.stringify(cache, null, 2));

    logger.info('任务状态已保存到缓存');
  } catch (error) {
    logger.error(`保存任务缓存失败: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * 从缓存加载任务
 */
export function loadTasks(targetDir: string): FileTask[] | null {
  try {
    const cachePath = path.join(CACHE_DIR, CACHE_FILE);

    if (!fs.existsSync(cachePath)) {
      return null;
    }

    const cacheContent = fs.readFileSync(cachePath, 'utf-8');
    const cache: TaskCache = JSON.parse(cacheContent);

    // 检查缓存是否匹配当前目标目录
    if (cache.targetDir !== targetDir) {
      logger.info('缓存目录不匹配，将重新扫描');
      return null;
    }

    logger.info(`从缓存加载了 ${cache.tasks.length} 个任务`);
    return cache.tasks;
  } catch (error) {
    logger.error(`加载任务缓存失败: ${error instanceof Error ? error.message : String(error)}`);
    return null;
  }
}
