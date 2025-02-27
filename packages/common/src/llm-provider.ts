import { createOllama } from 'ollama-ai-provider';
import { anthropic } from '@ai-sdk/anthropic';
import { deepseek } from '@ai-sdk/deepseek';
import { wrapLanguageModel, extractReasoningMiddleware } from 'ai';
import { openai } from '@ai-sdk/openai';

export const createDeepSeekModel = () => {
  const ollama = createOllama({
    // optional settings, e.g.
    baseURL: 'http://localhost:11434/api',
  });
  const model = ollama('deepseek-r1:7b');
  return wrapLanguageModel({
    model: model,
    middleware: extractReasoningMiddleware({ tagName: 'think' }),
  });
};

export const createDeepSeekChatModel = () => {
  return deepseek('deepseek-chat');
};

export const createAnthropicModel = () => {
  return anthropic('claude-3-5-sonnet-20241022');
};

export const createOpenAIModel = (modelName = 'gpt-4o') => {
  return openai(modelName);
};
