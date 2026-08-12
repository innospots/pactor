/**
 * SkinSettings（pactor-app headerExtra 槽位）：头部皮肤按钮 → Drawer
 * 面板（主色预设 / 自定义取色、暗黑开关、圆角滑杆、恢复默认），
 * 全部经 skin store 即时生效（ConfigProvider 在应用树内，无需刷新）。
 */
import { BgColorsOutlined } from '@ant-design/icons';
import { Button, ColorPicker, Drawer, Slider, Space, Switch, Typography } from 'antd';
import { useSyncExternalStore, useState } from 'react';

import { DEFAULT_SKIN, getSkin, setSkin, subscribeSkin } from './skin';

/** 主色预设色板 */
const PRESET_COLORS = [
  '#1677ff',
  '#3C47DD',
  '#722ed1',
  '#eb2f96',
  '#f5222d',
  '#52c41a',
];

export function SkinSettings() {
  const [open, setOpen] = useState(false);
  const skin = useSyncExternalStore(subscribeSkin, getSkin);

  return (
    <>
      <Button
        type="text"
        aria-label="皮肤设置"
        icon={<BgColorsOutlined />}
        onClick={() => setOpen(true)}
      />
      <Drawer
        title="皮肤设置"
        size={320}
        open={open}
        onClose={() => setOpen(false)}
      >
        <Typography.Title level={5}>主色</Typography.Title>
        <Space size={8} wrap>
          {PRESET_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              aria-label={`主色 ${color}`}
              onClick={() => setSkin({ colorPrimary: color })}
              style={{
                width: 28,
                height: 28,
                borderRadius: 4,
                backgroundColor: color,
                cursor: 'pointer',
                border:
                  skin.colorPrimary === color
                    ? '2px solid rgba(0, 0, 0, 0.6)'
                    : '2px solid transparent',
              }}
            />
          ))}
          <ColorPicker
            value={skin.colorPrimary}
            onChange={(value) => setSkin({ colorPrimary: value.toHexString() })}
          />
        </Space>

        <Typography.Title level={5} style={{ marginTop: 24 }}>
          暗黑模式
        </Typography.Title>
        <Switch
          checked={skin.dark}
          onChange={(dark) => setSkin({ dark })}
        />

        <Typography.Title level={5} style={{ marginTop: 24 }}>
          圆角
        </Typography.Title>
        <Slider
          min={0}
          max={16}
          value={skin.borderRadius}
          onChange={(borderRadius) => setSkin({ borderRadius })}
        />

        <Button
          block
          style={{ marginTop: 24 }}
          onClick={() => setSkin({ ...DEFAULT_SKIN })}
        >
          恢复默认
        </Button>
      </Drawer>
    </>
  );
}
