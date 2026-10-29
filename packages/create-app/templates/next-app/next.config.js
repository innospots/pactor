/**
 * Next.js 构建配置。
 *
 * API_BASE_URLS 提供各环境默认的接口基准地址，供 sitemap、页面加载与
 * 业务请求消费。scripts/build.mjs 通过 APP_ENV 选择环境；未设置时默认
 * prototype。test / production 为占位域名，接入时替换，或用
 * NEXT_PUBLIC_API_BASE_URL 显式覆盖。
 */
const API_BASE_URLS = {
  /** 原型模式：业务数据由 src/backend/mock 提供 */
  prototype: '',
  /** 本地开发：前端 9011，默认后端 8106 */
  development: 'http://localhost:8106',
  /** 测试环境：替换为实际测试环境 API 域名 */
  test: 'https://api-test.example.com',
  /** 生产环境：替换为实际生产 API 域名 */
  production: 'https://api.example.com',
};

const appEnv = ['prototype', 'development', 'test', 'production'].includes(process.env.APP_ENV)
  ? process.env.APP_ENV
  : 'prototype';

/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [{ source: "/", destination: "/workspace", permanent: false }];
  },
  env: {
    NEXT_PUBLIC_APP_ENV: appEnv,
    NEXT_PUBLIC_API_BASE_URL:
      process.env.NEXT_PUBLIC_API_BASE_URL ?? API_BASE_URLS[appEnv] ?? '',
  },
};

module.exports = nextConfig;
