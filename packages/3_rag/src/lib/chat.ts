import inquirer from 'inquirer';
import { streamText, tool } from 'ai';
import { openai } from '@ai-sdk/openai';
import { searchSimilarContent } from './search';
import { z } from 'zod';
import ora from 'ora';

// 创建问答工具
const chatTools = {
  getInformation: tool({
    description: '从知识库中检索与问题相关的信息',
    parameters: z.object({
      query: z.string().describe('用户的问题或查询'),
    }),
    execute: async ({ query }) => {
      const spinner = ora('[function call] 正在搜索相关信息...').start();
      try {
        const results = await searchSimilarContent(query);
        spinner.stop();
        if (results.length === 0) {
          return { found: false, content: '' };
        }
        return {
          found: true,
          content: results.map((r) => r.content).join('\n'),
        };
      } catch (error) {
        spinner.stop();
        throw error;
      }
    },
  }),
};

// 创建系统提示
const systemMessage = {
  role: 'system' as const,
  content:
    '你是一个有帮助的 Vercel AI SDK 助手。请使用 getInformation 工具获取相关信息来回答用户的问题。如果没有找到相关信息，请回答"抱歉，我没有找到相关信息"。',
};

// 处理单次问答
async function handleQuestion(question: string) {
  const spinner = ora('正在思考中...').start();

  try {
    const { textStream, steps } = streamText({
      model: openai('gpt-4'),
      messages: [
        systemMessage,
        {
          role: 'user' as const,
          content: question,
        },
      ],
      tools: chatTools,
      maxSteps: 10,
    });

    spinner.stop();

    for await (const text of textStream) {
      process.stdout.write(text);
    }
    console.log(`\n工具调用结果: ${JSON.stringify(steps)}`);
  } catch (error) {
    spinner.stop();
    throw error;
  }
}

// 创建问答循环
export async function startChat() {
  console.log('欢迎使用 RAG 问答服务! 输入 "exit" 退出。\n');

  while (true) {
    const { question } = await inquirer.prompt([
      {
        type: 'input',
        name: 'question',
        message: '请输入您的问题:',
        validate: (input: string) => {
          if (input.trim().length === 0) {
            return '问题不能为空';
          }
          return true;
        },
      },
    ]);

    if (question.toLowerCase() === 'exit') {
      console.log('\n再见!');
      process.exit(0);
    }

    try {
      await handleQuestion(question);
    } catch (error) {
      if (error instanceof Error) {
        console.error('\n发生错误:', error.message);
      } else {
        console.error('\n发生未知错误');
      }
    }
  }
}
