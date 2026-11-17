/** @type {import('next').NextConfig} */
const nextConfig = {
  /** 独立运行：根路径进入产品管理。 */
  async redirects() {
    return [{ source: "/", destination: "/products", permanent: false }];
  },
};

module.exports = nextConfig;
