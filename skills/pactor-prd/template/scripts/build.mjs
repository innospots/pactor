#!/usr/bin/env node
/**
 * 按目标环境打包：
 *   node scripts/build.mjs <development|test|production>
 * 对应 package.json 的 build / build:dev / build:test 命令。
 * 环境经 APP_ENV 注入（构建期由 next.config.js 读取并解析
 * API_BASE_URLS，结果内联进客户端包，见 src/pactor/config.ts）。
 * 跨平台：Windows 下经 shell 解析 next.cmd。
 */
import { spawn } from 'node:child_process';

const ENVS = ['development', 'test', 'production'];
const env = process.argv[2];

if (!ENVS.includes(env)) {
  console.error(`用法: node scripts/build.mjs <${ENVS.join('|')}>`);
  process.exit(2);
}

process.env.APP_ENV = env;
console.log(`\n构建目标环境: ${env}（APP_ENV=${env}）\n`);

const child = spawn('next', ['build'], {
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

child.on('error', (error) => {
  console.error('启动 next build 失败:', error.message);
  process.exit(1);
});

child.on('exit', (code) => {
  process.exit(code ?? 1);
});
