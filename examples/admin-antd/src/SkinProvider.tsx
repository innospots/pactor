/**
 * SkinProvider（pactor-app providers 槽位）：订阅皮肤 store 实时构造
 * antd ThemeConfig 并注入 ConfigProvider；暗黑模式同时切换页面底色
 * （antd 不管 body 背景）。ConfigProvider locale 同步当前语言偏好，
 * 使 antd 组件内置文案（分页、空态等）随语言切换。
 */
import { ConfigProvider, theme } from 'antd';
import type { ThemeConfig } from 'antd';
import enUS from 'antd/locale/en_US';
import zhCN from 'antd/locale/zh_CN';
import { useEffect, useMemo, useSyncExternalStore, type ReactNode } from 'react';

import { getLocale } from './i18n';
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

  return (
    <ConfigProvider
      locale={getLocale() === 'en-US' ? enUS : zhCN}
      theme={themeConfig}
    >
      {children}
    </ConfigProvider>
  );
}
