import { NoObjectGeneratedError } from 'ai';
import { logger } from './logger';

export const retryWrapper = <T, Args extends any[]>(
  func: (...args: Args) => Promise<T>,
  retries = 3,
  delay = 500
) => {
  return async (...args: Args): Promise<T> => {
    try {
      return await func(...args);
    } catch (error) {
      if (NoObjectGeneratedError.isInstance(error)) {
        console.log('NoObjectGeneratedError');
        console.log('Cause:', error.cause);
        console.log('Text:', error.text);
        console.log('Response:', error.response);
        console.log('Usage:', error.usage);
      }
      logger.error(`${func.name} 执行失败，重试中，剩余次数: ${retries}`);
      if (retries > 0) {
        await new Promise((resolve) => setTimeout(resolve, delay));
        return retryWrapper(func, retries - 1, delay)(...args);
      }
      throw error;
    }
  };
};
