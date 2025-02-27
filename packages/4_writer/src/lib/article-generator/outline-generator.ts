import { GenerateOptions, Outline, OutlineSection, PromptAnalysis } from './types';
import { logger } from '@demo/common';
import { generateText, generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import { retryWrapper } from '@demo/common';

// 创建 OpenAI 模型
const createModel = (modelName = 'gpt-4o') => {
  return openai(modelName);
};

const MAX_ITERATIONS = 6;

/**
 * 生成文章大纲
 * @param prompt 用户提示
 * @param options 生成选项
 * @returns 文章大纲
 */
export async function outlineGenerator(prompt: string, options: GenerateOptions): Promise<Outline> {
  logger.info('开始生成文章大纲...');
  let cursor = 0;

  try {
    // 根据提示生成初始大纲
    let currentOutline = await retryWrapper(generateInitialOutline)(prompt, options);
    logger.info(`初始大纲生成完成，包含 ${currentOutline.sections.length} 个主要章节`);

    // 评估大纲质量
    let outlineQuality = await retryWrapper(evaluateOutlineQuality)(
      currentOutline,
      prompt,
      options
    );

    // 如果大纲质量不佳，进行优化
    while (outlineQuality.score < 0.7 && cursor < MAX_ITERATIONS) {
      logger.warn(`大纲质量评分较低 (${outlineQuality.score.toFixed(2)})，正在优化...`);

      // 根据评估结果优化大纲
      currentOutline = await retryWrapper(improveOutline)(
        currentOutline,
        outlineQuality.suggestions,
        prompt,
        options
      );

      outlineQuality = await retryWrapper(evaluateOutlineQuality)(currentOutline, prompt, options);

      logger.success(`大纲优化完成，当前质量评分: ${outlineQuality.score.toFixed(2)}`);
    }

    logger.success(`大纲生成完成，当前质量评分: ${outlineQuality.score.toFixed(2)}`);
    return currentOutline;
  } catch (error) {
    logger.error(`生成大纲时出错: ${error}`);
    throw error;
  }
}

/**
 * 生成初始大纲
 */
async function generateInitialOutline(prompt: string, options: GenerateOptions): Promise<Outline> {
  const model = createModel(options.model);
  const { object } = await generateObject({
    model,
    system: `你是一个专业的内容策划专家，擅长为文章创建结构清晰的大纲。
请根据提供的主题和要求，创建一个包含标题和章节的大纲。`,
    prompt: `请为以下主题创建一个详细的文章大纲:

"${prompt}"

大纲应该包含一个引人入胜的标题和多个章节。每个章节应该有一个清晰的标题和关键点列表。
章节数量应该根据主题复杂度适当调整，通常为3-7个大章节。`,
    schema: z.object({
      title: z.string().describe('文章标题'),
      sections: z
        .array(
          z.object({
            title: z.string().describe('章节标题'),
            keyPoints: z.array(z.string()).describe('章节关键点列表'),
            subsections: z
              .array(
                z.object({
                  title: z.string().describe('子章节标题'),
                  keyPoints: z.array(z.string()).describe('子章节关键点列表'),
                })
              )
              .optional()
              .describe('子章节列表'),
          })
        )
        .describe('章节列表'),
    }),
  });

  return object;
}

/**
 * 评估大纲质量
 */
async function evaluateOutlineQuality(
  outline: Outline,
  prompt: string,
  options: GenerateOptions
): Promise<{ score: number; suggestions: string[] }> {
  const model = createModel(options.model);
  const { object } = await generateObject({
    model,
    system: `你是一个专业的内容大纲评估专家，擅长评估内容大纲的质量。
请根据提供的大纲和原始提示，评估大纲的质量，并提供改进建议。`,
    prompt: `请评估以下内容大纲的质量:

标题: ${outline.title}
章节: ${outline.sections.map((s) => s.title).join(', ')}`,
    schema: z.object({
      completeness: z.number().min(0).max(10).describe('完整性得分'),
      structure: z.number().min(0).max(10).describe('结构性得分'),
      innovation: z.number().min(0).max(10).describe('创新性得分'),
      relevance: z.number().min(0).max(10).describe('相关性得分'),
      feasibility: z.number().min(0).max(10).describe('可行性得分'),
      totalScore: z.number().min(0).max(50).describe('总分'),
      normalizedScore: z.number().min(0).max(1).describe('归一化分数 (0-1)'),
      suggestions: z.array(z.string()).describe('改进建议列表'),
    }),
  });

  return {
    score: object.normalizedScore,
    suggestions: object.suggestions,
  };
}

/**
 * 根据评估结果优化大纲
 */
async function improveOutline(
  outline: Outline,
  suggestions: string[],
  prompt: string,
  options: GenerateOptions
): Promise<Outline> {
  const model = createModel(options.model);
  const { object } = await generateObject({
    model,
    system: `你是一个专业的内容大纲优化专家，擅长根据反馈优化内容大纲。
请根据提供的大纲、原始提示和改进建议，优化大纲。`,
    prompt: `请根据以下反馈优化内容大纲:

原始大纲:
标题: ${outline.title}
章节: ${outline.sections.map((section) => section.title).join('\n')}

改进建议:
${suggestions.join('\n')}

原始提示:
${prompt}`,
    schema: z.object({
      title: z.string().describe('文章标题'),
      description: z.string().describe('文章简短描述'),
      sections: z
        .array(
          z.object({
            title: z.string().describe('章节标题'),
            description: z.string().describe('章节简短描述'),
            keyPoints: z.array(z.string()).describe('章节关键点列表'),
            subsections: z
              .array(
                z.object({
                  title: z.string().describe('子章节标题'),
                  description: z.string().describe('子章节简短描述'),
                  keyPoints: z.array(z.string()).describe('子章节关键点列表'),
                })
              )
              .optional()
              .describe('子章节列表'),
          })
        )
        .describe('文章章节列表'),
    }),
  });

  return object;
}
