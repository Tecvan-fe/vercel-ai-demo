import { logger } from './logger';

/**
 * 从 LLM 返回的文本中提取最后一个数字
 * @param text LLM 返回的文本
 * @returns 解析后的数字
 */
export function parseLlmEval(text: string): number {
  try {
    // 匹配所有数字（包括小数）
    const numbers = text.match(/\d+(\.\d+)?/g);
    if (!numbers || numbers.length === 0) {
      logger.error('未找到任何数字');
      logger.error('原始文本:', text);
      throw new Error('No number found in text');
    }

    // 取最后一个数字
    const score = parseFloat(numbers[numbers.length - 1]);

    // 验证分数范围
    if (score < 0 || score > 100) {
      logger.warn(`分数 ${score} 超出范围(0-100)，将被限制在范围内`);
      return Math.max(0, Math.min(100, score));
    }

    return score;
  } catch (error) {
    logger.error('解析评分失败');
    logger.error('原始文本:', text);
    logger.error('错误信息:', (error as Error).message);
    throw error;
  }
}
