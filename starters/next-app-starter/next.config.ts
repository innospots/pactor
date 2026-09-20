import type { NextConfig } from "next";

/**
 * 外部接口代理（跨域 → 同源）：sitemapSources / pageEndpoint 经
 * apiBaseUrl（src/pactor/config.ts）补全为外部绝对地址，浏览器直连会
 * 跨域。httpHooks 把外部绝对地址改写到项目内前缀 /api-external，
 * 由 Next 服务端转发到 EXTERNAL_API_BASE：
 *   /api-external/api/sitemap  →  ${EXTERNAL_API_BASE}/api/sitemap
 * 缺省转发到本机局域网地址（与 apiBaseUrl 一致），可用环境变量覆盖
 * （见 .env.example）。
 */
const externalApiBase =
  process.env.EXTERNAL_API_BASE ?? "http://11.11.3.109:9011";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api-external/:path*",
        destination: `${externalApiBase}/:path*`,
      },
    ];
  },
};

export default nextConfig;
