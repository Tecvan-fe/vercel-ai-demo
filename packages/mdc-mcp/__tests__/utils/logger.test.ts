import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { logger, setLogLevel, getLogLevel, LogLevel } from '../../src/utils/logger';

describe('logger', () => {
  // 保存原始的控制台方法和日志级别
  const originalConsoleLog = console.log;
  let originalLogLevel: LogLevel;

  beforeEach(() => {
    // 保存原始日志级别
    originalLogLevel = getLogLevel();

    // 重置日志级别为默认值
    setLogLevel(LogLevel.INFO);

    // 模拟控制台方法
    console.log = vi.fn();
  });

  afterEach(() => {
    // 恢复原始控制台方法和日志级别
    console.log = originalConsoleLog;
    setLogLevel(originalLogLevel);
  });

  describe('日志级别', () => {
    it('应该能够设置和获取日志级别', () => {
      setLogLevel(LogLevel.DEBUG);
      expect(getLogLevel()).toBe(LogLevel.DEBUG);

      setLogLevel(LogLevel.ERROR);
      expect(getLogLevel()).toBe(LogLevel.ERROR);

      setLogLevel(LogLevel.NONE);
      expect(getLogLevel()).toBe(LogLevel.NONE);
    });

    it('应该根据日志级别过滤日志', () => {
      // 设置日志级别为 WARN，低于此级别的日志不应输出
      setLogLevel(LogLevel.WARN);

      // DEBUG 级别的日志不应该输出
      logger.debug('调试信息');
      expect(console.log).not.toHaveBeenCalled();

      // INFO 级别的日志不应该输出
      logger.info('信息');
      expect(console.log).not.toHaveBeenCalled();

      // WARN 级别的日志应该输出
      logger.warn('警告');
      expect(console.log).toHaveBeenCalled();

      // 重置 mock 调用记录
      vi.clearAllMocks();

      // ERROR 级别的日志应该输出
      logger.error('错误');
      expect(console.log).toHaveBeenCalled();
    });
  });

  describe('日志方法', () => {
    it('debug方法应该输出调试日志', () => {
      // 将日志级别设置为 DEBUG 以确保输出
      setLogLevel(LogLevel.DEBUG);

      const message = '调试信息';
      logger.debug(message);

      expect(console.log).toHaveBeenCalledWith(expect.stringContaining(message));
    });

    it('info方法应该输出信息日志', () => {
      const message = '信息';
      logger.info(message);

      expect(console.log).toHaveBeenCalledWith(expect.stringContaining(message));
    });

    it('warn方法应该输出警告日志', () => {
      const message = '警告';
      logger.warn(message);

      expect(console.log).toHaveBeenCalledWith(expect.stringContaining(message));
    });

    it('error方法应该输出错误日志', () => {
      const message = '错误';
      logger.error(message);

      expect(console.log).toHaveBeenCalledWith(expect.stringContaining(message));
    });

    it('success方法应该输出成功日志', () => {
      const message = '成功';
      logger.success(message);

      expect(console.log).toHaveBeenCalledWith(expect.stringContaining(message));
    });
  });

  describe('额外功能', () => {
    it('应该支持多个参数', () => {
      setLogLevel(LogLevel.INFO);
      const message = '信息';
      const obj = { key: 'value' };
      const num = 123;

      logger.info(message, obj, num);

      expect(console.log).toHaveBeenCalledWith(expect.any(String), message, obj, num);
    });

    it('应该支持传入Error对象', () => {
      const error = new Error('测试错误');

      logger.error('发生错误', error);

      expect(console.log).toHaveBeenCalledWith(expect.any(String), '发生错误', error);
    });

    it('应该在日志级别为NONE时不输出任何日志', () => {
      setLogLevel(LogLevel.NONE);

      logger.debug('调试信息');
      logger.info('信息');
      logger.warn('警告');
      logger.error('错误');
      logger.success('成功');

      expect(console.log).not.toHaveBeenCalled();
    });
  });
});
