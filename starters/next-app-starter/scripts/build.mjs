#!/usr/bin/env node
/**
 * 按目标环境打包：
 *   node scripts/build.mjs <prototype|development|test|production>
 * 对应 package.json 的 build:prototype / build:dev / build:test / build 命令。
 * 环境经 APP_ENV 注入（构建期由 next.config.js 读取并解析
 * API_BASE_URLS，结果内联进客户端包，见 src/frontend/config.ts）。
 * 生产构建使用 Webpack：Turbopack 的 CSS 子进程在部分受限环境无法绑定端口。
 * 跨平台：Windows 下经 shell 解析 next.cmd。
 */
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';

const ENVS = ['prototype', 'development', 'test', 'production'];
const env = process.argv[2];

if (!ENVS.includes(env)) {
  console.error(`用法: node scripts/build.mjs <${ENVS.join('|')}>`);
  process.exit(2);
}

process.env.APP_ENV = env;
console.log(`\n构建目标环境: ${env}（APP_ENV=${env}）\n`);

const require = createRequire(import.meta.url);
const nextBin = require.resolve('next/dist/bin/next');
const child = spawn(process.execPath, [nextBin, 'build', '--webpack'], {
  stdio: 'inherit',
});

child.on('error', (error) => {
  console.error('启动 next build 失败:', error.message);
  process.exit(1);
});

child.on('exit', (code) => {
  process.exit(code ?? 1);
});
