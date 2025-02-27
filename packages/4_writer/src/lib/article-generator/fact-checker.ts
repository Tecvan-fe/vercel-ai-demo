import {
  ArticleContent,
  SectionContent,
  GenerateOptions,
  FactCheckResult,
  FactIssue,
} from './types';
import { logger } from '@demo/common';
import { generateText, generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import { retryWrapper } from '@demo/common';

// 创建 OpenAI 模型
const createModel = (modelName = 'gpt-4o') => {
  return openai(modelName);
};

/**
 * 对文章内容进行事实检查
 * @param article 文章内容
 * @param options 生成选项
 * @returns 事实检查结果
 */
export async function factChecker(
  article: ArticleContent,
  options: GenerateOptions
): Promise<FactCheckResult> {
  logger.info('开始对文章进行事实检查...');

  // 提取需要检查的关键事实声明
  const factStatements = await retryWrapper(extractFactStatements)(article);
  logger.info(`提取了 ${factStatements.length} 个事实声明进行验证`);

  // 验证每个事实声明
  const factIssues: FactIssue[] = [];
  for (const statement of factStatements) {
    try {
      const verificationResult = await retryWrapper(verifyFactStatement)(statement, options);

      if (!verificationResult.isAccurate) {
        factIssues.push({
          statement,
          issue: verificationResult.issue || '未指明具体问题',
          correction: verificationResult.correction || '未提供修正',
          confidence: verificationResult.confidence,
          sources: verificationResult.sources || [],
        });

        logger.warn(
          `发现事实问题: "${statement}" - ${verificationResult.issue || '未指明具体问题'}`
        );
      }
    } catch (error) {
      logger.error(
        `验证声明时出错: "${statement}" - ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  // 如果发现事实问题，修正文章内容
  let correctedContent = article.content;
  if (factIssues.length > 0) {
    logger.info(`发现 ${factIssues.length} 个事实问题，正在修正...`);
    correctedContent = await retryWrapper(correctFactIssues)(article.content, factIssues, options);
  } else {
    logger.success('未发现事实问题，文章内容准确');
  }

  return {
    article,
    factIssues,
    correctedContent,
  };
}

/**
 * 提取文章中的事实性声明
 */
async function extractFactStatements(article: ArticleContent): Promise<string[]> {
  const { title, content } = article;

  const model = createModel('gpt-4o');
  const { object } = await generateObject({
    model,
    system: `你是一个专业的事实核查专家，擅长从文本中识别需要验证的事实性声明。
请从提供的文章中提取需要核查的事实性声明。
事实性声明通常包括:
1. 具体的数据和统计信息
2. 历史事件的描述
3. 科学或技术原理的陈述
4. 引用他人言论或研究结果
5. 关于现实世界的具体断言

不需要核查的内容包括:
1. 个人观点或主观评价
2. 常识性知识
3. 假设性陈述
4. 修辞性表达`,
    prompt: `请从以下文章中提取需要核查的事实性声明:

标题: ${title}
内容: ${content}`,
    schema: z.object({
      statements: z.array(z.string()).describe('需要核查的事实性声明列表'),
    }),
  });

  return object.statements;
}

/**
 * 验证事实性声明
 */
async function verifyFactStatement(
  statement: string,
  options: GenerateOptions
): Promise<{
  isAccurate: boolean;
  issue?: string;
  correction?: string;
  confidence: number;
  sources?: string[];
}> {
  const model = createModel('gpt-4o');
  const { object } = await generateObject({
    model,
    system: `你是一个专业的事实核查专家，擅长验证事实性声明的准确性。
请验证提供的事实性声明，判断其是否准确。
如果声明不准确，请指出问题所在，并提供正确的信息。
如果无法确定声明的准确性，请说明原因。`,
    prompt: `请验证以下事实性声明:

"${statement}"

请详细分析这个声明的准确性，并给出你的判断。`,
    schema: z.object({
      isAccurate: z.boolean().describe('声明是否准确'),
      issue: z.string().nullable().optional().describe('如果不准确，问题所在'),
      correction: z.string().nullable().optional().describe('如果不准确，正确的信息'),
      confidence: z.number().min(0).max(1).describe('判断的置信度，0-1之间'),
      sources: z.array(z.string()).nullable().optional().describe('支持判断的来源（如有）'),
    }),
  });

  return object;
}

/**
 * 修正文章中的事实问题
 */
async function correctFactIssues(
  content: string,
  factIssues: FactIssue[],
  options: GenerateOptions
): Promise<string> {
  const model = createModel('gpt-4o');
  const { text } = await generateText({
    model,
    system: `你是一个专业的内容编辑，擅长修正文章中的事实性错误。
请根据提供的事实问题列表，修正文章内容。
修正时应保持文章的风格和流畅性，使修改后的内容自然融入文章。`,
    prompt: `请修正以下文章中的事实性错误:

原文内容:
${content}

需要修正的事实问题:
${factIssues
  .map(
    (issue, index) =>
      `${index + 1}. 问题声明: "${issue.statement}"
     问题所在: ${issue.issue}
     正确信息: ${issue.correction}`
  )
  .join('\n\n')}

请返回修正后的完整文章内容。修正时应保持文章的风格和流畅性，使修改后的内容自然融入文章。`,
  });

  return text;
}
