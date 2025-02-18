import { deepseek } from '@ai-sdk/deepseek';
import { generateText } from 'ai';
import pLimit from 'p-limit';

import { logger } from '../utils/logger';
import type { Article } from '../types';
import { getArticleDetail } from './juejin';

// 限制最大并发为3
const limit = pLimit(3);

const runPrompt = async (params: { userPrompt: string; systemPrompt: string }) => {
  const { userPrompt, systemPrompt } = params;
  if (!userPrompt) {
    logger.error('未提供 prompt');
    throw new Error(
      'prompt is required, you can use "DEEPSEEK_API_KEY=<key> npx tsx src/index.ts <prompt>"'
    );
  }

  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    logger.error('未设置 DEEPSEEK_API_KEY 环境变量');
    throw new Error('DEEPSEEK_API_KEY is not set');
  }

  try {
    const { text } = await generateText({
      model: deepseek('deepseek-chat'),
      // @ts-ignore
      apiKey,
      system: systemPrompt,
      prompt: userPrompt,
    });
    return text;
  } catch (error) {
    logger.error(`LLM 调用失败: ${(error as Error).message}`);
    throw error;
  }
};

export interface ArticleRating {
  score: number;
  analysis: string;
}
export async function evaluateArticle(
  article: {
    title: string;
    content: string;
  },
  retryTime = 3
): Promise<ArticleRating> {
  if (retryTime <= 0) {
    throw new Error('evaluate article failed');
  }

  const { title, content } = article;
  const systemPrompt = `你是一位专业的文章质量分析专家。请对以下文章进行全面的质量分析，重点关注以下几个维度：

1. 内容质量（25分）
- 内容的准确性和可靠性
- 论述的深度和广度
- 观点的创新性和独特性
- 论证的逻辑性和完整性

2. 结构组织（25分）
- 文章结构是否清晰合理
- 段落之间的连贯性
- 重点内容的突出程度
- 文章层次感

3. 表达方式（25分）
- 语言的准确性和专业性
- 表述的清晰度和流畅度
- 专业术语的使用是否恰当
- 是否存在明显的语法或用词错误

4. 实用价值（25分）
- 对读者的参考价值
- 解决实际问题的程度
- 案例或示例的实用性
- 可操作性和可复现性

请提供：
1. 各维度的具体得分和详细分析
2. 文章的主要优点和亮点
3. 需要改进的地方和具体建议
4. 总体评分（满分100分）和总结性评价

请以专业、客观的角度进行分析，给出具体的评分依据和改进建议；注意，我传给你的文章主题将会是 html 格式，请注意甄别内容

请将内容组织为JSON 格式：

{
  "score": 85,
  "analysis": "文章结构清晰，内容丰富，但有些地方论证不够充分，建议加强逻辑性。"
}
`;

  const prompt = `
  文章标题: ${title}
  文章内容: ${content}
  `;

  try {
    const response = await runPrompt({ systemPrompt, userPrompt: prompt });
    const result = JSON.parse(response);
    return result as ArticleRating;
  } catch (e) {
    return await evaluateArticle(article, retryTime - 1);
  }
}

export async function generateSummary(article: {
  title: string;
  content: string;
}): Promise<string> {
  const systemPrompt = `你是一位专业的文章分析专家。请对以下文章进行全面的内容总结，请按照以下框架进行分析：

1. 核心要点提取（用简洁的要点列表形式）
- 文章的主要论点
- 关键概念解释
- 重要结论
- 核心数据或证据

2. 结构化总结
【主题】
用一句话概括文章的主要主题

【背景信息】
简要说明文章的背景和上下文

【主要内容】
- 分点概括文章的主要论述过程
- 突出重要的转折和关联
- 保留作者的核心论证路径

【结论观点】
总结文章的核心结论和观点

3. 知识图谱（用简单的层级结构展示）
- 核心概念
  - 相关要点
  - 关联内容
- 重要论述
  - 支撑论据
  - 实例说明

4. 精要总结
用 100 字左右简明扼要地概括整篇文章的核心内容

输出要求：
1. 保持客观准确，不添加个人观点
2. 保留文章的专业术语，必要时提供简短解释
3. 突出文章的逻辑关系和重要观点
4. 使用清晰的层级结构呈现
5. 确保总结内容完整且连贯

如果文章包含代码示例，请额外提供：
- 代码的主要功能说明
- 关键实现逻辑
- 重要的技术要点`;

  const prompt = `
  请简要总结这篇技术文章的主要内容(200字以内):
  
  文章标题: ${article.title}
  文章内容: ${article.content}
  `;

  return await runPrompt({ systemPrompt, userPrompt: prompt });
}

export async function getRatings(
  articles: Article[]
): Promise<Array<ArticleRating & { title: string; content: string; link: string }>> {
  logger.info('开始批量评估文章质量...');

  const ratings = await Promise.all(
    articles.map((article) =>
      limit(async () => {
        const id = article.article_id;
        const title = article.article_info.title;
        const articleUrl = `https://juejin.cn/post/${id}`;
        logger.info(`正在评估文章: ${title}`);

        const content = await getArticleDetail(articleUrl);
        const rating = await evaluateArticle({ title, content });
        logger.info(`文章 "${title}" 评分: ${rating.score}`);

        return {
          ...rating,
          title,
          content,
          link: articleUrl,
        };
      })
    )
  );

  logger.success(`完成 ${ratings.length} 篇文章的评估`);
  return ratings;
}
