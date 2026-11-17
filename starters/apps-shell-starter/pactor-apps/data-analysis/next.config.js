/** @type {import('next').NextConfig} */
const nextConfig = {
  /** 独立运行：根路径进入数据看板。 */
  async redirects() {
    return [{ source: "/", destination: "/dashboard", permanent: false }];
  },
};

module.exports = nextConfig;
