import { Command } from 'commander';
import inquirer from 'inquirer';
import { generateArticle } from '../lib/article-generator';
import { logger } from '@demo/common';

// 内联定义 GenerateOptions 接口，与 article-generator/types.ts 中的定义保持一致
interface GenerateOptions {
  prompt: string;
  model?: string;
  style?: string;
  length?: 'short' | 'medium' | 'long';
}

// 内联定义 GenerateResult 接口，用于类型提示
interface GenerateResult {
  title: string;
  content: string;
  filePath: string;
}

export const createGenerateCommand = () => {
  return new Command('generate')
    .option('-p, --prompt <string>', 'prompt', undefined)
    .option('-s, --style <string>', '', undefined)
    .option('-l, --length <string>', '', undefined)
    .option('-m, --model <string>', '', undefined)
    .description('根据主题自动生成文章')
    .action(async (opts: Partial<GenerateOptions> = {}) => {
      try {
        // 使用 inquirer 逐步引导用户输入必要信息
        const answers = await inquirer.prompt(
          [
            opts?.prompt
              ? null
              : {
                  type: 'input',
                  name: 'prompt',
                  message: '请输入文章主题/提示词:',
                  validate: (input) => (input.trim() !== '' ? true : '主题不能为空'),
                },
            opts?.style
              ? null
              : {
                  type: 'list',
                  name: 'style',
                  message: '请选择文章风格:',
                  choices: [
                    { name: '正式 (适合商业、学术场景)', value: 'formal' },
                    { name: '休闲 (适合博客、社交媒体)', value: 'casual' },
                    { name: '技术 (适合技术文档、教程)', value: 'technical' },
                  ],
                  default: 'formal',
                },
            opts?.length
              ? null
              : {
                  type: 'list',
                  name: 'length',
                  message: '请选择文章长度:',
                  choices: [
                    { name: '短文 (约500-1000字)', value: 'short' },
                    { name: '中等 (约1500-2500字)', value: 'medium' },
                    { name: '长文 (约3000-5000字)', value: 'long' },
                  ],
                  default: 'medium',
                },
            opts?.model
              ? null
              : {
                  type: 'list',
                  name: 'model',
                  message: '请选择使用的模型:',
                  choices: [
                    { name: 'GPT-4o (推荐)', value: 'gpt-4o' },
                    { name: 'Claude 3.5 Sonnet', value: 'claude-3-5-sonnet-20241022' },
                    { name: 'DeepSeek Chat', value: 'deepseek-chat' },
                  ],
                  default: 'gpt-4o',
                },
          ].filter((r) => !!r)
        );

        // 设置生成选项
        const options: GenerateOptions = Object.assign(opts, answers);

        logger.info('\n开始生成文章，请稍候...\n');

        // 调用生成文章函数
        const result = await generateArticle(options.prompt, options);

        logger.success(`\n✅ 文章生成完成！`);
        logger.info(`标题: ${result.title}`);
        logger.info(`保存路径: ${result.filePath}`);
      } catch (error) {
        logger.error(`生成文章时出错: ${error}`);
      }
    });
};
