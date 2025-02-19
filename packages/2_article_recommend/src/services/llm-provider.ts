import { createOllama } from 'ollama-ai-provider';
import { deepseek } from '@ai-sdk/deepseek';
import { generateText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { logger } from '../utils/logger';

export const runPrompt = async (params: { userPrompt: string; systemPrompt: string }) => {
  const ollama = createOllama({
    // optional settings, e.g.
    baseURL: 'http://localhost:11434/api',
  });

  const { userPrompt, systemPrompt } = params;
  if (!userPrompt) {
    logger.error('未提供 prompt');
    throw new Error(
      'prompt is required, you can use "DEEPSEEK_API_KEY=<key> npx tsx src/index.ts <prompt>"'
    );
  }

  try {
    const { text } = await generateText({
      model: ollama('deepseek-r1:7b'),
      system: systemPrompt,
      prompt: userPrompt,
    });
    return text;
  } catch (error) {
    logger.error(`LLM 调用失败: ${(error as Error).message}`);
    throw error;
  }
};
