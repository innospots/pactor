import type { DataSourceConfig } from '@pactor-app/core';
import type { ExpressionScope } from '@pactor-app/expression';

import type {
  HttpAdapter,
  HttpRequestConfig,
} from '../context/adapters.js';
import type { ServiceRegistry } from '../context/context.js';
import { resolveDeep, toError, type LocalizationMode } from '../utils/resolve.js';

/** 单个数据源的运行时状态 */
export interface DataSourceStatus {
  loading: boolean;
  error?: Error;
  data?: unknown;
}

export interface DataStoreDeps {
  dataSources: Record<string, DataSourceConfig>;
  services: ServiceRegistry;
  http: HttpAdapter;
  /** 加载前取当前表达式作用域（params / request 求值用） */
  getScope: () => ExpressionScope;
  /** 本地化协议模式（缺省 'client'），透传给 params / request 求值 */
  localizationMode?: LocalizationMode;
}

/**
 * DataStore：DataSource 运行时（设计文档第 19 节，决策 D3）。
 *
 * 按数据源名维护 `{ loading, error, data }`；按类型分派加载
 * （static / service / http；computed / resource 留待后续迭代）。
 * 错误一律写入 `error` 状态，绝不抛到渲染层。
 */
export class DataStore {
  private readonly configs: Record<string, DataSourceConfig>;
  private readonly services: ServiceRegistry;
  private readonly http: HttpAdapter;
  private readonly getScope: () => ExpressionScope;
  private readonly localizationMode?: LocalizationMode;
  private readonly statuses = new Map<string, DataSourceStatus>();
  private readonly listeners = new Set<() => void>();
  private version = 0;

  constructor(deps: DataStoreDeps) {
    this.configs = deps.dataSources;
    this.services = deps.services;
    this.http = deps.http;
    this.getScope = deps.getScope;
    this.localizationMode = deps.localizationMode;
    for (const name of Object.keys(deps.dataSources)) {
      this.statuses.set(name, { loading: false });
    }
  }

  /** 状态快照（未知名返回空状态，不抛错） */
  get(name: string): DataSourceStatus {
    return this.statuses.get(name) ?? { loading: false };
  }

  /** 同 `get(name)`，语义化别名 */
  getStatus(name: string): DataSourceStatus {
    return this.get(name);
  }

  getData(name: string): unknown {
    return this.get(name).data;
  }

  /** 各数据源当前数据，供表达式作用域的 `data` 键使用 */
  getAllData(): Record<string, unknown> {
    const out: Record<string, unknown> = {};
    for (const [name, status] of this.statuses) {
      out[name] = status.data;
    }
    return out;
  }

  /** 各数据源的加载状态（loading / error），供表达式作用域的 `dataStatus` 键使用 */
  getAllStatus(): Record<string, { loading: boolean; error?: Error }> {
    const out: Record<string, { loading: boolean; error?: Error }> = {};
    for (const [name, status] of this.statuses) {
      out[name] = { loading: status.loading, error: status.error };
    }
    return out;
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /** 版本号，供 `useSyncExternalStore` 的 getSnapshot 使用 */
  getVersion(): number {
    return this.version;
  }

  /** 触发所有 `autoLoad: true` 的数据源（PageRuntime 初始化阶段调用） */
  init(): Promise<void[]> {
    return Promise.all(this.autoLoadNames().map((name) => this.load(name)));
  }

  /**
   * 运行时注册数据源（如 DslSourceRef 片段载荷携带的 dataSources）：
   * 名称冲突时告警并跳过（同一引用重复注册幂等），成功时播种空状态、
   * 递增版本并通知订阅者。返回是否注册成功。
   */
  register(name: string, config: DataSourceConfig): boolean {
    if (this.configs[name] !== undefined) {
      console.warn(
        `[@pactor-app/runtime] dataSource 名称冲突："${name}" 已注册，跳过重复注册`,
      );
      return false;
    }
    this.configs[name] = config;
    this.statuses.set(name, { loading: false });
    this.notify();
    return true;
  }

  /** 批量运行时注册，返回实际注册成功的名称列表（冲突名跳过） */
  registerAll(configs: Record<string, DataSourceConfig>): string[] {
    const registered: string[] = [];
    for (const [name, config] of Object.entries(configs)) {
      if (this.register(name, config)) {
        registered.push(name);
      }
    }
    return registered;
  }

  /** 注销运行时注册的数据源（如片段边界卸载时回收）；未知名为 no-op */
  unregister(name: string): void {
    if (this.configs[name] === undefined) {
      return;
    }
    delete this.configs[name];
    this.statuses.delete(name);
    this.notify();
  }

  /**
   * 加载指定数据源。状态流转：开始置 loading 并清空 error；
   * 成功写入 data；失败写入 error（保留旧 data）。MUST NOT 抛出。
   */
  async load(name: string): Promise<void> {
    const config = this.configs[name];
    if (!config) {
      throw new Error(`[@pactor-app/runtime] unknown dataSource: "${name}"`);
    }
    const previous = this.get(name);
    this.update(name, { loading: true, error: undefined, data: previous.data });
    try {
      const raw = await this.loadByType(config);
      const data = applyOptionMapping(raw, config);
      this.update(name, { loading: false, data, error: undefined });
    } catch (cause) {
      this.update(name, {
        loading: false,
        error: toError(cause),
        data: previous.data,
      });
    }
  }

  /** 重新加载指定数据源（语义同 `load`，供模板与 Action 调用） */
  refresh(name: string): Promise<void> {
    return this.load(name);
  }

  /**
   * reload 语义：指定名称时刷新该数据源；
   * 缺省时刷新全部 autoLoad 数据源（供 Action 引擎 `reload` 动作调用）。
   */
  reload(name?: string): Promise<void | void[]> {
    if (name !== undefined) {
      return this.load(name);
    }
    return Promise.all(this.autoLoadNames().map((n) => this.load(n)));
  }

  private autoLoadNames(): string[] {
    return Object.entries(this.configs)
      .filter(([, config]) => config.autoLoad === true)
      .map(([name]) => name);
  }

  private async loadByType(config: DataSourceConfig): Promise<unknown> {
    switch (config.type) {
      case 'static':
        return config.value;
      case 'service': {
        const serviceName = config.service ?? '';
        const handler = this.services.get(serviceName);
        if (!handler) {
          throw new Error(
            `[@pactor-app/runtime] service not registered: "${serviceName}"`,
          );
        }
        const params = resolveDeep(config.params ?? {}, this.getScope(), {
          localizationMode: this.localizationMode,
        }) as Record<
          string,
          unknown
        >;
        return handler(params);
      }
      case 'http': {
        if (!config.request) {
          throw new Error('[@pactor-app/runtime] http dataSource 缺少 request 配置');
        }
        const request = resolveDeep(
          config.request,
          this.getScope(),
          { localizationMode: this.localizationMode },
        ) as HttpRequestConfig;
        return this.http.request(request);
      }
      default:
        // computed / resource：留待 @pactor-app/resource 或后续迭代
        throw new Error(
          `[@pactor-app/runtime] unsupported dataSource type: "${config.type}"`,
        );
    }
  }

  private update(name: string, status: DataSourceStatus): void {
    this.statuses.set(name, status);
    this.notify();
  }

  private notify(): void {
    this.version += 1;
    for (const listener of [...this.listeners]) {
      listener();
    }
  }
}

/**
 * 选项字段映射：dataSource 声明了 valueField / labelField / disabledField
 * 且加载结果为数组时，每项归一化出 `{ label, value, disabled }` 键
 * （原字段经展开保留，已规范的 { label, value } 数据声明与否均不破坏）。
 */
function applyOptionMapping(data: unknown, config: DataSourceConfig): unknown {
  if (!config.valueField && !config.labelField && !config.disabledField) {
    return data;
  }
  if (!Array.isArray(data)) {
    return data;
  }
  const valueField = config.valueField ?? 'value';
  const labelField = config.labelField ?? 'label';
  return data.map((item) => {
    if (item === null || typeof item !== 'object') {
      return item;
    }
    const record = item as Record<string, unknown>;
    return {
      ...record,
      label: record[labelField],
      value: record[valueField],
      disabled: config.disabledField
        ? Boolean(record[config.disabledField])
        : Boolean(record.disabled),
    };
  });
}
