import dayjs from 'dayjs';
import type { ArticleDetail } from '../types';

interface ReportOptions {
  date?: Date;
}

interface JsonReport {
  date: string;
  articles: ArticleDetail[];
}

export function generateMarkdownReport(
  articles: ArticleDetail[],
  options: ReportOptions = {}
): string {
  const { date = new Date() } = options;
  const today = dayjs(date).format('YYYY-MM-DD');

  return `# 掘金优质文章推荐 (${today})

${articles
  .map(
    (article, index) => `
## ${index + 1}. ${article.title}

链接: ${article.link}

评分: ${article.score}分

摘要: ${article.summary}
`
  )
  .join('\n')}`;
}

export function generateJsonReport(
  articles: ArticleDetail[],
  options: ReportOptions = {}
): JsonReport {
  const { date = new Date() } = options;
  const today = dayjs(date).format('YYYY-MM-DD');

  return {
    date: today,
    articles,
  };
}

export function generateReport(
  articles: ArticleDetail[],
  options: ReportOptions & { format?: 'markdown' | 'json' } = {}
): string {
  const { format = 'markdown', ...rest } = options;

  if (format === 'json') {
    return JSON.stringify(generateJsonReport(articles, rest), null, 2);
  }

  return generateMarkdownReport(articles, rest);
}
