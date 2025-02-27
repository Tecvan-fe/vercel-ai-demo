import fs from 'fs';
import path from 'path';
import { ArticleContent, SectionContent } from './types';
import { logger } from '@demo/common';
import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

// 创建 OpenAI 模型
const createModel = (modelName = 'gpt-4o') => {
  return openai(modelName);
};

/**
 * 将文章内容保存为 Markdown 文件
 * @param article 文章内容
 * @param outputDir 输出目录
 * @returns 保存的文件路径
 */
export async function saveArticleToMarkdown(
  article: ArticleContent,
  outputDir: string = './output'
): Promise<string> {
  try {
    // 确保输出目录存在
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // 生成文件名
    const fileName = generateFileName(article.title);
    const filePath = path.join(outputDir, fileName);

    // 生成Markdown内容
    const markdown = `# ${article.title}

${article.introduction}

${article.sections
  .map(
    (section: SectionContent) => `
## ${section.title}

${section.content}

${
  section.subsections
    ? section.subsections
        .map(
          (sub: SectionContent) => `
### ${sub.title}

${sub.content}
`
        )
        .join('')
    : ''
}`
  )
  .join('')}

## 结论

${article.conclusion}
`;

    // 写入文件
    fs.writeFileSync(filePath, markdown);
    logger.success(`文章已保存至: ${filePath}`);

    return filePath;
  } catch (error) {
    logger.error(`保存文章时出错: ${error}`);
    throw error;
  }
}

/**
 * 根据标题生成文件名
 * @param title 文章标题
 * @returns 文件名
 */
function generateFileName(title: string): string {
  // 移除特殊字符，替换空格为连字符
  const sanitized = title
    .toLowerCase()
    .replace(/[^\w\s\u4e00-\u9fa5]/g, '')
    .replace(/\s+/g, '-');

  // 添加时间戳，确保文件名唯一
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').substring(0, 19);
  return `${sanitized}-${timestamp}.md`;
}

/**
 * 将文章内容转换为 Markdown 格式
 * @param content 文章内容
 * @returns Markdown 格式的文章内容
 */
async function convertToMarkdown(content: ArticleContent): Promise<string> {
  try {
    // 使用 AI 将内容转换为格式良好的 Markdown
    const model = createModel();
    const { text } = await generateText({
      model,
      system: `你是一位专业的 Markdown 格式化专家。你的任务是将提供的文章内容转换为格式良好的 Markdown 文档。`,
      prompt: `请将以下文章内容转换为格式良好的 Markdown 文档。

文章标题: "${content.title}"

文章章节:
${content.sections
  .map(
    (section) => `
## ${section.title}
${section.content}
${
  section.subsections
    ? section.subsections
        .map(
          (sub) => `
### ${sub.title}
${sub.content}
`
        )
        .join('')
    : ''
}
`
  )
  .join('')}

请确保:
1. 使用适当的 Markdown 标记（#、##、### 等）
2. 正确格式化段落、列表和引用
3. 保持内容的完整性和准确性
4. 添加适当的空行，使文档结构清晰

请返回完整的 Markdown 文档。`,
    });

    return text;
  } catch (error) {
    logger.error(`转换为 Markdown 时出错: ${error}`);

    // 如果 AI 转换失败，使用基本的 Markdown 格式
    let markdown = `# ${content.title}\n\n`;

    for (const section of content.sections) {
      markdown += `## ${section.title}\n\n${section.content}\n\n`;

      if (section.subsections) {
        for (const subsection of section.subsections) {
          markdown += `### ${subsection.title}\n\n${subsection.content}\n\n`;
        }
      }
    }

    return markdown;
  }
}

/**
 * 将文章内容保存为 HTML 文件
 * @param content 文章内容
 * @param outputDir 输出目录
 * @returns 保存的文件路径
 */
export async function saveArticleToHtml(
  content: ArticleContent,
  outputDir: string
): Promise<string> {
  try {
    // 确保输出目录存在
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // 生成文件名
    const fileName = generateFileName(content.title).replace('.md', '.html');
    const filePath = path.join(outputDir, fileName);

    // 将文章内容转换为 HTML 格式
    const html = await convertToHtml(content);

    // 写入文件
    fs.writeFileSync(filePath, html, 'utf8');
    logger.success(`HTML 文章已保存至: ${filePath}`);

    return filePath;
  } catch (error) {
    logger.error(`保存 HTML 文章时出错: ${error}`);
    throw error;
  }
}

/**
 * 将文章内容转换为 HTML 格式
 * @param content 文章内容
 * @returns HTML 格式的文章内容
 */
async function convertToHtml(content: ArticleContent): Promise<string> {
  try {
    // 使用 AI 将内容转换为格式良好的 HTML
    const model = createModel();
    const { text } = await generateText({
      model,
      system: `你是一位专业的 HTML 格式化专家。你的任务是将提供的文章内容转换为格式良好的 HTML 文档。`,
      prompt: `请将以下文章内容转换为格式良好的 HTML 文档。

文章标题: "${content.title}"

文章章节:
${content.sections
  .map(
    (section) => `
## ${section.title}
${section.content}
${
  section.subsections
    ? section.subsections
        .map(
          (sub) => `
### ${sub.title}
${sub.content}
`
        )
        .join('')
    : ''
}
`
  )
  .join('')}

请确保:
1. 使用适当的 HTML 标签（h1、h2、h3、p 等）
2. 添加基本的 CSS 样式，使文档美观易读
3. 保持内容的完整性和准确性
4. 创建一个完整的 HTML 文档，包括 <!DOCTYPE>、<html>、<head> 和 <body> 标签

请返回完整的 HTML 文档。`,
    });

    return text;
  } catch (error) {
    logger.error(`转换为 HTML 时出错: ${error}`);

    // 如果 AI 转换失败，使用基本的 HTML 格式
    let html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${content.title}</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px; }
    h1 { color: #333; }
    h2 { color: #444; margin-top: 30px; }
    h3 { color: #555; }
    p { margin-bottom: 16px; }
  </style>
</head>
<body>
  <h1>${content.title}</h1>
`;

    for (const section of content.sections) {
      html += `  <h2>${section.title}</h2>\n  <div>${section.content.replace(/\n/g, '<br>')}</div>\n\n`;

      if (section.subsections) {
        for (const subsection of section.subsections) {
          html += `  <h3>${subsection.title}</h3>\n  <div>${subsection.content.replace(/\n/g, '<br>')}</div>\n\n`;
        }
      }
    }

    html += `</body>\n</html>`;
    return html;
  }
}
