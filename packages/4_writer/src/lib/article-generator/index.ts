import { logger } from '@demo/common';
import type { GenerateOptions, GenerateResult } from './types';
import { promptAnalyzer } from './prompt-analyzer';
import { outlineGenerator } from './outline-generator';
import { contentGenerator } from './content-generator';
import { factChecker } from './fact-checker';
import { contentOptimizer } from './content-optimizer';
import { saveArticleToMarkdown } from './file-utils';
import path from 'path';
import fs from 'fs';
import { promises as fsPromises } from 'fs';

const DEBUG = true;

/**
 * 保存步骤结果到缓存目录
 * @param stepName 步骤名称
 * @param data 要保存的数据
 */
async function saveStepResult(stepName: string, data: any): Promise<void> {
  try {
    // 创建缓存目录
    const cacheDir = path.resolve(__dirname, '../../node_modules/.cache');
    if (!fs.existsSync(cacheDir)) {
      await fsPromises.mkdir(cacheDir, { recursive: true });
      logger.info(`创建缓存目录: ${cacheDir}`);
    }

    // 创建带时间戳的文件名
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = `${stepName}_${timestamp}.json`;
    const filePath = path.join(cacheDir, fileName);

    // 保存数据
    await fsPromises.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
    logger.info(`已保存${stepName}结果到: ${filePath}`);
  } catch (error) {
    logger.warn(`保存${stepName}结果时出错: ${error}`);
    // 继续执行，不中断主流程
  }
}

/**
 * 生成文章
 * @param prompt 用户提示
 * @param options 生成选项
 * @returns 生成结果
 */
export async function generateArticle(
  prompt: string,
  options: GenerateOptions = {}
): Promise<GenerateResult> {
  try {
    logger.info('开始生成文章...');
    logger.info(`提示: "${prompt}"`);
    logger.info(`选项: ${JSON.stringify(options)}`);

    // 第一阶段：分析提示
    logger.info('第一阶段：分析提示...');
    const analysis = await promptAnalyzer(prompt, options);
    await saveStepResult('分析提示', analysis);
    logger.success('提示分析完成');
    logger.info(`主题: ${analysis.topic}`);
    logger.info(`目标受众: ${analysis.targetAudience}`);
    logger.info(`内容类型: ${analysis.contentType}`);
    logger.info(`关键主题: ${analysis.keyThemes.join(', ')}`);

    // 第二阶段：生成大纲
    logger.info('第二阶段：生成大纲...');
    const outline = await outlineGenerator(prompt, options);
    await saveStepResult('生成大纲', outline);
    logger.success('大纲生成完成');
    logger.info(`标题: ${outline.title}`);
    logger.info(`章节数: ${outline.sections.length}`);
    logger.info('大纲详情:');
    logger.info('----------------------------------------');
    logger.info(`标题: ${outline.title}`);
    logger.info('章节:');
    const sectionDetails = outline.sections.reduce((acc, section, index) => {
      acc.push(`${index + 1}. ${section.title}`);
      if (section.subsections?.length) {
        section.subsections.forEach((sub, subIndex) => {
          acc.push(`   ${index + 1}.${subIndex + 1} ${sub.title}`);
        });
      }
      return acc;
    }, [] as string[]);
    logger.info(sectionDetails.join('\n'), false);
    logger.info('----------------------------------------');

    // 第三阶段：生成内容
    logger.info('第三阶段：生成内容...');
    const content = await contentGenerator(outline, options);
    await saveStepResult('生成内容', content);
    logger.success('内容生成完成');

    // 第四阶段：事实检查
    logger.info('第四阶段：事实检查...');
    const factCheckResult = await factChecker(content, options);
    await saveStepResult('事实检查', factCheckResult);
    const checkedContent = factCheckResult.article;
    logger.success('事实检查完成');

    // 第五阶段：内容优化
    logger.info('第五阶段：内容优化...');
    const optimizedContent = await contentOptimizer(checkedContent, options);
    await saveStepResult('内容优化', optimizedContent);
    logger.success('内容优化完成');

    // 保存文章
    logger.info('保存文章...');
    const outputDir =
      process.env.ARTICLE_OUTPUT_DIR || path.resolve(__dirname, '../../../../../docs/articles');
    const filePath = await saveArticleToMarkdown(optimizedContent, outputDir);

    // 保存最终结果
    await saveStepResult('最终结果', {
      title: optimizedContent.title,
      content: optimizedContent.content,
      filePath,
    });

    logger.success(`文章已保存至: ${filePath}`);

    return {
      title: optimizedContent.title,
      content: optimizedContent.content,
      filePath,
    };
  } catch (error) {
    logger.error(`生成文章时出错: ${error}`);
    throw error;
  }
}

// 导出类型
export * from './types';
