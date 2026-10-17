import { useI18n } from '@pactor-app/runtime';
import {
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from 'react';

import { cn } from '../../../lib/utils.js';
import { Input as ShadcnInput } from '../../../ui/input.js';
import { Popover, PopoverContent, PopoverTrigger } from '../../../ui/popover.js';
import { useFormContext } from '../Form/context.js';
import { FieldShell } from '../Form/form-item.js';
import type { FieldRule } from '../Input/index.js';

export interface ColorPickerProps {
  /** 字段名；在 Form 内声明 name 即自动成为表单项 */
  name?: string;
  /** 表单项标签 */
  label?: string;
  /** 校验规则 */
  rules?: FieldRule[];
  /** 受控值（hex 颜色，支持 3/4/6/8 位，如 1677ff、1677ffcc）；Form 内作为字段初始值 */
  value?: string;
  /** 预设色板（hex 数组） */
  presets?: string[];
  placeholder?: string;
  disabled?: boolean;
  /** 颜色变化事件，传出 hex 字符串（透明度小于 1 时为 8 位 hex） */
  onChange?: (value: string) => void;
  /** 通用：根节点 class（Form 内为 form-item 容器，独立渲染时为触发器） */
  className?: string;
  /** 通用：根节点内联样式（同 className 的挂载规则） */
  style?: CSSProperties;
}

interface Hsva {
  /** 色相 0-360 */
  h: number;
  /** 饱和度 0-1 */
  s: number;
  /** 明度 0-1 */
  v: number;
  /** 透明度 0-1 */
  a: number;
}

const HEX_RE = /^#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/;

/** 3/4 位 hex 展开为 6/8 位小写（abc → aabbcc）；非法输入返回 undefined */
export function normalizeHex(value: string): string | undefined {
  const trimmed = value.trim();
  if (!HEX_RE.test(trimmed)) return undefined;
  const lower = trimmed.toLowerCase();
  if (lower.length <= 5) {
    return `#${lower
      .slice(1)
      .split('')
      .map((ch) => ch + ch)
      .join('')}`;
  }
  return lower;
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

function toHex2(value: number): string {
  return value.toString(16).padStart(2, '0');
}

function hsvToRgb(h: number, s: number, v: number): [number, number, number] {
  const hue = ((h % 360) + 360) % 360;
  const c = v * s;
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = v - c;
  let r = 0;
  let g = 0;
  let b = 0;
  if (hue < 60) {
    r = c;
    g = x;
  } else if (hue < 120) {
    r = x;
    g = c;
  } else if (hue < 180) {
    g = c;
    b = x;
  } else if (hue < 240) {
    g = x;
    b = c;
  } else if (hue < 300) {
    r = x;
    b = c;
  } else {
    r = c;
    b = x;
  }
  return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
}

function rgbToHsv(r: number, g: number, b: number): [number, number, number] {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;
  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const delta = max - min;
  let h = 0;
  if (delta !== 0) {
    if (max === rn) {
      h = 60 * (((gn - bn) / delta) % 6);
    } else if (max === gn) {
      h = 60 * ((bn - rn) / delta + 2);
    } else {
      h = 60 * ((rn - gn) / delta + 4);
    }
  }
  if (h < 0) h += 360;
  return [Math.round(h), max === 0 ? 0 : delta / max, max];
}

/** hsva 序列化为 6 位（a=1）或 8 位（a<1）hex */
function hsvaToHex(hsva: Hsva): string {
  const [r, g, b] = hsvToRgb(hsva.h, hsva.s, hsva.v);
  const base = `#${toHex2(r)}${toHex2(g)}${toHex2(b)}`;
  if (hsva.a >= 1) return base;
  return `${base}${toHex2(Math.round(clamp01(hsva.a) * 255))}`;
}

function parseHexColor(value: string | undefined): Hsva | undefined {
  if (!value) return undefined;
  const hex = normalizeHex(value);
  if (!hex) return undefined;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const a = hex.length === 9 ? round2(parseInt(hex.slice(7, 9), 16) / 255) : 1;
  const [h, s, v] = rgbToHsv(r, g, b);
  return { h, s, v, a };
}

/** 透明度棋盘格底纹（命名色，令牌体系外的功能色由动态计算承担） */
const CHECKERBOARD = 'repeating-conic-gradient(lightgray 0% 25%, white 0% 50%)';
/** 色相光谱（命名纯色等价 hsl 光谱） */
const HUE_GRADIENT = 'linear-gradient(to right, red, yellow, lime, cyan, blue, magenta, red)';
const HANDLE_STYLE: CSSProperties = {
  border: '2px solid white',
  boxShadow: '0 0 2px black',
};

/** 指针拖拽：按下即响应并跟踪 window 移动直至抬起（jsdom 友好，不依赖 setPointerCapture）；拖拽期间置位 draggingRef 阻止受控值回冲 */
function useDrag(
  onMove: (clientX: number, clientY: number, rect: DOMRect) => void,
  draggingRef: RefObject<boolean>,
) {
  const ref = useRef<HTMLDivElement>(null);
  const onPointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    event.preventDefault();
    draggingRef.current = true;
    const handle = (clientX: number, clientY: number) =>
      onMove(clientX, clientY, el.getBoundingClientRect());
    handle(event.clientX, event.clientY);
    const onPointerMove = (ev: PointerEvent) => handle(ev.clientX, ev.clientY);
    const onPointerUp = () => {
      draggingRef.current = false;
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
  };
  return { ref, onPointerDown };
}

/**
 * ColorPicker 适配器（shadcn kit）：react-color Sketch 风格取色面板——
 * 饱和度/明度二维面板 + 色相/透明度滑杆 + 当前色预览 + hex 与 RGBA
 * 通道输入 + 预设色板；拖拽过程实时提交（onChange 传出 6/8 位 hex，
 * DSL 语义值）。Form 内声明 `name` 自动成为表单项。
 */
export function ColorPicker({
  name,
  label,
  rules,
  value,
  presets,
  placeholder,
  disabled,
  onChange,
  className,
  style,
}: ColorPickerProps) {
  const form = useFormContext();
  const controlId = useId();
  const inForm = form?.inForm === true && typeof name === 'string' && name !== '';
  const [open, setOpen] = useState(false);
  const { t } = useI18n();

  useEffect(() => {
    if (inForm && form && name) {
      form.registerField(name, rules, value);
      return () => form.unregisterField(name);
    }
    return undefined;
  });

  // 独立渲染：内部选中态（外部 value 变化时同步镜像）
  const [innerValue, setInnerValue] = useState(value);
  useEffect(() => {
    if (!inForm) setInnerValue(value);
  }, [inForm, value]);

  const current = inForm && form && name ? form.values[name] : innerValue;
  const currentHex = typeof current === 'string' ? current : '';

  // 面板工作色（HSVA）；受控值变化时回同步，拖拽期间不回冲
  const [hsva, setHsva] = useState<Hsva>(
    () => parseHexColor(currentHex) ?? { h: 0, s: 0, v: 0, a: 1 },
  );
  const draggingRef = useRef(false);
  useEffect(() => {
    if (draggingRef.current) return;
    const parsed = parseHexColor(currentHex);
    if (parsed && hsvaToHex(parsed) !== hsvaToHex(hsva)) {
      setHsva(parsed);
    }
  });

  // 弹层内 hex 文本输入态（打开时同步当前值；拖拽/通道提交后实时镜像）
  const [hexInput, setHexInput] = useState(currentHex);
  const [hexError, setHexError] = useState(false);
  useEffect(() => {
    setHexInput(currentHex);
  }, [currentHex]);
  const openPanel = (next: boolean) => {
    if (next) {
      setHexInput(currentHex);
      setHexError(false);
    }
    setOpen(next);
  };

  const commit = (next: string) => {
    if (inForm && form && name) {
      form.setValue(name, next);
    } else {
      setInnerValue(next);
    }
    onChange?.(next);
  };

  const applyHsva = (next: Hsva) => {
    const nextHex = hsvaToHex(next);
    if (nextHex === hsvaToHex(hsva)) return;
    setHsva(next);
    commit(nextHex);
  };

  const commitHexInput = () => {
    const normalized = normalizeHex(hexInput);
    if (normalized === undefined) {
      setHexError(true);
      return;
    }
    setHexError(false);
    setHexInput(normalized);
    commit(normalized);
  };

  const commitChannel = (channel: 'r' | 'g' | 'b' | 'a', raw: string) => {
    const num = Number(raw);
    if (raw.trim() === '' || Number.isNaN(num)) return;
    if (channel === 'a') {
      applyHsva({ ...hsva, a: clamp01(round2(num)) });
      return;
    }
    const [r, g, b] = hsvToRgb(hsva.h, hsva.s, hsva.v);
    const clamp255 = (n: number) => Math.min(255, Math.max(0, Math.round(n)));
    const next: [number, number, number] = [
      channel === 'r' ? clamp255(num) : r,
      channel === 'g' ? clamp255(num) : g,
      channel === 'b' ? clamp255(num) : b,
    ];
    const [h, s, v] = rgbToHsv(next[0], next[1], next[2]);
    applyHsva({ h, s, v, a: hsva.a });
  };

  const saturation = useDrag((clientX, clientY, rect) => {
    const s = clamp01((clientX - rect.left) / rect.width);
    const v = clamp01(1 - (clientY - rect.top) / rect.height);
    applyHsva({ ...hsva, s, v });
  }, draggingRef);
  const hue = useDrag((clientX, _clientY, rect) => {
    const h = Math.round(clamp01((clientX - rect.left) / rect.width) * 360);
    applyHsva({ ...hsva, h });
  }, draggingRef);
  const alpha = useDrag((clientX, _clientY, rect) => {
    const a = round2(clamp01((clientX - rect.left) / rect.width));
    applyHsva({ ...hsva, a });
  }, draggingRef);

  const displayHex = hsvaToHex(hsva);
  const hueHex = hsvaToHex({ h: hsva.h, s: 1, v: 1, a: 1 });
  const opaqueHex = hsvaToHex({ ...hsva, a: 1 });
  const [channelR, channelG, channelB] = hsvToRgb(hsva.h, hsva.s, hsva.v);
  const channels: Array<{ key: 'r' | 'g' | 'b' | 'a'; label: string; text: string }> = [
    { key: 'r', label: 'R', text: String(channelR) },
    { key: 'g', label: 'G', text: String(channelG) },
    { key: 'b', label: 'B', text: String(channelB) },
    { key: 'a', label: 'A', text: String(hsva.a) },
  ];

  const control = (
    <Popover open={open} onOpenChange={openPanel}>
      <PopoverTrigger
        id={controlId}
        type="button"
        disabled={disabled}
        data-slot="colorpicker-trigger"
        className={cn(
          'flex h-9 w-full min-w-0 cursor-pointer items-center gap-2 rounded-md border border-input bg-(--input-background) px-3 py-1 text-sm text-(--input-foreground) shadow-xs transition-colors outline-none hover:bg-accent focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50',
          currentHex === '' && 'text-muted-foreground',
          !inForm && className,
        )}
        style={inForm ? undefined : style}
      >
        <span
          data-slot="colorpicker-swatch"
          className="size-4 shrink-0 rounded-sm border border-border"
          style={{
            backgroundImage: `linear-gradient(${currentHex}, ${currentHex}), ${CHECKERBOARD}`,
            backgroundSize: '100% 100%, 6px 6px',
          }}
        />
        <span className="min-w-0 flex-1 truncate text-left">
          {currentHex === '' ? (placeholder ?? t('pactor.colorPicker.placeholder')) : currentHex}
        </span>
      </PopoverTrigger>
      <PopoverContent className="w-64">
        <div data-slot="colorpicker-panel" className="flex flex-col gap-3">
          <div
            ref={saturation.ref}
            data-slot="colorpicker-saturation"
            className="relative h-36 w-full cursor-crosshair touch-none overflow-hidden rounded-md"
            style={{
              background: `linear-gradient(to top, black, transparent), linear-gradient(to right, white, transparent), ${hueHex}`,
            }}
            onPointerDown={saturation.onPointerDown}
          >
            <div
              data-slot="colorpicker-saturation-handle"
              className="pointer-events-none absolute size-3 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                left: `${hsva.s * 100}%`,
                top: `${(1 - hsva.v) * 100}%`,
                ...HANDLE_STYLE,
              }}
            />
          </div>
          <div className="flex items-center gap-2">
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <div
                ref={hue.ref}
                data-slot="colorpicker-hue"
                className="relative h-3 cursor-pointer touch-none rounded-full"
                style={{ background: HUE_GRADIENT }}
                onPointerDown={hue.onPointerDown}
              >
                <div
                  data-slot="colorpicker-hue-handle"
                  className="pointer-events-none absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{
                    left: `${(hsva.h / 360) * 100}%`,
                    background: hueHex,
                    ...HANDLE_STYLE,
                  }}
                />
              </div>
              <div
                ref={alpha.ref}
                data-slot="colorpicker-alpha"
                className="relative h-3 cursor-pointer touch-none rounded-full"
                style={{
                  backgroundImage: `linear-gradient(to right, transparent, ${opaqueHex}), ${CHECKERBOARD}`,
                  backgroundSize: '100% 100%, 8px 8px',
                }}
                onPointerDown={alpha.onPointerDown}
              >
                <div
                  data-slot="colorpicker-alpha-handle"
                  className="pointer-events-none absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full"
                  style={{
                    left: `${hsva.a * 100}%`,
                    background: displayHex,
                    ...HANDLE_STYLE,
                  }}
                />
              </div>
            </div>
            <div
              data-slot="colorpicker-preview"
              aria-label={displayHex}
              className="size-8 shrink-0 rounded-md border border-border"
              style={{
                backgroundImage: `linear-gradient(${displayHex}, ${displayHex}), ${CHECKERBOARD}`,
                backgroundSize: '100% 100%, 6px 6px',
              }}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <ShadcnInput
              aria-label={t('pactor.colorPicker.hexLabel')}
              value={hexInput}
              placeholder="#RRGGBB"
              className="h-8 w-full px-2 text-xs"
              onChange={(event) => setHexInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  commitHexInput();
                }
              }}
            />
            <div className="flex items-start gap-1">
              {channels.map((channel) => (
                <div key={channel.key} className="flex min-w-0 flex-1 flex-col items-center gap-0.5">
                  <ShadcnInput
                    aria-label={t('pactor.colorPicker.channel', { label: channel.label })}
                    key={`${channel.key}-${displayHex}`}
                    defaultValue={channel.text}
                    className="h-8 w-full px-1 text-center text-xs"
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        event.preventDefault();
                        commitChannel(channel.key, event.currentTarget.value);
                      }
                    }}
                    onBlur={(event) => commitChannel(channel.key, event.currentTarget.value)}
                  />
                  <span className="text-[10px] text-muted-foreground">{channel.label}</span>
                </div>
              ))}
            </div>
          </div>
          {hexError ? (
            <div data-slot="colorpicker-error" className="text-sm text-destructive">
              {t('pactor.colorPicker.invalidFormat')}
            </div>
          ) : null}
          {presets && presets.length > 0 ? (
            <div data-slot="colorpicker-presets" className="flex flex-wrap gap-2">
              {presets.map((hex) => (
                <button
                  key={hex}
                  type="button"
                  aria-label={hex}
                  className={cn(
                    'size-6 cursor-pointer rounded-md border border-border shadow-xs',
                    normalizeHex(hex) === normalizeHex(currentHex) &&
                      'ring-2 ring-ring ring-offset-1',
                  )}
                  style={{ backgroundColor: hex }}
                  onClick={() => commit(hex)}
                />
              ))}
            </div>
          ) : null}
        </div>
      </PopoverContent>
    </Popover>
  );

  if (inForm && form && name) {
    return (
      <FieldShell
        layout={form.layout}
        label={label}
        rules={rules}
        htmlFor={controlId}
        error={form.errors[name]}
        className={className}
        style={style}
      >
        {control}
      </FieldShell>
    );
  }

  return control;
}
