import fs from 'fs';
import { logger, createAnthropicModel } from '@demo/common';
import { AnalysisResult, ModuleExports } from './types';
import { AIMessage, HumanMessage } from 'ai';

// 创建LLM模型
const model = createAnthropicModel();

/**
 * 分析单个代码文件
 */
export async function analyzeFile(filePath: string, verbose: boolean): Promise<AnalysisResult> {
  try {
    // 读取文件内容
    const fileContent = fs.readFileSync(filePath, 'utf-8');

    if (verbose) {
      logger.info(`开始分析文件: ${filePath}`);
    }

    // 分析导出内容
    const exports = await analyzeExports(fileContent, filePath);

    // 分析实现逻辑
    const implementation = await analyzeImplementation(fileContent, filePath);

    // 生成功能描述
    const description = await generateDescription(fileContent, exports, implementation, filePath);

    return {
      exports,
      implementation,
      description,
    };
  } catch (error) {
    logger.error(
      `分析文件 ${filePath} 失败: ${error instanceof Error ? error.message : String(error)}`
    );
    throw error;
  }
}

/**
 * 分析文件的导出内容
 */
async function analyzeExports(fileContent: string, filePath: string): Promise<ModuleExports> {
  try {
    const prompt = `
你是一个代码分析专家，请分析以下TypeScript代码文件，提取所有导出的内容。
请按照以下类别归类：
1. 函数（包括普通函数、箭头函数、异步函数等）
2. 类
3. 接口
4. 类型
5. 变量（包括常量）
6. 默认导出（如果有）

代码文件路径: ${filePath}

代码内容:
\`\`\`typescript
${fileContent}
\`\`\`

请以JSON格式返回结果，格式如下：
{
  "functions": ["函数名1", "函数名2", ...],
  "classes": ["类名1", "类名2", ...],
  "interfaces": ["接口名1", "接口名2", ...],
  "types": ["类型名1", "类型名2", ...],
  "variables": ["变量名1", "变量名2", ...],
  "default": "默认导出名（如果有）"
}

只返回JSON对象，不要有其他文字说明。
`;

    // 调用LLM
    const response = await model.chat({
      messages: [new HumanMessage(prompt)],
      temperature: 0.1,
      max_tokens: 1000,
    });

    try {
      // 提取JSON部分
      const content = response.content;
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('无法从LLM响应中提取JSON');
      }

      const result = JSON.parse(jsonMatch[0]) as ModuleExports;

      // 确保所有字段都存在
      return {
        functions: result.functions || [],
        classes: result.classes || [],
        interfaces: result.interfaces || [],
        types: result.types || [],
        variables: result.variables || [],
        default: result.default,
      };
    } catch (parseError) {
      logger.error(
        `解析LLM响应失败: ${parseError instanceof Error ? parseError.message : String(parseError)}`
      );
      // 返回空结果
      return {
        functions: [],
        classes: [],
        interfaces: [],
        types: [],
        variables: [],
      };
    }
  } catch (error) {
    logger.error(`分析导出内容失败: ${error instanceof Error ? error.message : String(error)}`);
    throw error;
  }
}

/**
 * 分析文件的实现逻辑
 */
async function analyzeImplementation(fileContent: string, filePath: string): Promise<string> {
  try {
    const prompt = `
你是一个代码分析专家，请分析以下TypeScript代码文件的实现逻辑。
请简洁地总结这个模块的主要功能和实现原理，不超过200字。

代码文件路径: ${filePath}

代码内容:
\`\`\`typescript
${fileContent}
\`\`\`

请直接返回总结内容，不要有其他文字说明。
`;

    // 调用LLM
    const response = await model.chat({
      messages: [new HumanMessage(prompt)],
      temperature: 0.3,
      max_tokens: 500,
    });

    return response.content.toString().trim();
  } catch (error) {
    logger.error(`分析实现逻辑失败: ${error instanceof Error ? error.message : String(error)}`);
    throw error;
  }
}

/**
 * 根据导出内容和实现逻辑生成功能描述
 */
async function generateDescription(
  fileContent: string,
  exports: ModuleExports,
  implementation: string,
  filePath: string
): Promise<string> {
  try {
    // 将导出内容转换为字符串
    const exportsStr = JSON.stringify(exports, null, 2);

    const prompt = `
你是一个代码文档专家，请根据以下信息生成一个模块的功能描述。
请考虑模块的导出内容和实现逻辑，生成一个清晰、准确的功能描述，不超过300字。

代码文件路径: ${filePath}

代码内容:
\`\`\`typescript
${fileContent}
\`\`\`

模块导出内容:
\`\`\`json
${exportsStr}
\`\`\`

模块实现逻辑:
${implementation}

请直接返回功能描述，不要有其他文字说明。
`;

    // 调用LLM
    const response = await model.chat({
      messages: [new HumanMessage(prompt)],
      temperature: 0.3,
      max_tokens: 800,
    });

    return response.content.toString().trim();
  } catch (error) {
    logger.error(`生成功能描述失败: ${error instanceof Error ? error.message : String(error)}`);
    throw error;
  }
}
