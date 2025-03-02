import fs from 'fs';
import path from 'path';
import { logger, createAnthropicModel } from '@demo/common';
import { scanDirectory } from './scanner';
import { loadTasks, saveTasks } from './cache';
import { analyzeFile } from './analyzer';
import { FileTask, GenerateReadmeOptions, ReadmeStructure } from './types';
import { HumanMessage } from 'ai';

// 创建LLM模型
const model = createAnthropicModel();

/**
 * 生成README文档
 */
export async function generateReadme(options: GenerateReadmeOptions): Promise<void> {
  const { targetDir, outputFile, extensions, verbose } = options;

  // 尝试从缓存加载任务
  let tasks = loadTasks(targetDir);

  // 如果没有缓存或缓存不匹配，重新扫描目录
  if (!tasks) {
    tasks = await scanDirectory(targetDir, extensions, verbose);
  }

  // 分析未完成的任务
  const unfinishedTasks = tasks.filter((task) => !task.analyzed);
  logger.info(`需要分析 ${unfinishedTasks.length} 个文件`);

  // 逐个分析文件
  for (let i = 0; i < unfinishedTasks.length; i++) {
    const task = unfinishedTasks[i];
    logger.info(`分析文件 ${i + 1}/${unfinishedTasks.length}: ${task.filePath}`);

    try {
      const result = await analyzeFile(task.filePath, verbose);

      // 更新任务状态
      task.exports = result.exports;
      task.implementation = result.implementation;
      task.description = result.description;
      task.analyzed = true;

      // 每分析完一个文件就保存一次缓存
      saveTasks(tasks, targetDir);
    } catch (error) {
      logger.error(
        `分析文件 ${task.filePath} 失败: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  // 生成README文档
  await generateReadmeContent(tasks, targetDir, outputFile);
}

/**
 * 生成README文档内容
 */
async function generateReadmeContent(
  tasks: FileTask[],
  targetDir: string,
  outputFile: string
): Promise<void> {
  try {
    logger.info('开始生成README文档');

    // 获取package.json信息
    const packageInfo = getPackageInfo(targetDir);

    // 准备任务数据
    const analyzedTasks = tasks.filter((task) => task.analyzed);

    if (analyzedTasks.length === 0) {
      throw new Error('没有成功分析的文件，无法生成README');
    }

    // 生成README结构
    const structure = await generateReadmeStructure(analyzedTasks, packageInfo, targetDir);

    // 组装最终的README内容
    const content = `# ${packageInfo.name || path.basename(targetDir)}

${structure.projectOverview}

## 核心功能

${structure.coreFunctions}

## 接口说明

${structure.apiReference}

## 开发指南

${structure.developmentGuide}

---
*此文档由README自动生成机器人生成于 ${new Date().toLocaleString()}*
`;

    // 写入文件
    const outputPath = path.join(targetDir, outputFile);
    fs.writeFileSync(outputPath, content, 'utf-8');

    logger.success(`README文档已生成: ${outputPath}`);
  } catch (error) {
    logger.error(`生成README文档失败: ${error instanceof Error ? error.message : String(error)}`);
    throw error;
  }
}

/**
 * 获取package.json信息
 */
function getPackageInfo(targetDir: string): any {
  try {
    const packagePath = path.join(targetDir, 'package.json');

    if (fs.existsSync(packagePath)) {
      const content = fs.readFileSync(packagePath, 'utf-8');
      return JSON.parse(content);
    }

    return {};
  } catch (error) {
    logger.error(`读取package.json失败: ${error instanceof Error ? error.message : String(error)}`);
    return {};
  }
}

/**
 * 生成README文档结构
 */
async function generateReadmeStructure(
  tasks: FileTask[],
  packageInfo: any,
  targetDir: string
): Promise<ReadmeStructure> {
  try {
    // 准备任务数据
    const tasksData = tasks.map((task) => ({
      filePath: path.relative(targetDir, task.filePath),
      exports: task.exports,
      implementation: task.implementation,
      description: task.description,
    }));

    // 确定入口文件
    const entryPoints = determineEntryPoints(packageInfo);

    const prompt = `
你是一个技术文档专家，请根据以下信息生成一个完整的README文档结构。

项目信息:
\`\`\`json
${JSON.stringify(packageInfo, null, 2)}
\`\`\`

项目入口文件: ${entryPoints.join(', ')}

模块分析结果:
\`\`\`json
${JSON.stringify(tasksData, null, 2)}
\`\`\`

请生成以下四个部分的内容：
1. 项目概览：简要介绍项目的目的、背景和主要功能
2. 核心功能：列出项目的主要功能点和特性
3. 接口说明：详细说明项目对外暴露的接口，包括使用示例（重点关注入口文件导出的内容）
4. 开发指南：提供项目的开发、构建和测试说明

请以JSON格式返回结果，格式如下：
{
  "projectOverview": "项目概览内容",
  "coreFunctions": "核心功能内容",
  "apiReference": "接口说明内容",
  "developmentGuide": "开发指南内容"
}

只返回JSON对象，不要有其他文字说明。
`;

    // 调用LLM
    const response = await model.chat({
      messages: [new HumanMessage(prompt)],
      temperature: 0.3,
      max_tokens: 2000,
    });

    try {
      // 提取JSON部分
      const content = response.content.toString();
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('无法从LLM响应中提取JSON');
      }

      return JSON.parse(jsonMatch[0]) as ReadmeStructure;
    } catch (parseError) {
      logger.error(
        `解析LLM响应失败: ${parseError instanceof Error ? parseError.message : String(parseError)}`
      );
      // 返回默认结构
      return {
        projectOverview: '项目概览信息生成失败',
        coreFunctions: '核心功能信息生成失败',
        apiReference: '接口说明信息生成失败',
        developmentGuide: '开发指南信息生成失败',
      };
    }
  } catch (error) {
    logger.error(`生成README结构失败: ${error instanceof Error ? error.message : String(error)}`);
    throw error;
  }
}

/**
 * 确定项目入口文件
 */
function determineEntryPoints(packageInfo: any): string[] {
  const entryPoints: string[] = [];

  // 检查main字段
  if (packageInfo.main) {
    entryPoints.push(packageInfo.main);
  }

  // 检查exports字段
  if (packageInfo.exports) {
    if (typeof packageInfo.exports === 'string') {
      entryPoints.push(packageInfo.exports);
    } else if (typeof packageInfo.exports === 'object') {
      // 处理exports对象
      Object.values(packageInfo.exports).forEach((value) => {
        if (typeof value === 'string') {
          entryPoints.push(value);
        } else if (typeof value === 'object' && value !== null) {
          // 处理条件导出
          Object.values(value).forEach((subValue) => {
            if (typeof subValue === 'string') {
              entryPoints.push(subValue);
            }
          });
        }
      });
    }
  }

  // 如果没有找到入口文件，使用默认值
  if (entryPoints.length === 0) {
    entryPoints.push('src/index.ts');
  }

  return [...new Set(entryPoints)]; // 去重
}
