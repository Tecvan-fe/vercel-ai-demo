import { GenerateOptions, PromptAnalysis, SearchResult } from './types';
import { logger } from '@demo/common';
import { generateText, generateObject, NoObjectGeneratedError, tool } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import { retryWrapper } from '@demo/common';
import * as fs from 'fs/promises';
import * as path from 'path';

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
 * 读取文件内容
 * @param filePath 文件路径
 * @returns 文件内容
 */
async function readFileContent(filePath: string): Promise<string> {
  try {
    // 处理相对路径和绝对路径
    const normalizedPath = path.isAbsolute(filePath)
      ? filePath
      : path.resolve(process.cwd(), filePath);
    const content = await fs.readFile(normalizedPath, 'utf-8');
    return content;
  } catch (error) {
    logger.error(`读取文件失败: ${error instanceof Error ? error.message : String(error)}`);
    throw new Error(
      `无法读取文件 ${filePath}: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

// 定义文件读取工具
const readFileTool = tool({
  description: '读取指定路径的文件内容，当用户提示中包含文件路径，需要读取文件内容时使用',
  parameters: z.object({
    filePath: z.string().describe('要读取的文件的路径'),
  }),
  execute: async ({ filePath }) => {
    try {
      const content = await readFileContent(filePath);
      return { content, success: true };
    } catch (error) {
      return {
        content: '',
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  },
});

/**
 * 分析提示中是否包含文件路径，并读取文件内容
 * @param prompt 用户提示
 * @returns 增强后的提示（如果包含文件内容）或原始提示
 */
async function extractFileContent(prompt: string): Promise<string> {
  const model = createModel();
  const { text, steps } = await generateText({
    model,
    tools: {
      readFile: readFileTool,
    },
    maxSteps: 5, // 允许模型先读取文件，然后再回复
    system: `你是一个智能助手，需要分析用户的提示。
如果用户提示中包含文件路径，并且需要读取该文件的内容才能完成任务，请使用readFile工具读取文件内容。
文件路径通常是以/开头的绝对路径或相对路径，例如/path/to/file.md或./file.md。`,
    prompt: `请分析以下用户提示，判断是否需要读取文件：
"${prompt}"

如果需要读取文件，请使用readFile工具读取文件内容。如果不需要，请直接回复"无需读取文件"。`,
  });

  // 检查是否有工具调用
  const hasToolCalls = steps.some((step) => step.toolCalls && step.toolCalls.length > 0);

  if (hasToolCalls) {
    // 找到文件读取工具的调用结果
    for (const step of steps) {
      if (step.toolResults && step.toolResults.length > 0) {
        for (const result of step.toolResults) {
          if (
            result.result &&
            typeof result.result === 'object' &&
            'content' in result.result &&
            result.result.success
          ) {
            // 找到成功的文件读取结果
            const fileContent = result.result.content as string;
            if (fileContent) {
              logger.success(`成功读取文件内容`);
              // 将文件内容添加到提示中
              return `${prompt}\n\n文件内容:\n${fileContent}`;
            }
          }
        }
      }
    }
  } else {
    logger.info('模型判断无需读取文件');
  }

  // 如果没有成功读取文件，返回原始提示
  return prompt;
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
    // 使用大模型分析提示，判断是否需要读取文件
    const enhancedPrompt = await retryWrapper(extractFileContent)(prompt);

    // 提取主题和目标受众
    const topicAndAudience = await retryWrapper(extractTopicAndAudience)(enhancedPrompt);
    logger.info(
      `识别主题: "${topicAndAudience.topic}" 目标受众: "${topicAndAudience.targetAudience}"`
    );

    // 确定内容类型和风格
    const contentTypeAndStyle = await retryWrapper(determineContentTypeAndStyle)(
      enhancedPrompt,
      topicAndAudience
    );
    logger.info(
      `确定内容类型: ${contentTypeAndStyle.contentType}, 风格: ${contentTypeAndStyle.toneStyle}`
    );

    // 提取关键主题和关键词
    const themesAndKeywords = await retryWrapper(extractThemesAndKeywords)(
      enhancedPrompt,
      topicAndAudience
    );
    logger.info(`提取了 ${themesAndKeywords.keyThemes.length} 个关键主题`);

    // 确定内容目标和建议结构
    const goalsAndStructure = await retryWrapper(determineGoalsAndStructure)(
      enhancedPrompt,
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
    const wordCountRange = await retryWrapper(determineWordCountRangeAsync)(
      contentTypeAndStyle.contentType,
      500, // 默认最小字数
      3000 // 默认最大字数
    );
    logger.info(`建议字数范围: ${wordCountRange.min}-${wordCountRange.max} 字`);

    // 生成关键词密度
    const keywordDensity = generateKeywordDensity(themesAndKeywords.keyThemes);
    logger.info(`生成了 ${Object.keys(keywordDensity).length} 个关键词的密度建议`);

    // 组合分析结果
    const analysis: PromptAnalysis = {
      ...topicAndAudience,
      ...contentTypeAndStyle,
      ...themesAndKeywords,
      suggestedStructure: goalsAndStructure.suggestedStructure,
      contentGoals: goalsAndStructure.contentGoals,
      researchSuggestions,
      wordCountRange,
      keywordDensity,
    };

    logger.success('提示分析完成');
    return analysis;
  } catch (error) {
    logger.error(`分析提示时出错: ${error instanceof Error ? error.message : String(error)}`);
    throw new Error(`提示分析失败: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * 生成关键词密度
 */
function generateKeywordDensity(keyThemes: string[]): { [keyword: string]: number } {
  const density: { [keyword: string]: number } = {};

  // 为每个关键主题分配一个合理的密度值
  keyThemes.forEach((theme, index) => {
    // 主要关键词密度略高，后面的关键词密度逐渐降低
    const baseValue = 3.0; // 基础密度值
    const decayFactor = 0.5; // 衰减因子

    // 计算密度，确保在合理范围内 (1.0-5.0%)
    const calculatedDensity = Math.max(1.0, Math.min(5.0, baseValue - index * decayFactor));

    // 四舍五入到一位小数
    density[theme] = Math.round(calculatedDensity * 10) / 10;
  });

  return density;
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
 * 确定合适的字数范围 (异步包装)
 */
async function determineWordCountRangeAsync(
  contentType: string,
  minWordCount: number,
  maxWordCount: number
): Promise<{ min: number; max: number }> {
  return determineWordCountRange(contentType, minWordCount, maxWordCount);
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
