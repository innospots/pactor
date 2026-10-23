import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

import { DEFAULT_TARGET } from './profiles/index.js';

/**
 * `pactor.module.json` 配置加载与校验（手写校验，避免重依赖）。
 * 字段见设计文档 §3.2；未提供的字段使用合理默认值。
 */

/** 配置相关错误（缺失 / 解析失败 / 类型非法） */
export class ConfigError extends Error {}

export const CONFIG_FILE = 'pactor.module.json';

export interface TailwindConfig {
  enabled: boolean;
  /** 自定义入口 css（工程相对路径）；缺省时生成 @import "tailwindcss" + @source */
  input?: string;
  /** 额外扫描目录（绝对路径或工程相对路径）；缺省扫描 dist-module/dsl 与 client 源码目录 */
  scan?: string[];
}

export interface ModulePackConfig {
  /** 模块 id（进入 globalPageId 前缀与资源路径） */
  id: string;
  name: string;
  /** 路由前缀（规范化保证以 / 开头、无尾斜杠） */
  basePath: string;
  yamlRoot: string;
  clientEntry: string;
  /** init 时自动发现的 src/pactor/*-actions.ts（仅记录，client entry 自行 import） */
  actions: string[];
  publicDir: string;
  /** target profile id（如 innospots-web-shell@2） */
  target: string;
  demo: { public: boolean };
  tailwind: TailwindConfig;
  rewrite: {
    /** 绝对 API 地址重写为去 origin 的相对路径（默认 true） */
    absoluteApiToRelative: boolean;
  };
  /** 产物目录（工程相对路径，默认 dist-module） */
  outDir: string;
}

export const CONFIG_DEFAULTS = {
  yamlRoot: 'src/server/yaml',
  clientEntry: 'module/client.ts',
  publicDir: 'public',
  target: DEFAULT_TARGET,
  outDir: 'dist-module',
} as const;

type AnyRecord = Record<string, unknown>;

/** 加载并校验工程根下的 pactor.module.json（或 --config 指定文件） */
export function loadModuleConfig(projectDir: string, configPath?: string): ModulePackConfig {
  const file = configPath
    ? resolve(projectDir, configPath)
    : join(projectDir, CONFIG_FILE);
  if (!existsSync(file)) {
    throw new ConfigError(`缺少配置文件: ${file}（可先执行 pactor module init 生成）`);
  }
  let raw: unknown;
  try {
    raw = JSON.parse(readFileSync(file, 'utf8'));
  } catch (error) {
    throw new ConfigError(`配置解析失败: ${file}: ${(error as Error).message}`);
  }
  if (!isRecord(raw)) {
    throw new ConfigError(`${file}: 配置必须是 JSON 对象`);
  }

  const id = readString(raw, 'id', file);
  if (!id) {
    throw new ConfigError(`${file}: 缺少必填字段 id（模块 id，进入 globalPageId 前缀）`);
  }

  const name = readString(raw, 'name', file) ?? id;
  let basePath = readString(raw, 'basePath', file) ?? `/${id}`;
  if (!basePath.startsWith('/')) basePath = `/${basePath}`;
  if (basePath.length > 1 && basePath.endsWith('/')) basePath = basePath.slice(0, -1);

  const actions = raw.actions === undefined ? [] : readStringArray(raw.actions, 'actions', file);

  const demo = isRecord(raw.demo) ? raw.demo : {};
  const tailwind = isRecord(raw.tailwind) ? raw.tailwind : {};
  const rewrite = isRecord(raw.rewrite) ? raw.rewrite : {};

  return {
    id,
    name,
    basePath,
    yamlRoot: readString(raw, 'yamlRoot', file) ?? CONFIG_DEFAULTS.yamlRoot,
    clientEntry: readString(raw, 'clientEntry', file) ?? CONFIG_DEFAULTS.clientEntry,
    actions,
    publicDir: readString(raw, 'publicDir', file) ?? CONFIG_DEFAULTS.publicDir,
    target: readString(raw, 'target', file) ?? CONFIG_DEFAULTS.target,
    demo: { public: readBoolean(demo, 'public', file, 'demo') ?? false },
    tailwind: {
      enabled: readBoolean(tailwind, 'enabled', file, 'tailwind') ?? false,
      input: readString(tailwind, 'input', file, 'tailwind'),
      scan:
        tailwind.scan === undefined
          ? undefined
          : readStringArray(tailwind.scan, 'tailwind.scan', file),
    },
    rewrite: {
      absoluteApiToRelative:
        readBoolean(rewrite, 'absoluteApiToRelative', file, 'rewrite') ?? true,
    },
    outDir: readString(raw, 'outDir', file) ?? CONFIG_DEFAULTS.outDir,
  };
}

function isRecord(value: unknown): value is AnyRecord {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function readString(
  record: AnyRecord,
  key: string,
  file: string,
  parent?: string,
): string | undefined {
  const value = record[key];
  if (value === undefined) return undefined;
  const label = parent ? `${parent}.${key}` : key;
  if (typeof value !== 'string' || value.length === 0) {
    throw new ConfigError(`${file}: ${label} 必须是非空字符串`);
  }
  return value;
}

function readBoolean(
  record: AnyRecord,
  key: string,
  file: string,
  parent: string,
): boolean | undefined {
  const value = record[key];
  if (value === undefined) return undefined;
  if (typeof value !== 'boolean') {
    throw new ConfigError(`${file}: ${parent}.${key} 必须是布尔值`);
  }
  return value;
}

function readStringArray(value: unknown, label: string, file: string): string[] {
  if (!Array.isArray(value) || value.some((item) => typeof item !== 'string')) {
    throw new ConfigError(`${file}: ${label} 必须是字符串数组`);
  }
  return value as string[];
}
