import { Command } from 'commander';
import fs from 'fs/promises';
import path from 'path';
import { getLatestArticles } from './services/juejin';
import { getRatings, generateSummary } from './services/llm';
import { generateReport } from './utils/report';
import dayjs from 'dayjs';
import _ from 'lodash';
import { type ArticleDetail } from './types';
import { logger } from './utils/logger';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// 添加这些辅助函数来模拟 __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function generateDailyRecommend() {
  logger.info('开始获取掘金文章...');
  // 1. 获取最新文章
  const articles = await getLatestArticles({ limit: 30 });
  logger.success(`成功获取 ${articles.length} 篇文章`);

  // 2. 评估并筛选文章
  const ratings = await getRatings(articles);

  logger.info('开始筛选高质量文章...');
  // 筛选评分最高的5篇文章
  const qualityArticles = await Promise.all(
    _.sortBy(ratings, 'score')
      .reverse()
      .slice(0, 5)
      .map(async (article) => {
        logger.info(`正在生成文章摘要: ${article.title}`);
        return {
          ...article,
          summary: await generateSummary(article),
        } as ArticleDetail;
      })
  );
  logger.success(`已选出 ${qualityArticles.length} 篇优质文章`);

  logger.info('开始生成推荐报告...');
  // 4. 生成报告内容
  const today = new Date();
  const content = generateReport(qualityArticles, { date: today });

  // 5. 保存文件
  const outputDir = path.resolve(__dirname, '../../../docs/juejin');
  await fs.mkdir(outputDir, { recursive: true });
  const fileName = dayjs(today).format('YYYY-MM-DD');
  const filePath = path.join(outputDir, `${fileName}.md`);
  await fs.writeFile(filePath, content, 'utf-8');
  logger.success(`推荐文章已保存到: ${filePath}`);
  logger.info('推荐内容:');
  console.log(content);
}

const main = () => {
  const program = new Command();
  program
    .name('juejin-recommender')
    .description('基于 LLM 的掘金文章推荐机器人')
    .version('1.0.0')
    .command('generate')
    .description('生成今日推荐文章')
    .action(generateDailyRecommend);

  program.parse();
};

main();
