/**
 * 语言偏好持久化适配器（设计 D4）：
 * 框架缺省写入 localStorage，接入方可经 options.localeStorage
 * 关闭（false）或替换为自定义实现（cookie / 服务端同步等）。
 */

/** 语言偏好存储适配器：读写当前语言代码 */
export interface LocaleStorage {
  /** 读取持久化的语言代码（无记录返回 undefined） */
  get(): string | undefined;
  /** 写入语言代码（持久化不可用时静默降级，不抛异常） */
  set(locale: string): void;
}

/**
 * localStorage 实现的 LocaleStorage 工厂（key 缺省 'pactor.locale'，
 * 可经参数更换）。读写前置 `typeof localStorage !== 'undefined'`
 * 判断并 try/catch 包裹：SSR / 隐私模式 / 用户禁用存储时静默降级
 * 为无持久化（行为等同未接入持久化）。
 */
export function createLocalStorageLocaleStorage(
  key = 'pactor.locale',
): LocaleStorage {
  return {
    get(): string | undefined {
      if (typeof localStorage === 'undefined') {
        return undefined;
      }
      try {
        const value = localStorage.getItem(key);
        return typeof value === 'string' && value !== '' ? value : undefined;
      } catch {
        return undefined;
      }
    },
    set(locale: string): void {
      if (typeof localStorage === 'undefined') {
        return;
      }
      try {
        localStorage.setItem(key, locale);
      } catch {
        // 隐私模式 / 配额超限：静默降级，无持久化
      }
    },
  };
}
