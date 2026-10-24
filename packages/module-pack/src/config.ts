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
  /** 服务端入口（工程相对路径，如 module/server.ts）；与 apiPrefixes 成对出现 */
  serverEntry?: string;
  /**
   * 模块 API 逻辑前缀（如 /api/risk-analysis）。打包时命中这些前缀的 DSL URL
   * 会改写为 /api/modules/<id>/...，由 Shell 的通用分发入口承接。
   */
  apiPrefixes?: string[];
  /** init 时自动发现的 src/pactor/*-actions.ts（仅记录，client entry 自行 import） */
  actions: string[];
  publicDir: string;
  /** target profile id（如 innospots-web-shell@2） */
  target: string;
  /**
   * 模块级访问默认值：'public' 时构建期给未声明 public/permission 的
   * pages / menus 补 public: true（缺省填充）；默认 'authenticated' 不改动。
   */
  access: { default: 'public' | 'authenticated' };
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

  if (raw.demo !== undefined) {
    throw new ConfigError(
      `${file}: demo.public 已移除，请改用 "access": { "default": "public" }（缺省填充语义，不覆盖显式 permission）`,
    );
  }
  const access = isRecord(raw.access) ? raw.access : {};
  const accessDefault = readString(access, 'default', file, 'access') ?? 'authenticated';
  if (accessDefault !== 'public' && accessDefault !== 'authenticated') {
    throw new ConfigError(`${file}: access.default 只支持 "public" | "authenticated"`);
  }
  const tailwind = isRecord(raw.tailwind) ? raw.tailwind : {};
  const rewrite = isRecord(raw.rewrite) ? raw.rewrite : {};

  const serverEntry = readString(raw, 'serverEntry', file);
  const apiPrefixes =
    raw.apiPrefixes === undefined
      ? undefined
      : readStringArray(raw.apiPrefixes, 'apiPrefixes', file);
  validateServerConfig({ id, serverEntry, apiPrefixes, file });

  return {
    id,
    name,
    basePath,
    yamlRoot: readString(raw, 'yamlRoot', file) ?? CONFIG_DEFAULTS.yamlRoot,
    clientEntry: readString(raw, 'clientEntry', file) ?? CONFIG_DEFAULTS.clientEntry,
    ...(serverEntry !== undefined ? { serverEntry, apiPrefixes } : {}),
    actions,
    publicDir: readString(raw, 'publicDir', file) ?? CONFIG_DEFAULTS.publicDir,
    target: readString(raw, 'target', file) ?? CONFIG_DEFAULTS.target,
    access: { default: accessDefault },
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

/** 模块 id 需可安全放入公开 URL 路径段（仅启用 server entry 时强制） */
const URL_SAFE_MODULE_ID_RE = /^[A-Za-z0-9._~-]+$/;

/** API 前缀格式：/api/<seg>(/<seg>)*，不允许尾斜杠、query、hash、通配、参数 */
const API_PREFIX_RE = /^\/api\/[A-Za-z0-9._~-]+(?:\/[A-Za-z0-9._~-]+)*$/;

/** 保留前缀：与 Shell 自带路由冲突，或会导致二次 namespacing */
const RESERVED_API_PREFIXES = ['/api/modules', '/api/runtime'];

interface ServerConfigInput {
  id: string;
  serverEntry?: string;
  apiPrefixes?: string[];
  file: string;
}

/** 校验 serverEntry / apiPrefixes 成对性与前缀合法性（未配置时直接返回） */
function validateServerConfig(input: ServerConfigInput): void {
  const { id, serverEntry, apiPrefixes, file } = input;
  if (serverEntry === undefined && apiPrefixes === undefined) return;
  if (serverEntry === undefined || apiPrefixes === undefined) {
    throw new ConfigError(`${file}: serverEntry 与 apiPrefixes 必须同时配置（缺一不可）`);
  }
  if (apiPrefixes.length === 0) {
    throw new ConfigError(`${file}: 配置 serverEntry 时 apiPrefixes 必须是非空数组`);
  }
  if (!URL_SAFE_MODULE_ID_RE.test(id)) {
    throw new ConfigError(
      `${file}: 启用 serverEntry 时 id 只能包含字母、数字、. _ ~ -（当前: ${JSON.stringify(id)}）`,
    );
  }
  for (const prefix of apiPrefixes) {
    if (!API_PREFIX_RE.test(prefix)) {
      throw new ConfigError(
        `${file}: apiPrefixes 含非法前缀 ${JSON.stringify(prefix)}（要求形如 /api/risk-analysis，不能含 query / hash / 尾斜杠 / 通配 / :param）`,
      );
    }
    const reserved = RESERVED_API_PREFIXES.find(
      (item) => prefix === item || prefix.startsWith(`${item}/`),
    );
    if (reserved) {
      throw new ConfigError(
        `${file}: apiPrefixes 不能使用保留前缀 ${reserved}（Shell 自带路由）: ${prefix}`,
      );
    }
  }
  for (let i = 0; i < apiPrefixes.length; i += 1) {
    for (let j = i + 1; j < apiPrefixes.length; j += 1) {
      const a = apiPrefixes[i]!;
      const b = apiPrefixes[j]!;
      if (a === b) {
        throw new ConfigError(`${file}: apiPrefixes 存在重复前缀: ${a}`);
      }
      if (a.startsWith(`${b}/`) || b.startsWith(`${a}/`)) {
        throw new ConfigError(
          `${file}: apiPrefixes 前缀互相包含（同一模块内无法确定归属）: ${a} / ${b}`,
        );
      }
    }
  }
}
