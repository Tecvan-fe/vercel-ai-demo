import axios from 'axios';
import { logger } from '@demo/common';
import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import { SearchResult, SearchOptions } from './types';

// 创建 OpenAI 模型
const createModel = (modelName = 'gpt-4o') => {
  return openai(modelName);
};

/**
 * 使用 Perplexity API 搜索信息
 * @param query 搜索查询
 * @param options 搜索选项
 * @returns 搜索结果
 */
export async function searchPerplexity(
  query: string,
  options: SearchOptions = {}
): Promise<SearchResult[]> {
  const maxResults = options.maxResults || 10;

  try {
    logger.info(`通过 Perplexity 搜索: "${query}"`);

    // 检查 API 密钥是否存在
    if (!process.env.PERPLEXITY_API_KEY) {
      logger.warn('警告: 未设置 PERPLEXITY_API_KEY 环境变量，将使用模拟数据');
      return getMockSearchResults(query);
    }

    const response = await axios.post(
      'https://api.perplexity.ai/search',
      {
        query,
        max_results: maxResults,
        recent_only: options.recentOnly || false,
        source_priority: options.sourcePriority || [],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (response.status !== 200) {
      logger.error(`Perplexity 搜索失败: ${response.status} ${response.statusText}`);
      return [];
    }

    const results = response.data.results.map((result: any) => ({
      title: result.title,
      content: result.snippet || '',
      url: result.url,
      type: determineResultType(result),
    }));

    logger.success(`搜索完成，获取到 ${results.length} 条结果`);
    return results;
  } catch (error) {
    logger.error(`搜索时出错: ${error}`);
    return getMockSearchResults(query);
  }
}

/**
 * 使用 Google 自定义搜索引擎搜索信息
 * @param query 搜索查询
 * @param options 搜索选项
 * @returns 搜索结果
 */
export async function searchGoogle(
  query: string,
  options: SearchOptions = {}
): Promise<SearchResult[]> {
  const maxResults = options.maxResults || 10;

  try {
    logger.info(`通过 Google 搜索: "${query}"`);

    // 检查 API 密钥是否存在
    if (!process.env.GOOGLE_API_KEY || !process.env.GOOGLE_CSE_ID) {
      logger.warn('警告: 未设置 GOOGLE_API_KEY 或 GOOGLE_CSE_ID 环境变量，将使用模拟数据');
      return getMockSearchResults(query);
    }

    const response = await axios.get('https://www.googleapis.com/customsearch/v1', {
      params: {
        key: process.env.GOOGLE_API_KEY,
        cx: process.env.GOOGLE_CSE_ID,
        q: query,
        num: maxResults,
      },
    });

    if (response.status !== 200) {
      logger.error(`Google 搜索失败: ${response.status} ${response.statusText}`);
      return [];
    }

    const results = response.data.items.map((item: any) => ({
      title: item.title,
      content: item.snippet || '',
      url: item.link,
      type: determineResultType(item),
    }));

    logger.success(`搜索完成，获取到 ${results.length} 条结果`);
    return results;
  } catch (error) {
    logger.error(`搜索时出错: ${error}`);
    return getMockSearchResults(query);
  }
}

/**
 * 确定搜索结果类型
 */
function determineResultType(item: any): 'web' | 'academic' | 'news' | 'blog' {
  // 根据URL或内容特征确定类型
  const url = item.url.toLowerCase();
  const title = item.title.toLowerCase();
  const content = item.content.toLowerCase();

  if (
    url.includes('news') ||
    url.includes('cnn') ||
    url.includes('bbc') ||
    title.includes('报道')
  ) {
    return 'news';
  }

  if (
    url.includes('research') ||
    url.includes('paper') ||
    url.includes('study') ||
    url.includes('edu') ||
    title.includes('研究')
  ) {
    return 'academic';
  }

  if (
    url.includes('blog') ||
    url.includes('medium') ||
    url.includes('wordpress') ||
    title.includes('博客')
  ) {
    return 'blog';
  }

  // 默认为网页
  return 'web';
}

/**
 * 获取模拟搜索结果
 */
async function getMockSearchResults(query: string): Promise<SearchResult[]> {
  logger.info('使用模拟搜索结果...');

  // 使用 AI 生成模拟搜索结果
  const model = createModel('gpt-4o');
  const { object } = await generateObject({
    model,
    system: `你是一个搜索引擎模拟器，能够为给定的查询生成逼真的搜索结果。
请为提供的查询生成模拟搜索结果，包括标题、内容摘要、URL和类型。
结果应该多样化，包括不同类型的网站（如新闻、博客、学术网站等）。`,
    prompt: `请为以下查询生成10条模拟搜索结果:

"${query}"

请确保结果多样化，包括不同类型的网站，并且内容与查询高度相关。`,
    schema: z.object({
      results: z
        .array(
          z.object({
            title: z.string().describe('搜索结果标题'),
            content: z.string().describe('搜索结果内容摘要'),
            url: z.string().describe('搜索结果URL'),
            type: z.enum(['web', 'academic', 'news', 'blog']).describe('结果类型'),
          })
        )
        .describe('搜索结果列表'),
    }),
  });

  return object.results;
}

/**
 * 模拟搜索结果
 */
function mockSearchResults(query: string, options: SearchOptions = {}): SearchResult[] {
  const results: SearchResult[] = [
    {
      title: '人工智能在现代社会中的应用',
      content:
        '人工智能技术已经广泛应用于各个领域，包括医疗、金融、教育和交通等。在医疗领域，AI可以帮助医生诊断疾病、预测患者风险和开发新药。在金融领域，AI被用于欺诈检测、算法交易和个性化银行服务。',
      url: 'https://example.com/ai-applications',
      type: 'web',
    },
    {
      title: '机器学习算法的最新进展',
      content:
        '近年来，机器学习算法取得了显著进步，特别是在深度学习领域。新的模型架构如Transformer和图神经网络正在推动自然语言处理和图数据分析的边界。同时，强化学习在游戏和机器人控制方面也取得了突破性进展。',
      url: 'https://example.com/ml-advances',
      type: 'academic',
    },
    {
      title: '大型语言模型的伦理考量',
      content:
        '随着GPT和其他大型语言模型的兴起，关于AI伦理的讨论变得越来越重要。这些模型可能会产生有偏见的内容、传播错误信息或被用于创建欺骗性内容。研究人员和政策制定者正在努力制定框架来确保这些技术的负责任使用。',
      url: 'https://example.com/llm-ethics',
      type: 'blog',
    },
    {
      title: '人工智能在气候变化研究中的应用',
      content:
        '科学家们正在利用AI技术分析气候数据、预测极端天气事件并优化能源使用。机器学习模型可以处理卫星图像、传感器数据和历史气候记录，帮助我们更好地理解和应对气候变化的挑战。',
      url: 'https://example.com/ai-climate',
      type: 'news',
    },
  ];

  // 应用过滤条件
  let filteredResults = [...results];

  // 根据来源优先级过滤
  if (options.sourcePriority && options.sourcePriority.length > 0) {
    filteredResults = filteredResults.filter((result) =>
      options.sourcePriority!.includes(result.type)
    );
  }

  // 限制结果数量
  const maxResults = options.maxResults || 10;
  filteredResults = filteredResults.slice(0, maxResults);

  return filteredResults;
}
