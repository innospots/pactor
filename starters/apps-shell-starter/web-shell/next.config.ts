import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /** 容器部署时可改为 standalone，并确认 .generated 与 public/modules 进入镜像 */
  // output: "standalone",
  // 接入 UI 模块后按需登记，如：transpilePackages: ["@your-scope/ui-module"]
  transpilePackages: [],
};

export default nextConfig;
