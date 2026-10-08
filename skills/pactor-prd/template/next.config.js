/**
 * Next.js 构建配置。
 *
 * API_BASE_URLS：各环境默认的外部接口基准地址（SitemapApp baseUrl）。
 * - 环境由构建命令注入（scripts/build.mjs 设置 APP_ENV：
 *   build / build:dev / build:test → production / development / test）；
 * - 解析结果经 env 配置内联进客户端包（src/pactor/config.ts 消费）；
 * - test / production 为占位域名，接入真实环境时替换；
 * - 构建环境可设 NEXT_PUBLIC_API_BASE_URL 显式覆盖（域名不符合约定时）。
 */
const API_BASE_URLS = {
  /** 本地开发：无服务层接口（转发命中前端兜底 → 返回空数据）；接本地后端时改为其地址 */
  development: 'http://localhost:9011/backend',
  /** 测试环境：替换为实际测试环境 API 域名 */
  test: 'https://api-test.example.com',
  /** 生产环境：替换为实际生产 API 域名 */
  production: 'https://api.example.com',
};

const appEnv = ['development', 'test', 'production'].includes(process.env.APP_ENV)
  ? process.env.APP_ENV
  : 'development';

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_BASE_URL:
      process.env.NEXT_PUBLIC_API_BASE_URL ?? API_BASE_URLS[appEnv],
  },
};

module.exports = nextConfig;
