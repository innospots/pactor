/**
 * LanguageSwitcher（pactor-app headerExtra 槽位）：头部语言切换下拉。
 * 切换经 switchLocale 持久化并整页刷新，刷新后 options.locale、
 * bootstrap 菜单文案与 antd ConfigProvider locale 一并按新语言重建。
 */
import { GlobalOutlined } from '@ant-design/icons';
import { Select, Space } from 'antd';

import { getLocale, switchLocale } from './i18n';

export function LanguageSwitcher() {
  return (
    <Space size={4}>
      {/* admin header 为深色底，图标显式浅色 */}
      <GlobalOutlined aria-label="language" style={{ color: 'rgba(255, 255, 255, 0.88)' }} />
      <Select
        size="small"
        value={getLocale()}
        style={{ width: 104 }}
        options={[
          { label: '中文', value: 'zh-CN' },
          { label: 'English', value: 'en-US' },
        ]}
        onChange={(locale) => switchLocale(locale)}
      />
    </Space>
  );
}
