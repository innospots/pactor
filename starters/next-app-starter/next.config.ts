import type { NextConfig } from "next";

/**
 * 外部接口代理（跨域 → 同源）：sitemapSources 与 DSL 内的接口地址
 * 大多是外部绝对地址，浏览器直连会跨域。约定项目内前缀 /api-external，
 * 由 Next 服务端转发到 EXTERNAL_API_BASE（见 .env.example）：
 *   /api-external/sitemap  →  ${EXTERNAL_API_BASE}/sitemap
 * 未配置 EXTERNAL_API_BASE 时代理不生效（演示模式，接口全部同源）。
 */
const externalApiBase = process.env.EXTERNAL_API_BASE;

const nextConfig: NextConfig = {
  async rewrites() {
    if (!externalApiBase) {
      return [];
    }
    return [
      {
        source: "/api-external/:path*",
        destination: `${externalApiBase}/:path*`,
      },
    ];
  },
};

export default nextConfig;
