import { generateText } from 'ai';
import { logger } from '../utils/logger';
import { createDeepSeekModel } from '@demo/common';

export const runPrompt = async (params: { userPrompt: string; systemPrompt: string }) => {
  const { userPrompt, systemPrompt } = params;
  if (!userPrompt) {
    logger.error('未提供 prompt');
    throw new Error(
      'prompt is required, you can use "DEEPSEEK_API_KEY=<key> npx tsx src/index.ts <prompt>"'
    );
  }

  try {
    const { text } = await generateText({
      model: createDeepSeekModel(),
      system: systemPrompt,
      prompt: userPrompt,
    });
    return text;
  } catch (error) {
    logger.error(`LLM 调用失败: ${(error as Error).message}`);
    throw error;
  }
};
