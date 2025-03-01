import { GenerateOptions, ArticleContent, SectionContent } from './types';
import { logger } from '@demo/common';
import { generateText, generateObject } from 'ai';
import { retryWrapper, createDeepSeekModel, createOpenAIModel } from '@demo/common';
import { z } from 'zod';

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
    // 检查文章结构是否超过三级
    const hasDeepStructure = checkDeepStructure(content.sections);

    if (hasDeepStructure) {
      logger.info('检测到超过三级的文章结构，进行结构优化...');
      // 使用大模型重构文章结构
      content = await retryWrapper(restructureArticle)(content, options);
    }

    // 优化每个章节
    const optimizedSections: SectionContent[] = [];

    for (const section of content.sections) {
      logger.info(`优化章节: ${section.title}`);
      const optimizedSection = await retryWrapper(optimizeSection)(section, options);
      optimizedSections.push(optimizedSection);
    }

    content.sections = optimizedSections;

    logger.success('文章内容优化完成');
    return content;
  } catch (error) {
    logger.error(`优化文章内容时出错: ${error}`);
    return content;
  }
}

/**
 * 检查是否存在超过三级的结构
 * @param sections 章节数组
 * @param level 当前层级
 * @returns 是否存在超过三级的结构
 */
function checkDeepStructure(sections: SectionContent[], level: number = 1): boolean {
  if (level > 2) return true; // 主标题为一级，这里检查的是子标题，所以超过2级就是超过三级结构

  for (const section of sections) {
    if (section.subsections && section.subsections.length > 0) {
      if (level === 2 || checkDeepStructure(section.subsections, level + 1)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * 使用大模型重构文章结构，确保最多只有三级结构
 * @param content 原始文章内容
 * @param options 生成选项
 * @returns 重构后的文章内容
 */
async function restructureArticle(
  content: ArticleContent,
  options: GenerateOptions
): Promise<ArticleContent> {
  logger.info('使用大模型重构文章结构...');

  try {
    // 将文章内容转换为JSON字符串
    const articleJson = JSON.stringify(content, null, 2);

    const model = createOpenAIModel();
    const { object } = await generateObject({
      model,
      system: `你是一位专业的文章结构优化专家。你的任务是重构文章结构，确保文章最多只有三级结构（主标题为一级，最多再有两级子标题）。
对于超过三级的内容，你需要将其合并到上一级章节中，并用连贯的语句串起内容，保持文章的流畅性和逻辑性。`,
      prompt: `请重构以下文章结构，确保最多只有三级结构（主标题为一级，最多再有两级子标题）。

文章JSON结构:
${articleJson}

重构要求:
1. 保留主标题（title）和最多两级子标题（sections和它们的subsections）
2. 对于超过三级的内容，将其合并到上一级章节的content中，用连贯的语句串起内容
3. 确保合并后的内容保持原有的信息和逻辑关系
4. 返回重构后的完整文章结构，包括所有原有字段

请返回重构后的文章JSON结构。`,
      schema: z.object({
        title: z.string(),
        introduction: z.string(),
        sections: z.array(
          z.object({
            title: z.string(),
            content: z.string(),
            subsections: z
              .array(
                z.object({
                  title: z.string(),
                  content: z.string(),
                  subsections: z.array(z.any()).optional(),
                })
              )
              .optional(),
          })
        ),
        conclusion: z.string(),
        content: z.string(),
      }),
    });

    // 确保subsections字段存在但为空数组
    const restructuredContent = object as ArticleContent;
    for (const section of restructuredContent.sections) {
      if (!section.subsections) {
        section.subsections = [];
      }

      for (const subsection of section.subsections) {
        if (subsection.subsections) {
          delete subsection.subsections;
        }
      }
    }

    logger.success('文章结构重构完成');
    return restructuredContent;
  } catch (error) {
    logger.error(`重构文章结构时出错: ${error}`);
    return content;
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
    // 优化章节内容
    const optimizedContent = await optimizeSectionContent(section.content, section.title, options);

    const result: SectionContent = {
      title: section.title,
      content: optimizedContent,
      subsections: [],
    };

    // 优化子章节
    if (section.subsections && section.subsections.length > 0) {
      const optimizedSubsections: SectionContent[] = [];

      for (const subsection of section.subsections) {
        const optimizedSubsection = await retryWrapper(optimizeSection)(subsection, options);
        optimizedSubsections.push(optimizedSubsection);
      }

      result.subsections = optimizedSubsections;
    }

    return result;
  } catch (error) {
    logger.error(`优化章节时出错: ${error}`);
    return section;
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
    const model = createDeepSeekModel();
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
