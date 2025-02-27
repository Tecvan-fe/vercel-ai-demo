import fs from 'fs';
import path from 'path';
import { promisify } from 'util';

const writeFileAsync = promisify(fs.writeFile);

/**
 * 将内容保存到文件
 * @param content 要保存的内容
 * @param filePath 文件路径
 * @param format 文件格式
 */
export async function saveToFile(
  content: string,
  filePath: string,
  format: 'md' | 'html' | 'txt' = 'md'
): Promise<void> {
  // 确保文件扩展名与格式匹配
  const fileExt = path.extname(filePath).toLowerCase().replace('.', '');
  let finalPath = filePath;

  if (!fileExt || (fileExt !== format && fileExt !== 'markdown' && format === 'md')) {
    finalPath = `${filePath}.${format}`;
  }

  // 确保目录存在
  const dir = path.dirname(finalPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // 根据格式处理内容
  let finalContent = content;
  if (format === 'html' && !content.includes('<!DOCTYPE html>')) {
    finalContent = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>生成的文章</title>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
    h1, h2, h3 { color: #333; }
    p { margin-bottom: 16px; }
  </style>
</head>
<body>
  ${content}
</body>
</html>`;
  }

  // 写入文件
  await writeFileAsync(finalPath, finalContent, 'utf8');
  return;
}
