import type { NextConfig } from 'next';

export interface WithShellOptions {
  /** 需要参与编译的 UI 模块包名（如 risk-analysis），去重合并进 transpilePackages */
  transpilePackages?: string[];
}

/** 合并 shell 约定的 next.config 项；其余字段原样透传。 */
export function withShell(
  config: NextConfig,
  options: WithShellOptions = {},
): NextConfig {
  const transpilePackages = [
    ...new Set([
      ...(config.transpilePackages ?? []),
      ...(options.transpilePackages ?? []),
    ]),
  ];
  return { ...config, transpilePackages };
}
