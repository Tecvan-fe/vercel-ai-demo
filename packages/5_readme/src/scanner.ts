import fs from 'fs';
import path from 'path';
import { logger } from '@demo/common';
import { FileTask } from './types';

// 排除的目录
const EXCLUDED_DIRS = ['node_modules', '.git', 'dist', 'build', '.cache'];

/**
 * 递归扫描目录，找出所有符合扩展名的文件
 */
export async function scanDirectory(
  dirPath: string,
  extensions: string[],
  verbose: boolean
): Promise<FileTask[]> {
  const tasks: FileTask[] = [];
  const extensionsWithDot = extensions.map((ext) => (ext.startsWith('.') ? ext : `.${ext}`));

  // 递归扫描函数
  async function scan(currentPath: string): Promise<void> {
    try {
      const entries = fs.readdirSync(currentPath, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(currentPath, entry.name);

        if (entry.isDirectory()) {
          // 跳过排除的目录
          if (EXCLUDED_DIRS.includes(entry.name)) {
            if (verbose) {
              logger.info(`跳过目录: ${fullPath}`, false);
            }
            continue;
          }

          // 递归扫描子目录
          await scan(fullPath);
        } else if (entry.isFile()) {
          // 检查文件扩展名
          const ext = path.extname(entry.name);
          if (extensionsWithDot.includes(ext)) {
            if (verbose) {
              logger.info(`找到文件: ${fullPath}`, false);
            }

            tasks.push({
              filePath: fullPath,
              analyzed: false,
            });
          }
        }
      }
    } catch (error) {
      logger.error(
        `扫描目录 ${currentPath} 失败: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  // 开始扫描
  await scan(dirPath);

  logger.info(`共找到 ${tasks.length} 个文件需要分析`);
  return tasks;
}
