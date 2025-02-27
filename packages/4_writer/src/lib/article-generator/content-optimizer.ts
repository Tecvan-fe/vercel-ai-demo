import { GenerateOptions, ArticleContent, SectionContent } from './types';
import { logger } from '@demo/common';
import { generateText, generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import { retryWrapper } from '@demo/common';

// 创建 OpenAI 模型
const createModel = (modelName = 'gpt-4o') => {
  return openai(modelName);
};

export interface OptimizationResult {
  originalContent: string;
  optimizedContent: string;
  improvements: Improvement[];
}

export interface Improvement {
  type: 'readability' | 'engagement' | 'seo' | 'style' | 'grammar';
  description: string;
  before: string;
  after: string;
}

/**
 * 优化文章内容
 * @param content 原始文章内容
 * @param options 生成选项
 * @returns 优化后的文章内容
 */
export async function contentOptimizer(
  content: ArticleContent,
  options: GenerateOptions
): Promise<ArticleContent> {
  logger.info('开始优化文章内容...');

  try {
    // 优化标题
    content.title = await retryWrapper(optimizeTitle)(content.title, content.sections, options);

    // 优化每个章节
    const optimizedSections: SectionContent[] = [];

    for (const section of content.sections) {
      logger.info(`优化章节: ${section.title}`);
      const optimizedSection = await retryWrapper(optimizeSection)(section, options);
      optimizedSections.push(optimizedSection);
    }

    content.sections = optimizedSections;

    // 添加结论章节（如果没有）
    if (
      !content.sections.some((section) =>
        ['结论', 'summary', 'conclusion'].some((keyword) =>
          section.title.toLowerCase().includes(keyword)
        )
      )
    ) {
      const conclusion = await retryWrapper(generateConclusion)(content, options);
      content.sections.push(conclusion);
    }

    logger.success('文章内容优化完成');
    return content;
  } catch (error) {
    logger.error(`优化文章内容时出错: ${error}`);
    return content;
  }
}

/**
 * 优化文章标题
 * @param title 原始标题
 * @param sections 文章章节
 * @param options 生成选项
 * @returns 优化后的标题
 */
async function optimizeTitle(
  title: string,
  sections: SectionContent[],
  options: GenerateOptions
): Promise<string> {
  try {
    const model = createModel();
    const { object } = await generateObject({
      model,
      system: `你是一位专业的文章标题优化专家。你的任务是优化文章标题，使其更具吸引力、更清晰、更能引起读者兴趣，同时保持专业性和准确性。`,
      prompt: `请优化以下文章标题，使其更具吸引力、更清晰、更能引起读者兴趣，同时保持专业性和准确性。

原始标题: "${title}"

文章章节:
${sections.map((s) => `- ${s.title}`).join('\n')}

目标风格: ${options.style || '专业、清晰'}

请提供一个优化后的标题。`,
      schema: z.object({
        optimizedTitle: z.string().describe('优化后的标题'),
      }),
    });

    return object.optimizedTitle;
  } catch (error) {
    logger.error(`优化标题时出错: ${error}`);
    return title;
  }
}

/**
 * 优化文章章节
 * @param section 原始章节
 * @param options 生成选项
 * @returns 优化后的章节
 */
async function optimizeSection(
  section: SectionContent,
  options: GenerateOptions
): Promise<SectionContent> {
  try {
    // 优化章节标题
    const optimizedTitle = await optimizeSectionTitle(section.title, section.content, options);

    // 优化章节内容
    const optimizedContent = await optimizeSectionContent(section.content, section.title, options);

    return {
      ...section,
      title: optimizedTitle,
      content: optimizedContent,
    };
  } catch (error) {
    logger.error(`优化章节时出错: ${error}`);
    return section;
  }
}

/**
 * 优化章节标题
 * @param title 原始标题
 * @param content 章节内容
 * @param options 生成选项
 * @returns 优化后的标题
 */
async function optimizeSectionTitle(
  title: string,
  content: string,
  options: GenerateOptions
): Promise<string> {
  try {
    const model = createModel();
    const { object } = await generateObject({
      model,
      system: `你是一位专业的文章章节标题优化专家。你的任务是优化章节标题，使其更清晰、更具描述性，同时保持简洁。`,
      prompt: `请优化以下章节标题，使其更清晰、更具描述性，同时保持简洁。

原始标题: "${title}"

章节内容摘要:
"${content.substring(0, 200)}..."

目标风格: ${options.style || '专业、清晰'}

请提供一个优化后的章节标题。`,
      schema: z.object({
        optimizedTitle: z.string().describe('优化后的章节标题'),
      }),
    });

    return object.optimizedTitle;
  } catch (error) {
    logger.error(`优化章节标题时出错: ${error}`);
    return title;
  }
}

/**
 * 优化章节内容
 * @param content 原始内容
 * @param title 章节标题
 * @param options 生成选项
 * @returns 优化后的内容
 */
async function optimizeSectionContent(
  content: string,
  title: string,
  options: GenerateOptions
): Promise<string> {
  try {
    const model = createModel();
    const { text } = await generateText({
      model,
      system: `你是一位专业的文章内容优化专家。你的任务是优化文章章节内容，使其更流畅、更有条理、更具吸引力，同时保持专业性和准确性。`,
      prompt: `请优化以下文章章节内容，使其更流畅、更有条理、更具吸引力，同时保持专业性和准确性。

章节标题: "${title}"

原始内容:
"${content}"

优化要求:
1. 改进段落结构和逻辑流程
2. 增强语言表达的清晰度和吸引力
3. 确保内容与标题紧密相关
4. 添加适当的过渡词，使文章更流畅
5. 保持专业性和准确性
6. 风格: ${options.style || '专业、清晰'}

请提供优化后的章节内容。`,
    });

    return text;
  } catch (error) {
    logger.error(`优化章节内容时出错: ${error}`);
    return content;
  }
}

/**
 * 生成结论章节
 * @param content 文章内容
 * @param options 生成选项
 * @returns 结论章节
 */
async function generateConclusion(
  content: ArticleContent,
  options: GenerateOptions
): Promise<SectionContent> {
  try {
    const model = createModel();
    const { object } = await generateObject({
      model,
      system: `你是一位专业的文章结论撰写专家。你的任务是为文章创建一个有力的结论章节，总结文章的主要观点，并提供最终见解或行动建议。`,
      prompt: `请为以下文章创建一个有力的结论章节，总结文章的主要观点，并提供最终见解或行动建议。

文章标题: "${content.title}"

文章章节:
${content.sections.map((s) => `- ${s.title}`).join('\n')}

结论要求:
1. 总结文章的主要观点和发现
2. 提供最终见解或行动建议
3. 结束语应该有力且令人印象深刻
4. 风格: ${options.style || '专业、清晰'}
5. 长度: 200-300字

请提供一个完整的结论章节，包括标题和内容。`,
      schema: z.object({
        title: z.string().describe('结论章节标题'),
        content: z.string().describe('结论章节内容'),
      }),
    });

    return {
      title: object.title,
      content: object.content,
    };
  } catch (error) {
    logger.error(`生成结论章节时出错: ${error}`);
    return {
      title: '结论',
      content: '本文总结了主要观点和发现，希望对读者有所启发和帮助。',
    };
  }
}
