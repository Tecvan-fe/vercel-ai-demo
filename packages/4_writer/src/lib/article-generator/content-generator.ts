import { GenerateOptions, Outline, OutlineSection, ArticleContent, SectionContent } from './types';
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
 * 生成文章内容
 * @param outline 文章大纲
 * @param options 生成选项
 * @returns 文章内容
 */
export async function contentGenerator(
  outline: Outline,
  options: GenerateOptions
): Promise<ArticleContent> {
  logger.info('开始生成文章内容...');
  const { title, sections } = outline;
  logger.info(`文章标题: ${title}`);
  logger.info(`章节数量: ${sections.length}`);

  // 生成文章引言
  logger.info('生成文章引言...');
  const introduction = await retryWrapper(generateIntroduction)(outline, options);
  logger.success('引言生成完成');

  // 逐章节生成内容
  logger.info('开始逐章节生成内容...');
  const sectionContents: SectionContent[] = [];
  for (const section of sections) {
    logger.info(`生成章节内容: ${section.title}`);
    const sectionContent = await retryWrapper(generateSectionContent)(section, outline, options);
    logger.success(`章节 "${section.title}" 内容生成完成`);

    // 分析是否需要添加流程图
    logger.info(`分析章节 "${section.title}" 是否需要添加流程图...`);
    const contentWithDiagram = await retryWrapper(addDiagramIfNeeded)(sectionContent, options);
    logger.success(`章节 "${section.title}" 流程图分析完成`);

    sectionContents.push(contentWithDiagram);
  }
  logger.success(`所有章节内容生成完成，共 ${sectionContents.length} 个章节`);

  // 生成结论
  logger.info('生成文章结论...');
  const conclusion = await retryWrapper(generateConclusion)(outline, sectionContents, options);
  logger.success('结论生成完成');

  // 组合完整内容
  logger.info('组合完整文章内容...');
  const fullContent = combineContent(title, introduction, sectionContents, conclusion);
  logger.success('文章内容组合完成');
  logger.info(`文章总字数: ${fullContent.length}`);

  return {
    title,
    introduction,
    sections: sectionContents,
    conclusion,
    content: fullContent,
  };
}

/**
 * 生成文章引言
 */
async function generateIntroduction(outline: Outline, options: GenerateOptions): Promise<string> {
  logger.info('调用AI生成引言...');
  const model = createModel(options.model);
  const { text } = await generateText({
    model,
    system: `你是一个专业的内容创作者，擅长为文章创作引人入胜的引言。
请根据提供的文章标题和章节，创作一个引人入胜的引言。`,
    prompt: `请为以下文章创作一个引人入胜的引言:

标题: ${outline.title}
章节: ${outline.sections.map((s) => s.title).join(', ')}

引言应该简洁有力，能够吸引读者继续阅读。`,
  });
  logger.info(`引言生成成功，长度: ${text.length}`);

  return text;
}

/**
 * 生成章节内容
 */
async function generateSectionContent(
  section: OutlineSection,
  outline: Outline,
  options: GenerateOptions,
  isImproved: boolean = false
): Promise<SectionContent> {
  const { title, keyPoints, subsections } = section;
  logger.info(`开始生成章节 "${title}" 的内容${isImproved ? '（改进版）' : ''}`);

  if (keyPoints && keyPoints.length > 0) {
    logger.info(`章节关键点: ${keyPoints.join(', ')}`);
  }

  const model = createModel(options.model);
  const { text } = await generateText({
    model,
    system: `你是一个专业的内容创作者，擅长为文章章节创作高质量内容。
请根据提供的章节标题和关键点，创作一个内容丰富的章节。`,
    prompt: `请为以下章节创作内容:

文章标题: ${outline.title}
章节标题: ${title}
关键点: ${keyPoints ? keyPoints.join(', ') : '无'}

${isImproved ? '请注意，这是对之前内容的改进尝试，请确保内容更加深入、准确和引人入胜。' : ''}

章节内容应该详细展开关键点，提供相关例子或数据支持，并保持与整体文章主题的一致性。`,
  });
  logger.info(`章节 "${title}" 主体内容生成成功，长度: ${text.length}`);

  // 处理子章节
  const subsectionContents: SectionContent[] = [];
  if (subsections && subsections.length > 0) {
    logger.info(`章节 "${title}" 有 ${subsections.length} 个子章节，开始生成子章节内容`);
    for (const subsection of subsections) {
      logger.info(`生成子章节 "${subsection.title}" 内容`);
      const subsectionContent = await generateSectionContent(subsection, outline, options);
      logger.success(`子章节 "${subsection.title}" 内容生成完成`);
      subsectionContents.push(subsectionContent);
    }
    logger.success(`章节 "${title}" 的所有子章节内容生成完成`);
  }

  return {
    title,
    content: text,
    subsections: subsectionContents.length > 0 ? subsectionContents : undefined,
  };
}

/**
 * 生成文章结论
 */
async function generateConclusion(
  outline: Outline,
  sections: SectionContent[],
  options: GenerateOptions
): Promise<string> {
  logger.info('调用AI生成文章结论...');
  const model = createModel(options.model);
  const { text } = await generateText({
    model,
    system: `你是一个专业的内容创作者，擅长为文章创作有力的结论。
请根据提供的文章标题、章节和内容，创作一个有力的结论。`,
    prompt: `请为以下文章创作一个有力的结论:

标题: ${outline.title}
章节内容摘要:
${sections.map((s) => `${s.title}: ${s.content.substring(0, 100)}...`).join('\n')}

结论应该总结文章的主要观点，并给读者留下深刻印象。`,
  });
  logger.info(`结论生成成功，长度: ${text.length}`);

  return text;
}

/**
 * 分析章节内容并决定是否需要添加流程图
 * @param sectionContent 章节内容
 * @param options 生成选项
 * @returns 可能包含流程图的章节内容
 */
async function addDiagramIfNeeded(
  sectionContent: SectionContent,
  options: GenerateOptions
): Promise<SectionContent> {
  const { title, content } = sectionContent;
  logger.info(`分析章节 "${title}" 内容，判断是否适合添加流程图...`);

  const model = createModel(options.model);
  // 首先判断是否需要流程图
  const { object: analysis } = await generateObject({
    model,
    system: `你是一个专业的内容分析专家，擅长判断文章内容是否适合添加流程图来增强理解。
请分析提供的章节内容，判断是否适合添加流程图。`,
    prompt: `请分析以下章节内容，判断是否适合添加基于mermaid的流程图:

章节标题: ${title}
章节内容:
${content}

请判断这个章节是否包含以下类型的内容，这些内容通常适合用流程图表示:
1. 步骤流程或阶段性过程
2. 决策树或条件分支
3. 系统架构或组件关系
4. 数据流向或信息传递路径
5. 层次结构或分类体系

如果章节内容包含上述任何一种情况，请判断为"需要流程图"`,
    schema: z.object({
      needsDiagram: z.boolean().describe('是否需要添加流程图'),
      diagramType: z
        .string()
        .describe('如果需要，适合的流程图类型（流程图、决策树、系统架构图等）'),
      diagramContent: z.string().describe('如果需要，流程图应该表示的具体内容'),
    }),
  });

  // 如果不需要流程图，直接返回原内容
  if (!analysis.needsDiagram) {
    logger.info(`章节 "${title}" 不需要添加流程图`);
    return sectionContent;
  }

  logger.info(`章节 "${title}" 需要添加${analysis.diagramType}，表示${analysis.diagramContent}`);

  // 生成mermaid流程图代码
  const { object: diagram } = await generateObject({
    model,
    system: `你是一个专业的流程图设计专家，擅长使用mermaid语法创建清晰、简洁的流程图。
请根据提供的内容，创建一个适合的mermaid流程图。`,
    prompt: `请为以下内容创建一个基于mermaid的${analysis.diagramType}:

章节标题: ${title}
需要表示的内容: ${analysis.diagramContent}
章节内容摘要:
${content.substring(0, 500)}...

请创建一个简洁、清晰的mermaid流程图，确保语法正确，并且图表能够准确表达${analysis.diagramContent}。
流程图需保持简洁易读`,
    schema: z.object({
      mermaidCode: z.string().describe('mermaid流程图代码'),
      explanation: z.string().describe('流程图的简短解释'),
    }),
  });

  logger.success(`成功为章节 "${title}" 生成流程图`);

  // 将流程图添加到内容中
  const contentWithDiagram = `${content}\`\`\`mermaid\n${diagram.mermaidCode}\n\`\`\`\n`;

  // 返回添加了流程图的内容
  return {
    ...sectionContent,
    content: contentWithDiagram,
  };
}

/**
 * 组合完整内容
 */
function combineContent(
  title: string,
  introduction: string,
  sections: SectionContent[],
  conclusion: string
): string {
  logger.info('开始组合完整文章内容...');
  let content = `# ${title}\n\n${introduction}\n\n`;
  logger.info('已添加标题和引言');

  // 添加所有章节内容
  for (const section of sections) {
    logger.info(`添加章节 "${section.title}" 内容`);
    content += `## ${section.title}\n\n${section.content}\n\n`;

    // 添加子章节内容
    if (section.subsections && section.subsections.length > 0) {
      logger.info(`添加章节 "${section.title}" 的 ${section.subsections.length} 个子章节内容`);
      for (const subsection of section.subsections) {
        content += `### ${subsection.title}\n\n${subsection.content}\n\n`;
      }
    }
  }

  // 添加结论
  logger.info('添加结论');
  content += `## 结论\n\n${conclusion}\n`;
  logger.info('文章内容组合完成');

  return content;
}

/**
 * 评估章节内容质量
 */
async function evaluateSectionContent(
  content: string,
  section: OutlineSection,
  options: GenerateOptions
): Promise<number> {
  logger.info(`评估章节 "${section.title}" 内容质量...`);
  const model = createModel(options.model);
  const { object } = await generateObject({
    model,
    system: `你是一个专业的内容评估专家，擅长评估文章章节内容的质量。
请根据提供的章节内容和章节信息，评估内容质量。`,
    prompt: `请评估以下章节内容的质量:

章节标题: ${section.title}
关键点: ${section.keyPoints ? section.keyPoints.join(', ') : '无'}

章节内容:
${content}

请从以下几个方面评估内容质量:
1. 深度 (0-10分): 内容是否深入、有见地，避免泛泛而谈
2. 相关性 (0-10分): 内容是否与章节标题和关键点高度相关
3. 流畅性 (0-10分): 内容是否流畅，段落之间是否有自然过渡
4. 准确性 (0-10分): 内容中的事实和数据是否准确
5. 吸引力 (0-10分): 内容是否吸引人，能够保持读者兴趣

请给出总分 (满分50分) 并转换为0-1之间的分数。`,
    schema: z.object({
      depth: z.number().min(0).max(10).describe('深度得分'),
      relevance: z.number().min(0).max(10).describe('相关性得分'),
      fluency: z.number().min(0).max(10).describe('流畅性得分'),
      accuracy: z.number().min(0).max(10).describe('准确性得分'),
      engagement: z.number().min(0).max(10).describe('吸引力得分'),
      totalScore: z.number().min(0).max(50).describe('总分'),
      normalizedScore: z.number().min(0).max(1).describe('归一化分数 (0-1)'),
    }),
  });
  logger.info(`章节 "${section.title}" 内容质量评分: ${object.normalizedScore.toFixed(2)}`);
  logger.info(
    `详细评分 - 深度: ${object.depth}, 相关性: ${object.relevance}, 流畅性: ${object.fluency}, 准确性: ${object.accuracy}, 吸引力: ${object.engagement}`
  );

  return object.normalizedScore;
}

/**
 * 添加过渡，确保章节间连贯
 */
function addTransitions(sections: SectionContent[]): SectionContent[] {
  logger.info('开始添加章节间过渡...');
  // 对于每个章节（除第一个外），添加与前一章节的过渡
  for (let i = 1; i < sections.length; i++) {
    const prevSection = sections[i - 1];
    const currentSection = sections[i];
    logger.info(`添加从 "${prevSection.title}" 到 "${currentSection.title}" 的过渡`);

    // 简单的过渡处理：在当前章节内容前添加一个过渡句
    const transition = `在了解了${prevSection.title}之后，我们现在来探讨${currentSection.title}。`;
    currentSection.content = `${transition}\n\n${currentSection.content}`;
  }
  logger.success('章节间过渡添加完成');

  return sections;
}

/**
 * 格式化章节内容
 */
function formatSection(section: SectionContent, level: number): string {
  logger.info(`格式化章节 "${section.title}" 内容，标题级别: ${level}`);
  const heading = '#'.repeat(level);
  let content = `${heading} ${section.title}\n\n${section.content}`;

  if (section.subsections && section.subsections.length > 0) {
    logger.info(`格式化章节 "${section.title}" 的 ${section.subsections.length} 个子章节`);
    content +=
      '\n\n' +
      section.subsections.map((subsection) => formatSection(subsection, level + 1)).join('\n\n');
  }

  return content;
}
