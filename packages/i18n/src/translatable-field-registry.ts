import { I18nError } from './errors.js';

/**
 * 可翻译字段注册表（设计 4.4，缺口 G04）。
 *
 * 按组件 type / 动作名注册可翻译字段路径。组件字段路径以 `props.` 开头，
 * 动作字段路径以 `params.` 开头；数组元素使用 `[*]` 通配段
 * （如 `props.columns[*].title`、`props.options[*].label`）。
 *
 * DslLocalizer 只对注册字段执行 `$i18n` 转换；未注册字段出现 `$i18n`
 * 时报错（UNREGISTERED_I18N_FIELD），不静默忽略。
 */

/** 字段路径段：非空名称（不含 `.`/`[`/`]`），可带一个 `[*]` 后缀 */
const SEGMENT_RE = /^[^.[\]]+(?:\[\*\])?$/;

function assertValidFieldPath(path: string, root: 'props' | 'params'): void {
  const segments = typeof path === 'string' ? path.split('.') : [];
  if (segments[0] !== root || segments.length < 2) {
    throw new I18nError(
      'INVALID_FIELD_PATH',
      `可翻译字段路径必须以 ${root}.<field> 开头: ${String(path)}`,
      { path },
    );
  }
  for (const segment of segments) {
    if (!SEGMENT_RE.test(segment)) {
      throw new I18nError('INVALID_FIELD_PATH', `非法可翻译字段路径: ${path}`, { path });
    }
  }
}

function assertName(name: unknown, kind: string): asserts name is string {
  if (typeof name !== 'string' || name === '') {
    throw new I18nError('INVALID_FIELD_PATH', `${kind}名必须是非空字符串`, { name });
  }
}

export class TranslatableFieldRegistry {
  private readonly componentFields = new Map<string, Set<string>>();
  private readonly actionFields = new Map<string, Set<string>>();

  /** 注册组件 type 的可翻译字段路径（可重复调用，累积合并） */
  register(componentType: string, fields: string | readonly string[]): this {
    assertName(componentType, '组件 type');
    const list = typeof fields === 'string' ? [fields] : fields;
    let set = this.componentFields.get(componentType);
    if (set === undefined) {
      set = new Set();
      this.componentFields.set(componentType, set);
    }
    for (const field of list) {
      assertValidFieldPath(field, 'props');
      set.add(field);
    }
    return this;
  }

  /** 注册动作名的可翻译参数字段路径（如 message 动作的 `params.text`） */
  registerAction(actionName: string, fields: string | readonly string[]): this {
    assertName(actionName, '动作');
    const list = typeof fields === 'string' ? [fields] : fields;
    let set = this.actionFields.get(actionName);
    if (set === undefined) {
      set = new Set();
      this.actionFields.set(actionName, set);
    }
    for (const field of list) {
      assertValidFieldPath(field, 'params');
      set.add(field);
    }
    return this;
  }

  /**
   * 判断组件字段是否已注册。`canonicalPath` 为规范化路径
   * （数组下标段写作 `[*]`，如 `props.columns[*].title`）。
   */
  isTranslatable(componentType: string | undefined, canonicalPath: string): boolean {
    if (componentType === undefined) {
      return false;
    }
    return this.componentFields.get(componentType)?.has(canonicalPath) ?? false;
  }

  /** 判断动作参数字段是否已注册 */
  isTranslatableActionField(actionName: string, canonicalPath: string): boolean {
    return this.actionFields.get(actionName)?.has(canonicalPath) ?? false;
  }

  /** 已注册组件 type 列表（诊断/调试用） */
  registeredComponents(): string[] {
    return [...this.componentFields.keys()];
  }

  /** 已注册动作名列表（诊断/调试用） */
  registeredActions(): string[] {
    return [...this.actionFields.keys()];
  }
}

/**
 * 内置注册表（设计 4.4 常用展示字段）：
 * Button/Text/Input/Table 列/Select 选项，以及 message / confirm 动作参数。
 */
export function createDefaultTranslatableFieldRegistry(): TranslatableFieldRegistry {
  return new TranslatableFieldRegistry()
    .register('Page', 'props.title')
    .register('Card', 'props.title')
    .register('Statistic', 'props.title')
    .register('Alert', ['props.message', 'props.description'])
    .register('Typography', 'props.text')
    .register('Login', ['props.brand.title', 'props.title', 'props.submitText'])
    .register('Header', ['props.user.items[*].label'])
    .register('DropdownMenu', ['props.items[*].label'])
    .register('Button', ['props.text', 'props.label', 'props.description', 'props.ariaLabel'])
    .register('Text', ['props.text', 'props.description', 'props.ariaLabel'])
    .register('Input', [
      'props.text',
      'props.label',
      'props.placeholder',
      'props.description',
      'props.ariaLabel',
      'props.rules[*].message',
    ])
    .register('Table', [
      'props.label',
      'props.description',
      'props.ariaLabel',
      'props.columns[*].title',
    ])
    .register('Select', [
      'props.label',
      'props.placeholder',
      'props.description',
      'props.ariaLabel',
      'props.options[*].label',
    ])
    .register('DatePicker', ['props.placeholder', 'props.presets[*].label'])
    .register('ToggleGroup', ['props.options[*].label'])
    .registerAction('message', ['params.text'])
    .registerAction('confirm', ['params.title', 'params.content']);
}

let defaultRegistry: TranslatableFieldRegistry | undefined;

/**
 * 共享默认注册表（惰性创建）。请勿原地修改返回的实例；
 * 需要自定义时通过 `createDefaultTranslatableFieldRegistry()` 或
 * `new TranslatableFieldRegistry()` 创建独立副本。
 */
export function getDefaultTranslatableFieldRegistry(): TranslatableFieldRegistry {
  defaultRegistry ??= createDefaultTranslatableFieldRegistry();
  return defaultRegistry;
}
