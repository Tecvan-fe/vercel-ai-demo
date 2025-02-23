import { Command } from 'commander';
import { db } from '../db';
import { embeddings, resources } from '../db';
import { readContent } from '../lib/file';
import { generateEmbeddings, splitIntoChunks } from '../lib/embedding';

export const addCommand = new Command('add')
  .description('添加文档到向量数据库')
  .option('-f, --file <path>', '指定文件路径')
  .option('-d, --dir <path>', '指定目录路径')
  .action(async (options) => {
    try {
      const inputPath = options.file || options.dir;
      if (!inputPath) {
        throw new Error('请指定文件路径(-f)或目录路径(-d)');
      }

      // 读取文件内容
      const files = await readContent(inputPath);
      console.log(`读取到 ${files.length} 个文件`);

      // 处理每个文件
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        console.log(`处理文件: ${file.path}`);

        // 保存原始文档
        const [doc] = await db
          .insert(resources)
          .values({
            content: file.content,
          })
          .returning();

        // 分块并生成向量
        const textChunks = splitIntoChunks(file.content);
        console.log(`文档分成 ${textChunks.length} 个块`);

        const embeddingContent = await generateEmbeddings(textChunks);

        // 保存分块和向量
        await db.insert(embeddings).values(
          textChunks.map((chunk, i) => ({
            resourceId: doc.id,
            content: chunk,
            embedding: embeddingContent[i],
          }))
        );

        console.log('\x1b[32m%s\x1b[0m', `[${i + 1}/${files.length}] 成功处理文件: ${file.path}`);
      }

      console.log('所有文件处理完成');
      process.exit(0);
    } catch (error) {
      console.error('处理失败:', error.message + '\n');
      console.error(error.stack);
      process.exit(1);
    }
  });
