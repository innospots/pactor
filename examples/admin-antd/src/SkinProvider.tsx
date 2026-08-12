/**
 * SkinProvider（pactor-app providers 槽位）：订阅皮肤 store 实时构造
 * antd ThemeConfig 并注入 ConfigProvider；暗黑模式同时切换页面底色
 * （antd 不管 body 背景）。
 */
import { ConfigProvider, theme } from 'antd';
import type { ThemeConfig } from 'antd';
import { useEffect, useMemo, useSyncExternalStore, type ReactNode } from 'react';

import { getSkin, subscribeSkin } from './skin';

export function SkinProvider({ children }: { children?: ReactNode }) {
  const skin = useSyncExternalStore(subscribeSkin, getSkin);

  const themeConfig = useMemo<ThemeConfig>(
    () => ({
      // antd v6 默认启用 CSS 变量，显式开启以便主题运行时切换
      cssVar: {},
      algorithm: skin.dark ? theme.darkAlgorithm : theme.defaultAlgorithm,
      token: {
        colorPrimary: skin.colorPrimary,
        borderRadius: skin.borderRadius,
      },
    }),
    [skin],
  );

  useEffect(() => {
    document.documentElement.style.backgroundColor = skin.dark ? '#141414' : '';
  }, [skin.dark]);

  return <ConfigProvider theme={themeConfig}>{children}</ConfigProvider>;
}
