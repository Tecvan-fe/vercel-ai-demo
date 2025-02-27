type LogLevel = 'info' | 'warn' | 'error' | 'success';

const colors = {
  info: '\x1b[36m', // 青色
  warn: '\x1b[33m', // 黄色
  error: '\x1b[31m', // 红色
  success: '\x1b[32m', // 绿色
  reset: '\x1b[0m', // 重置
};

export const logger = {
  info: (message: string, prefix = true) => {
    console.log(`${prefix ? `${colors.info}[INFO]${colors.reset} ` : ''}${message}`);
  },
  warn: (message: string, prefix = true) => {
    console.log(`${colors.warn}[WARN]${colors.reset} ${message}`);
  },
  error: (message: string) => {
    console.log(`${colors.error}[ERROR]${colors.reset} ${message}`);
  },
  success: (message: string) => {
    console.log(`${colors.success}[SUCCESS]${colors.reset} ${message}`);
  },
};
