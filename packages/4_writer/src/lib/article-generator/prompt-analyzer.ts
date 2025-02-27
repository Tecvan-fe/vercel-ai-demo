import { GenerateOptions, PromptAnalysis, SearchResult } from './types';
import { logger } from '@demo/common';
import { generateText, generateObject, NoObjectGeneratedError } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import { retryWrapper } from '@demo/common';
// 创建 OpenAI 模型
const createModel = (modelName = 'gpt-4o') => {
  return openai(modelName);
};

export interface CategorizedResults {
  basicKnowledge: SearchResult[];
  opinions: SearchResult[];
  cases: SearchResult[];
  data: SearchResult[];
  research: SearchResult[];
}

/**
 * 分析用户提示，提取关键信息
 * @param prompt 用户提示
 * @param options 生成选项
 * @returns 提示分析结果
 */
export async function promptAnalyzer(
  prompt: string,
  options: GenerateOptions
): Promise<PromptAnalysis> {
  logger.info('开始分析用户提示...');

  try {
    // 提取主题和目标受众
    const topicAndAudience = await retryWrapper(extractTopicAndAudience)(prompt);
    logger.info(
      `识别主题: "${topicAndAudience.topic}" 目标受众: "${topicAndAudience.targetAudience}"`
    );

    // 确定内容类型和风格
    const contentTypeAndStyle = await retryWrapper(determineContentTypeAndStyle)(
      prompt,
      topicAndAudience
    );
    logger.info(
      `确定内容类型: ${contentTypeAndStyle.contentType}, 风格: ${contentTypeAndStyle.toneStyle}`
    );

    // 提取关键主题和关键词
    const themesAndKeywords = await retryWrapper(extractThemesAndKeywords)(
      prompt,
      topicAndAudience
    );
    logger.info(`提取了 ${themesAndKeywords.keyThemes.length} 个关键主题`);

    // 确定内容目标和建议结构
    const goalsAndStructure = await retryWrapper(determineGoalsAndStructure)(
      prompt,
      topicAndAudience,
      contentTypeAndStyle,
      themesAndKeywords
    );
    logger.info(`确定了 ${goalsAndStructure.contentGoals.length} 个内容目标`);

    // 生成研究建议
    const researchSuggestions = await retryWrapper(generateResearchSuggestions)(
      topicAndAudience,
      themesAndKeywords.keyThemes
    );
    logger.info(`生成了 ${researchSuggestions.length} 条研究建议`);

    // 确定合适的字数范围
    const wordCountRange = retryWrapper(determineWordCountRange)(
      contentTypeAndStyle.contentType,
      500, // 默认最小字数
      3000 // 默认最大字数
    );
    logger.info(`建议字数范围: ${wordCountRange.min}-${wordCountRange.max} 字`);

    // 组合分析结果
    const analysis: PromptAnalysis = {
      ...topicAndAudience,
      ...contentTypeAndStyle,
      ...themesAndKeywords,
      suggestedStructure: goalsAndStructure.suggestedStructure,
      contentGoals: goalsAndStructure.contentGoals,
      researchSuggestions,
      wordCountRange,
    };

    logger.success('提示分析完成');
    return analysis;
  } catch (error) {
    logger.error(`分析提示时出错: ${error instanceof Error ? error.message : String(error)}`);
    throw new Error(`提示分析失败: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * 提取主题和目标受众
 */
async function extractTopicAndAudience(prompt: string): Promise<{
  topic: string;
  targetAudience: string;
}> {
  const model = createModel();
  const { object } = await generateObject({
    model,
    system: `你是一个专业的内容分析专家，擅长从用户提示中提取主题和目标受众信息。
请分析用户的提示，识别其中的主要主题和目标受众。`,
    prompt: `请从以下提示中提取主题和目标受众:

"${prompt}"

请详细分析这个提示，识别其中的主要主题和目标受众。`,
    schema: z.object({
      topic: z.string().describe('提示中的主要主题'),
      targetAudience: z
        .string()
        .describe('提示中的目标受众，如果未明确指出，请根据主题推断最可能的目标受众'),
    }),
  });

  return object;
}

/**
 * 确定内容类型和风格
 */
async function determineContentTypeAndStyle(
  prompt: string,
  topicAndAudience: { topic: string; targetAudience: string }
): Promise<{
  contentType: string;
  toneStyle: string;
}> {
  const model = createModel();
  const { object } = await generateObject({
    model,
    system: `你是一个专业的内容策划专家，擅长确定适合特定主题和受众的内容类型和风格。
请根据提供的主题和目标受众，确定最适合的内容类型和风格。`,
    prompt: `请为以下主题和目标受众确定适合的内容类型和风格:

主题: ${topicAndAudience.topic}
目标受众: ${topicAndAudience.targetAudience}
用户原始提示: "${prompt}"

请分析这些信息，确定最适合的内容类型（如教程、观点文章、新闻报道、产品评测等）和风格（如正式、专业、轻松、幽默等）。`,
    schema: z.object({
      contentType: z.string().describe('适合的内容类型，如教程、观点文章、新闻报道、产品评测等'),
      toneStyle: z.string().describe('适合的风格，如正式、专业、轻松、幽默等'),
    }),
  });

  return object;
}

/**
 * 提取关键主题和关键词
 */
async function extractThemesAndKeywords(
  prompt: string,
  topicAndAudience: { topic: string; targetAudience: string }
): Promise<{
  keyThemes: string[];
}> {
  const model = createModel();
  const { object } = await generateObject({
    model,
    output: 'object',
    system: `你是一个专业的内容分析专家，擅长从用户提示中提取关键主题和关键词。
请分析用户的提示，识别其中的关键主题和关键词，并为关键词分配合适的密度。`,
    prompt: `请从以下提示中提取关键主题和关键词:

主题: ${topicAndAudience.topic}
目标受众: ${topicAndAudience.targetAudience}
用户原始提示: "${prompt}"

请分析这些信息，提取关键主题和关键词`,
    schema: z.object({
      keyThemes: z.array(z.string()).describe('提示中的关键主题列表'),
    }),
  });

  return object;
}

/**
 * 确定内容目标和建议结构
 */
async function determineGoalsAndStructure(
  prompt: string,
  topicAndAudience: { topic: string; targetAudience: string },
  contentTypeAndStyle: { contentType: string; toneStyle: string },
  themesAndKeywords: { keyThemes: string[] }
): Promise<{
  contentGoals: string[];
  suggestedStructure: string;
}> {
  const model = createModel();
  const { object } = await generateObject({
    model,
    system: `你是一个专业的内容策划专家，擅长确定内容目标和建议结构。
请根据提供的信息，确定内容的主要目标和建议的结构。`,
    prompt: `请为以下内容确定主要目标和建议结构:

主题: ${topicAndAudience.topic}
目标受众: ${topicAndAudience.targetAudience}
内容类型: ${contentTypeAndStyle.contentType}
风格: ${contentTypeAndStyle.toneStyle}
关键主题: ${themesAndKeywords.keyThemes.join(', ')}
用户原始提示: "${prompt}"

请分析这些信息，确定内容的主要目标（如教育、说服、娱乐等）和建议的结构（如问题-解决方案、时间顺序、比较对比等）。`,
    schema: z.object({
      contentGoals: z.array(z.string()).describe('内容的主要目标列表，如教育、说服、娱乐等'),
      suggestedStructure: z
        .string()
        .describe('建议的内容结构，如问题-解决方案、时间顺序、比较对比等'),
    }),
  });

  return object;
}

/**
 * 生成研究建议
 */
async function generateResearchSuggestions(
  topicAndAudience: { topic: string; targetAudience: string },
  keyThemes: string[]
): Promise<string[]> {
  const model = createModel();
  const { object } = await generateObject({
    model,
    system: `你是一个专业的研究专家，擅长为内容创作提供研究建议。
请根据提供的主题、目标受众和关键主题，生成有价值的研究建议。`,
    prompt: `请为以下内容生成研究建议:

主题: ${topicAndAudience.topic}
目标受众: ${topicAndAudience.targetAudience}
关键主题: ${keyThemes.join(', ')}

请提供5-10条具体的研究建议，包括可能的信息来源、需要探索的问题、可能的数据点等。`,
    schema: z.object({
      suggestions: z.array(z.string()).describe('研究建议列表'),
    }),
  });

  return object.suggestions;
}

/**
 * 确定合适的字数范围
 */
function determineWordCountRange(
  contentType: string,
  minWordCount: number,
  maxWordCount: number
): { min: number; max: number } {
  // 根据内容类型调整字数范围
  let min = minWordCount;
  let max = maxWordCount;

  switch (contentType.toLowerCase()) {
    case '新闻报道':
    case '新闻':
    case '简讯':
      min = Math.max(300, min);
      max = Math.min(1500, max);
      break;
    case '博客':
    case '博客文章':
      min = Math.max(500, min);
      max = Math.min(2000, max);
      break;
    case '深度文章':
    case '研究报告':
    case '白皮书':
      min = Math.max(1500, min);
      max = Math.min(5000, max);
      break;
    case '教程':
    case '指南':
      min = Math.max(800, min);
      max = Math.min(3000, max);
      break;
    case '产品评测':
    case '评论':
      min = Math.max(700, min);
      max = Math.min(2500, max);
      break;
    default:
      // 使用默认值
      break;
  }

  return { min, max };
}
