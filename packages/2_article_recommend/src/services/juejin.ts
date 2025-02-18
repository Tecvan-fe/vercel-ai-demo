import { request } from '../utils/request';
import type { JuejinFeedResponse, Article } from '../types';
import axios from 'axios';
import { pureHtml } from '../utils/pureHtml';
import { logger } from '../utils/logger';

export async function getLatestArticles(
  params: { limit: number; cursor?: string } = { limit: 20 }
): Promise<Article[]> {
  logger.info(`正在获取最新文章列表，数量: ${params.limit}`);
  const { limit, cursor } = params;
  const requestBody = {
    id_type: 2,
    sort_type: 300,
    cate_id: '6809637767543259144',
    tag_id: '6809640407484334093',
    limit,
    cursor,
  };
  const res = await request.post<JuejinFeedResponse>(
    '/recommend_api/v1/article/recommend_cate_tag_feed',
    requestBody,
    {
      params: { spider: 1 },
    }
  );
  const data = res.data;

  return data.map((r: any) => ({
    ...r,
    article_url: `https://juejin.cn/post/${r.article_id}`,
  })) as Article[];
}

export async function getArticleDetail(articleUrl: string): Promise<string> {
  logger.info(`正在获取文章详情: ${articleUrl}`);
  const res = await axios.get(articleUrl);
  logger.info(`获取文章详情成功: ${articleUrl}`);
  return pureHtml(res.data);
}
