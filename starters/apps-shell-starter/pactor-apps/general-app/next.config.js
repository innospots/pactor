/** @type {import('next').NextConfig} */
const nextConfig = {
  /** 独立运行：根路径进入工作台（模块接入 Shell 后由 Shell 路由接管）。 */
  async redirects() {
    return [{ source: "/", destination: "/workspace", permanent: false }];
  },
};

module.exports = nextConfig;
