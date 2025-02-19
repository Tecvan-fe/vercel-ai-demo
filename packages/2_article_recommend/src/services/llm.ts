import pLimit from 'p-limit';

import { logger } from '../utils/logger';
import type { Article } from '../types';
import { getArticleDetail } from './juejin';
import { runPrompt } from './llm-provider';
import { parseLlmEval } from '../utils/parseLlmJson';

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

请最终只返回一个数字，例如：65
`;

  const prompt = `
  文章标题: ${title}
  文章内容: ${content}
  `;

  const response = await runPrompt({ systemPrompt, userPrompt: prompt });
  try {
    const score = parseLlmEval(response);
    return {
      score,
      analysis: response,
    };
  } catch (e) {
    logger.error(`评估文章失败: ${(e as Error).message}`);
    logger.error(response);
    if (retryTime <= 0) {
      logger.error('重试次数已用完,放弃评估');
      return {
        score: 0,
        analysis: '评估失败',
      };
    }
    logger.info(`将进行第${3 - retryTime}次重试`);
    return await evaluateArticle(article, retryTime - 1);
  }
}

export async function generateSummary(article: {
  title: string;
  content: string;
}): Promise<string> {
  const systemPrompt = `你是一位专业的文章分析专家 + 暴躁老哥。请对以下文章进行全面的内容总结，请按照以下框架进行分析：

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

【推荐理由】
用 100 字左右简明扼要地概括整篇文章的核心内容，并给出推荐理由


输出要求：
1. 保持客观准确，不添加个人观点
2. 保留文章的专业术语，必要时提供简短解释
3. 突出文章的逻辑关系和重要观点
4. 使用清晰的层级结构呈现
5. 确保总结内容完整且连贯
6. 推荐理由需要简短，不要超过100字
7. 语气特征：
  - 说话强硬、直接、火气很大
  - 经常使用感叹号和省略号
  - 喜欢用反问句和反讽
  - 经常爆粗口（但不要太过分）
  - 语气词使用：卧槽、我靠、搞毛啊、搞什么飞机、震惊我一整年
  
  用词特点：
  - 口语化表达为主
  - 经常使用网络流行语
  - 夸张的形容词
  - 重复强调的语气词
  - 使用"老子"自称
  
1. 保持暴躁但不失幽默
2. 不能真正带有攻击性
3. 回答要有观点但语气要夸张
4. 可以适当使用表情符号
5. 要有互联网暴躁老哥的特色
  
  请用这种风格总结文章内容。记住要保持角色特征，但不能太过火或带有真正的攻击性。
  
  示例回复：
  "卧槽！！这问题问的我差点原地爆炸！！老子给你讲......"
  "震惊我一整年！你居然不知道这个？？？我简直....."
  "搞什么飞机？？这么简单的东西你都不会？？老子现在就教你！"
  
如果文章包含代码示例，请额外提供：
- 代码的主要功能说明
- 关键实现逻辑
- 重要的技术要点`;

  const prompt = `
  请简要总结这篇技术文章的主要内容(200字以内):
  
  文章标题: ${article.title}
  文章内容: ${article.content}
  `;

  const res = await runPrompt({ systemPrompt, userPrompt: prompt });
  // 这里是用 deepseek 生成的结果，可能包含 <think>xxjiofwe</think>
  // 需要过滤掉这段 think
  // 过滤掉 <think> 标签及其内容
  const filteredRes = res.replace(/<think\b[^<]*(?:(?!<\/think>)<[^<]*)*<\/think>/gi, '').trim();
  return filteredRes;
}

export async function getRatings(
  articles: Article[]
): Promise<Array<ArticleRating & { title: string; content: string; link: string }>> {
  logger.info('开始批量评估文章质量...');

  // 限制最大并发为3
  const limit = pLimit(3);

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
