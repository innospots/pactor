import { toString } from 'qrcode';
import { useEffect, useState, type CSSProperties } from 'react';

import { cn } from '../../../lib/utils.js';
import { Icon } from '../Icon/index.js';

export interface QRCodeProps {
  /** 编码内容；为空时渲染占位块 */
  value?: string;
  /** 尺寸（px），缺省 128 */
  size?: number;
  /** 码体颜色（# 开头 hex，支持 3/4/6/8 位，8 位含透明度），非法值回退为生成库内建黑色 */
  color?: string;
  /** 背景色（同 color 格式），非法值回退为生成库内建白色 */
  bgColor?: string;
  /** 带边框与内边距 */
  bordered?: boolean;
  /** 通用：根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：根节点内联样式 */
  style?: CSSProperties;
}

const HEX_RE = /^#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}(?:[0-9a-fA-F]{2})?)$/;

/** 仅透传合法 hex；非法值回退 undefined（由生成库内建默认色兜底），避免渲染中断 */
function validHex(value: string | undefined): string | undefined {
  return value && HEX_RE.test(value.trim()) ? value.trim() : undefined;
}

/**
 * QRCode 适配器（shadcn kit）：以 qrcode 包生成内联 SVG
 * （toString(value, { type: 'svg' })，自生成可信内容经 dangerouslySetInnerHTML 渲染）；
 * value 为空时渲染占位块。
 */
export function QRCode({
  value,
  size = 128,
  color,
  bgColor,
  bordered,
  className,
  style,
}: QRCodeProps) {
  const [svg, setSvg] = useState('');

  useEffect(() => {
    if (!value) {
      setSvg('');
      return;
    }
    let cancelled = false;
    toString(value, {
      type: 'svg',
      margin: 0,
      color: { dark: validHex(color), light: validHex(bgColor) },
    })
      .then((output) => {
        if (!cancelled) setSvg(output);
      })
      .catch(() => {
        if (!cancelled) setSvg('');
      });
    return () => {
      cancelled = true;
    };
  }, [value, color, bgColor]);

  return (
    <div
      data-slot="qrcode"
      className={cn(
        'inline-flex items-center justify-center',
        bordered && 'rounded-lg border border-border p-2',
        className,
      )}
      style={style}
    >
      {svg ? (
        <div
          data-slot="qrcode-svg"
          className="[&_svg]:block [&_svg]:size-full"
          style={{ width: size, height: size }}
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      ) : (
        <div
          data-slot="qrcode-placeholder"
          className="flex items-center justify-center rounded-md bg-muted text-muted-foreground"
          style={{ width: size, height: size }}
        >
          <Icon name="image" size="lg" />
        </div>
      )}
    </div>
  );
}
