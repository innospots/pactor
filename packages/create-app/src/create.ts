import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

/** 可注入的输出通道：命令处理器经此输出，测试注入内存收集函数 */
export interface CliIo {
  /** 标准输出一行 */
  out(line: string): void;
  /** 标准错误一行 */
  err(line: string): void;
}

/** 模板占位符（全局替换； replacer 用函数形式防应用名含 `$` 特殊序列） */
const APP_NAME_PLACEHOLDER = /__APP_NAME__/g;

/** 模板根占位符清单文件名（脚手架元数据，不复制进生成工程） */
export const PLACEHOLDER_MANIFEST = 'placeholders.json';

/** 占位符清单：键 → 描述与默认示例值 */
export type PlaceholderManifest = Record<string, { description?: string; example: string }>;

/** 读取模板根的占位符默认值（placeholders.json 的 example）；无清单时返回空表 */
export function loadPlaceholderDefaults(templatesDir: string): Record<string, string> {
  const manifestPath = join(templatesDir, PLACEHOLDER_MANIFEST);
  if (!existsSync(manifestPath)) return {};
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as PlaceholderManifest;
  return Object.fromEntries(Object.entries(manifest).map(([key, v]) => [key, v.example]));
}

/** 可选模板清单（编号即交互选择的默认顺序） */
export const TEMPLATES = [
  { id: 'next-app', label: 'Next.js 全栈（含 mock API，dev 端口 9011）' },
  { id: 'spa', label: 'Vite 纯前端（dev 端口 9012）' },
] as const;

export type TemplateId = (typeof TEMPLATES)[number]['id'];

/** 默认模板（非 TTY 或交互直接回车时使用） */
export const DEFAULT_TEMPLATE: TemplateId = 'next-app';

/**
 * 定位内置模板目录：源码（src/）与构建产物（dist/）层级不同，逐候选探测。
 */
export function defaultTemplatesDir(template: string): string {
  const here = dirname(fileURLToPath(import.meta.url));
  for (const candidate of [
    join(here, '../templates', template),
    join(here, '../../templates', template),
  ]) {
    if (existsSync(candidate)) return candidate;
  }
  return join(here, '../templates', template);
}

/**
 * 递归复制模板目录。
 * 含 `__APP_NAME__` 或 `{{KEY}}` 的文件按 utf8 文本替换占位；其余（含二进制如 favicon）
 * 按字节原样复制，避免 utf8 往返损坏。
 * 模板根的 placeholders.json 是脚手架元数据，跳过不复制。
 */
function copyTemplate(
  src: string,
  dest: string,
  appName: string,
  placeholders: Record<string, string>,
  isRoot = true,
): void {
  mkdirSync(dest, { recursive: true });
  for (const entry of readdirSync(src)) {
    if (isRoot && entry === PLACEHOLDER_MANIFEST) continue;
    const from = join(src, entry);
    const to = join(dest, entry);
    if (statSync(from).isDirectory()) {
      copyTemplate(from, to, appName, placeholders, false);
      continue;
    }
    const content = readFileSync(from);
    if (content.includes('__APP_NAME__') || content.includes('{{')) {
      let text = content
        .toString('utf8')
        .replace(APP_NAME_PLACEHOLDER, () => appName);
      for (const [key, value] of Object.entries(placeholders)) {
        // 与 prd-template.mjs 一致的转义语义：带引号字面量 "{{KEY}}" 按 JSON 字符串
        // 值替换（值含引号/换行时仍合法）；裸 {{KEY}} 兜底原样替换。
        text = text.split(`"{{${key}}}"`).join(JSON.stringify(value));
        text = text.split(`{{${key}}}`).join(value);
      }
      writeFileSync(to, text, 'utf8');
    } else {
      writeFileSync(to, content);
    }
  }
}

/**
 * 生成工程：target 已存在且非空时由调用方拦截，这里只做复制。
 * `{{KEY}}` 占位符取 options.values 覆盖值，缺省回退模板 placeholders.json 的示例值。
 * 返回应用名（取目标目录名，name 可为相对/绝对路径）。
 */
export function scaffold(
  target: string,
  template: TemplateId,
  templatesDir: string = defaultTemplatesDir(template),
  options: { values?: Record<string, string> } = {},
): string {
  const appName = basename(target);
  const placeholders = { ...loadPlaceholderDefaults(templatesDir), ...options.values };
  copyTemplate(templatesDir, target, appName, placeholders);
  return appName;
}

/**
 * 目标目录检查：已存在且非空时报错（退出码 2），不覆盖任何内容。
 */
export function checkTarget(target: string, io: CliIo): boolean {
  if (!existsSync(target)) return true;
  if (!statSync(target).isDirectory()) {
    io.err(`目标已存在且不是目录: ${target}`);
    return false;
  }
  if (readdirSync(target).length > 0) {
    io.err(`目标目录非空，拒绝覆盖: ${target}`);
    return false;
  }
  return true;
}

/** 解析目标目录（相对路径基于 cwd） */
export function resolveTarget(name: string): string {
  return resolve(name);
}

/** 各模板 dev 端口（与模板 README 说法一致） */
const DEV_HINTS: Record<TemplateId, string> = {
  'next-app': '  pnpm dev        # http://localhost:9011',
  spa: '  pnpm dev        # http://localhost:9012',
};

/** 生成成功后的下一步提示 */
export function printNextSteps(io: CliIo, name: string, template: TemplateId): void {
  io.out('下一步:');
  io.out(`  cd ${name}`);
  io.out('  pnpm install');
  io.out(DEV_HINTS[template]);
}
