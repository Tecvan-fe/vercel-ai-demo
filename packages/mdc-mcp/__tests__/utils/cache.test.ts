import { describe, it, expect, vi, beforeEach } from 'vitest';

import { Cache } from '../../src/utils/cache';

describe('Cache', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('应该创建一个缓存实例', () => {
    const cache = new Cache<string>({ ttl: 1000 });
    expect(cache).toBeInstanceOf(Cache);
  });

  it('应该能够设置和获取缓存数据', () => {
    const cache = new Cache<string>({ ttl: 1000 });
    cache.set('key', 'value');
    expect(cache.get('key')).toBe('value');
  });

  it('应该返回null当获取不存在的键', () => {
    const cache = new Cache<string>({ ttl: 1000 });
    expect(cache.get('nonexistent')).toBeNull();
  });

  it('应该在ttl时间后使缓存项过期', () => {
    const cache = new Cache<string>({ ttl: 1000 });
    cache.set('key', 'value');

    // 先确认缓存项存在
    expect(cache.get('key')).toBe('value');

    // 前进时间1001毫秒，使缓存项过期
    vi.advanceTimersByTime(1001);

    // 确认缓存项已过期
    expect(cache.get('key')).toBeNull();
  });

  it('应该能够清除所有缓存', () => {
    const cache = new Cache<string>({ ttl: 1000 });
    cache.set('key1', 'value1');
    cache.set('key2', 'value2');

    // 确认缓存项存在
    expect(cache.get('key1')).toBe('value1');
    expect(cache.get('key2')).toBe('value2');

    // 清除所有缓存
    cache.clear();

    // 确认缓存已清除
    expect(cache.get('key1')).toBeNull();
    expect(cache.get('key2')).toBeNull();
  });

  it('应该在过期时间内保留缓存数据', () => {
    const cache = new Cache<string>({ ttl: 1000 });
    cache.set('key', 'value');

    // 前进时间999毫秒，未到过期时间
    vi.advanceTimersByTime(999);

    // 确认缓存项仍然存在
    expect(cache.get('key')).toBe('value');
  });
});
