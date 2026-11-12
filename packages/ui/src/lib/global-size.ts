/**
 * 全局密度档位：compact / default / comfortable。
 * 契约：compact / comfortable 写 documentElement 的 data-pactor-size，
 * default 移除该属性（与 data-pactor-theme 三态同款）；非受控偏好持久化到
 * localStorage 的 pactor.size（与 pactor.locale 同命名空间）。
 * 自定义组件 / 宿主脚本写同一属性即可全局切换；CSS 消费
 * var(--pactor-control-height-*) 等令牌即自动跟随（令牌定义见 styles.css）。
 */
export type GlobalSize = 'compact' | 'default' | 'comfortable';

/** 与 UserMenu 注释、设计文档一致的持久化 key */
export const globalSizeStorageKey = 'pactor.size';

const attribute = 'data-pactor-size';

/** 读取当前全局密度：未设置 / 非法值回退 'default' */
export function readGlobalSize(): GlobalSize {
  if (typeof document === 'undefined') return 'default';
  const value = document.documentElement.getAttribute(attribute);
  return value === 'compact' || value === 'comfortable' ? value : 'default';
}

/** 应用全局密度：default 移除属性，其余写属性 */
export function applyGlobalSize(size: GlobalSize): void {
  if (typeof document === 'undefined') return;
  if (size === 'default') {
    document.documentElement.removeAttribute(attribute);
  } else {
    document.documentElement.setAttribute(attribute, size);
  }
}

/** 读取持久化偏好；未设置 / 存储不可用 / 非法值回退 null */
export function readStoredGlobalSize(): GlobalSize | null {
  if (typeof window === 'undefined') return null;
  try {
    const value = window.localStorage.getItem(globalSizeStorageKey);
    return value === 'compact' || value === 'default' || value === 'comfortable'
      ? value
      : null;
  } catch {
    return null;
  }
}

/** 持久化密度偏好；存储禁用时忽略，仅保留会话内选择 */
export function persistGlobalSize(size: GlobalSize): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(globalSizeStorageKey, size);
  } catch {
    // 忽略：存储被禁用时不影响菜单内切换
  }
}

/**
 * 自定义数值覆盖：三档预设之外允许直接指定各令牌数值。
 * 经 documentElement 内联变量实现，优先级高于样式表中的档位预设
 * （inline style > [data-pactor-size] > :root）；持久化由宿主负责。
 */
export interface GlobalSizeValues {
  heightXs?: string;
  heightSm?: string;
  heightMd?: string;
  heightLg?: string;
  textSm?: string;
  textMd?: string;
  textLg?: string;
  box?: string;
}

const valueTokens: Record<keyof GlobalSizeValues, string> = {
  heightXs: '--pactor-control-height-xs',
  heightSm: '--pactor-control-height-sm',
  heightMd: '--pactor-control-height-md',
  heightLg: '--pactor-control-height-lg',
  textSm: '--pactor-control-text-sm',
  textMd: '--pactor-control-text-md',
  textLg: '--pactor-control-text-lg',
  box: '--pactor-control-box',
};

const valueKeys = Object.keys(valueTokens) as (keyof GlobalSizeValues)[];

/** 应用自定义数值：参数即完整覆盖集——给出的键写内联变量，
 *  未给出的键移除既有内联覆盖；传 null 清除全部，回到档位预设 */
export function applyGlobalSizeValues(values: GlobalSizeValues | null): void {
  if (typeof document === 'undefined') return;
  const style = document.documentElement.style;
  for (const key of valueKeys) {
    const value = values?.[key];
    if (value) style.setProperty(valueTokens[key], value);
    else style.removeProperty(valueTokens[key]);
  }
}

/** 读取当前内联覆盖（不含样式表档位值；无覆盖返回 {}） */
export function readGlobalSizeValues(): GlobalSizeValues {
  if (typeof document === 'undefined') return {};
  const style = document.documentElement.style;
  const values: GlobalSizeValues = {};
  for (const key of valueKeys) {
    const value = style.getPropertyValue(valueTokens[key]).trim();
    if (value) values[key] = value;
  }
  return values;
}
