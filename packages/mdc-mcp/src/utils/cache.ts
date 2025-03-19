/**
 * 缓存工具类，用于缓存组件元数据
 */

export interface CacheOptions {
  /** 缓存过期时间（毫秒） */
  ttl: number;
}

export interface CacheItem<T> {
  /** 缓存的数据 */
  data: T;
  /** 过期时间戳 */
  expireAt: number;
}

export class Cache<T> {
  private cache: Map<string, CacheItem<T>> = new Map();
  private ttl: number;

  constructor(options: CacheOptions) {
    this.ttl = options.ttl;
  }

  /**
   * 获取缓存数据
   * @param key 缓存键
   * @returns 缓存数据，如果不存在或已过期则返回 null
   */
  get = (key: string): T | null => {
    const item = this.cache.get(key);
    if (!item) {
      return null;
    }

    const now = Date.now();
    if (now > item.expireAt) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  };

  /**
   * 设置缓存数据
   * @param key 缓存键
   * @param data 缓存数据
   */
  set = (key: string, data: T): void => {
    const expireAt = Date.now() + this.ttl;
    this.cache.set(key, { data, expireAt });
  };

  /**
   * 清除所有缓存
   */
  clear = (): void => {
    this.cache.clear();
  };
}
