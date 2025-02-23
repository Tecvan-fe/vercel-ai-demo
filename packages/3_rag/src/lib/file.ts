import fs from 'fs/promises';
import path from 'path';

// 读取单个文件内容
export async function readFile(filePath: string): Promise<string> {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return content;
  } catch (error) {
    throw new Error(`Failed to read file ${filePath}: ${error}`);
  }
}

// 递归读取目录下所有文件
export async function readDirectory(
  dirPath: string
): Promise<Array<{ path: string; content: string }>> {
  const results: Array<{ path: string; content: string }> = [];

  async function processPath(currentPath: string) {
    const stats = await fs.stat(currentPath);

    if (stats.isFile()) {
      const content = await readFile(currentPath);
      results.push({ path: currentPath, content });
    } else if (stats.isDirectory()) {
      const entries = await fs.readdir(currentPath);
      for (const entry of entries) {
        await processPath(path.join(currentPath, entry));
      }
    }
  }

  await processPath(dirPath);
  return results;
}

// 根据输入路径判断是文件还是目录并读取内容
export async function readContent(
  inputPath: string
): Promise<Array<{ path: string; content: string }>> {
  const stats = await fs.stat(inputPath);

  if (stats.isFile()) {
    const content = await readFile(inputPath);
    return [{ path: inputPath, content }];
  } else if (stats.isDirectory()) {
    return readDirectory(inputPath);
  }

  throw new Error(`Invalid path: ${inputPath}`);
}
