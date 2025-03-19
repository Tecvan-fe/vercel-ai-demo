/**
 * 日志工具
 *
 * 提供统一的日志输出接口，支持不同级别的日志，包括彩色输出
 */

// 日志级别枚举
export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  SUCCESS = 4,
  NONE = 5, // 用于完全禁用日志
}

// ANSI 颜色代码
const colors = {
  reset: '\x1b[0m',
  debug: '\x1b[36m', // 青色
  info: '\x1b[34m', // 蓝色
  warn: '\x1b[33m', // 黄色
  error: '\x1b[31m', // 红色
  success: '\x1b[32m', // 绿色
};

// 默认日志级别
let currentLogLevel = LogLevel.INFO;

/**
 * 设置全局日志级别
 * @param level 日志级别
 */
export function setLogLevel(level: LogLevel): void {
  currentLogLevel = level;
}

/**
 * 获取当前日志级别
 * @returns 当前日志级别
 */
export function getLogLevel(): LogLevel {
  return currentLogLevel;
}

/**
 * 基础日志函数
 * @param level 日志级别
 * @param message 日志消息
 * @param args 附加参数
 */
function log(level: LogLevel, message: string, ...args: any[]): void {
  if (level < currentLogLevel) {
    return;
  }

  let prefix: string = '';
  let color: string = '';

  switch (level) {
    case LogLevel.DEBUG:
      prefix = '[DEBUG]';
      color = colors.debug;
      break;
    case LogLevel.INFO:
      prefix = '[INFO]';
      color = colors.info;
      break;
    case LogLevel.WARN:
      prefix = '[WARN]';
      color = colors.warn;
      break;
    case LogLevel.ERROR:
      prefix = '[ERROR]';
      color = colors.error;
      break;
    case LogLevel.SUCCESS:
      prefix = '[SUCCESS]';
      color = colors.success;
      break;
  }

  // 格式化日志前缀
  const formattedPrefix = `${color}${prefix}${colors.reset}`;

  // 处理格式化字符串，支持%s, %d等格式化占位符
  if (args.length > 0) {
    console.log(formattedPrefix, message, ...args);
  } else {
    console.log(`${formattedPrefix} ${message}`);
  }
}

/**
 * 导出的日志工具
 */
export const logger = {
  /**
   * 调试日志
   * @param message 日志消息
   * @param args 附加参数
   */
  debug(message: string, ...args: any[]): void {
    log(LogLevel.DEBUG, message, ...args);
  },

  /**
   * 信息日志
   * @param message 日志消息
   * @param args 附加参数
   */
  info(message: string, ...args: any[]): void {
    log(LogLevel.INFO, message, ...args);
  },

  /**
   * 警告日志
   * @param message 日志消息
   * @param args 附加参数
   */
  warn(message: string, ...args: any[]): void {
    log(LogLevel.WARN, message, ...args);
  },

  /**
   * 错误日志
   * @param message 日志消息
   * @param args 附加参数
   */
  error(message: string, ...args: any[]): void {
    log(LogLevel.ERROR, message, ...args);
  },

  /**
   * 成功日志
   * @param message 日志消息
   * @param args 附加参数
   */
  success(message: string, ...args: any[]): void {
    log(LogLevel.SUCCESS, message, ...args);
  },
};

// 默认导出
export default logger;
