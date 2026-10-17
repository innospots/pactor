import { useI18n } from '@pactor-app/runtime';
import { Upload as UploadIcon, X } from 'lucide-react';
import { useEffect, useId, useRef, useState, type CSSProperties } from 'react';

import { cn } from '../../../lib/utils.js';
import { useFormContext } from '../Form/context.js';
import { FieldShell } from '../Form/form-item.js';
import type { FieldRule } from '../Input/index.js';

/** 文件元数据（可序列化，DSL 语义值；不携带 File 对象本体） */
export interface UploadFileMeta {
  name: string;
  size: number;
  type: string;
}

export interface UploadProps {
  /** 字段名；在 Form 内声明 name 即自动成为表单项 */
  name?: string;
  /** 表单项标签 */
  label?: string;
  /** 校验规则 */
  rules?: FieldRule[];
  /** 受控值（文件元数据数组）；Form 内作为字段初始值 */
  value?: UploadFileMeta[];
  /** 允许多选 */
  multiple?: boolean;
  /** 接受的文件类型（同原生 input accept：扩展名 / MIME / image\/* 等，逗号分隔） */
  accept?: string;
  /** 单文件大小上限（字节），超出不进列表 */
  maxSize?: number;
  /** 文件总数上限，超出不进列表 */
  maxCount?: number;
  /** 拖拽区形态（点击或拖入文件选择） */
  drag?: boolean;
  /** 选择区下方的辅助说明文案 */
  tip?: string;
  disabled?: boolean;
  /** 文件列表变化事件，传出可序列化元数据数组 Array<{ name, size, type }> */
  onChange?: (value: UploadFileMeta[]) => void;
  /** 通用：根节点 class（Form 内为 form-item 容器，独立渲染时为控件根节点） */
  className?: string;
  /** 通用：根节点内联样式（同 className 的挂载规则） */
  style?: CSSProperties;
}

/** accept 单条规则匹配：'.png' 按扩展名、'image/*' 按 MIME 前缀、其余按完整 MIME */
function matchAccept(file: File, accept: string): boolean {
  const tokens = accept
    .split(',')
    .map((token) => token.trim().toLowerCase())
    .filter((token) => token !== '');
  if (tokens.length === 0) return true;
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();
  return tokens.some((token) => {
    if (token.startsWith('.')) return name.endsWith(token);
    if (token.endsWith('/*')) return type.startsWith(token.slice(0, -1));
    return type === token;
  });
}

function formatSize(size: number): string {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Upload 适配器（shadcn kit）：纯 UI 组件，不发起任何网络请求。
 * hidden file input + 文件列表（名称/大小/移除）；选择时按
 * accept / maxSize / maxCount 校验，不合规文件不进列表。
 * 字段值与 onChange 均为可序列化元数据数组 `Array<{ name, size, type }>`；
 * Form 内声明 `name` 自动成为表单项。
 */
export function Upload({
  name,
  label,
  rules,
  value,
  multiple,
  accept,
  maxSize,
  maxCount,
  drag,
  tip,
  disabled,
  onChange,
  className,
  style,
}: UploadProps) {
  const form = useFormContext();
  const controlId = useId();
  const inForm = form?.inForm === true && typeof name === 'string' && name !== '';
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inForm && form && name) {
      form.registerField(name, rules, value);
      return () => form.unregisterField(name);
    }
    return undefined;
  });

  // 独立渲染：内部列表态（外部 value 变化时同步镜像）
  const [innerValue, setInnerValue] = useState<UploadFileMeta[]>(value ?? []);
  useEffect(() => {
    if (!inForm) setInnerValue(value ?? []);
  }, [inForm, value]);

  const current = inForm && form && name ? form.values[name] : innerValue;
  const files: UploadFileMeta[] = Array.isArray(current)
    ? (current as UploadFileMeta[])
    : [];

  // 校验被拒文件数（提示用，下一次选择时重置）
  const [rejected, setRejected] = useState(0);
  const { t } = useI18n();

  const commit = (next: UploadFileMeta[]) => {
    if (inForm && form && name) {
      form.setValue(name, next);
    } else {
      setInnerValue(next);
    }
    onChange?.(next);
  };

  const handleFiles = (fileList: Iterable<File>) => {
    if (disabled) return;
    const accepted: UploadFileMeta[] = [];
    let rejectedCount = 0;
    for (const file of fileList) {
      if (accept !== undefined && accept !== '' && !matchAccept(file, accept)) {
        rejectedCount += 1;
        continue;
      }
      if (maxSize !== undefined && file.size > maxSize) {
        rejectedCount += 1;
        continue;
      }
      if (maxCount !== undefined && files.length + accepted.length >= maxCount) {
        rejectedCount += 1;
        continue;
      }
      accepted.push({ name: file.name, size: file.size, type: file.type });
      if (multiple !== true) break;
    }
    setRejected(rejectedCount);
    if (accepted.length > 0) {
      commit(multiple === true ? [...files, ...accepted] : accepted);
    }
  };

  const handleRemove = (index: number) => {
    commit(files.filter((_, i) => i !== index));
  };

  const fileInput = (
    <input
      ref={inputRef}
      id={controlId}
      data-slot="upload-input"
      type="file"
      className="hidden"
      multiple={multiple}
      accept={accept}
      disabled={disabled}
      onChange={(event) => {
        handleFiles(Array.from(event.target.files ?? []));
        event.target.value = '';
      }}
    />
  );

  const picker = drag ? (
    <div
      data-slot="upload-dragger"
      role="button"
      tabIndex={disabled ? undefined : 0}
      aria-disabled={disabled || undefined}
      className={cn(
        'flex cursor-pointer flex-col items-center justify-center gap-1 rounded-md border border-dashed border-input px-4 py-6 text-sm text-muted-foreground transition-colors hover:bg-accent',
        disabled && 'cursor-not-allowed opacity-50 hover:bg-transparent',
      )}
      onClick={() => {
        if (!disabled) inputRef.current?.click();
      }}
      onKeyDown={(event) => {
        if (!disabled && (event.key === 'Enter' || event.key === ' ')) {
          event.preventDefault();
          inputRef.current?.click();
        }
      }}
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        handleFiles(Array.from(event.dataTransfer.files));
      }}
    >
      <UploadIcon className="size-6" />
      <span>{t('pactor.upload.dragText')}</span>
    </div>
  ) : (
    <button
      type="button"
      data-slot="upload-button"
      disabled={disabled}
      className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-md border border-input bg-(--input-background) px-3 text-sm text-(--input-foreground) shadow-xs hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
      onClick={() => inputRef.current?.click()}
    >
      <UploadIcon className="size-4" />
      {t('pactor.upload.selectFile')}
    </button>
  );

  const control = (
    <div
      data-slot="upload"
      className={cn('flex flex-col gap-2', !inForm && className)}
      style={inForm ? undefined : style}
    >
      {picker}
      {fileInput}
      {tip ? (
        <div data-slot="upload-tip" className="text-xs text-muted-foreground">
          {tip}
        </div>
      ) : null}
      {rejected > 0 ? (
        <div data-slot="upload-rejected" className="text-xs text-destructive">
          {t('pactor.upload.rejected', { count: rejected })}
        </div>
      ) : null}
      {files.length > 0 ? (
        <ul data-slot="upload-list" className="flex flex-col gap-1">
          {files.map((file, index) => (
            <li
              key={`${file.name}-${index}`}
              className="flex items-center gap-2 rounded-md border border-border px-3 py-1.5 text-sm"
            >
              <span className="min-w-0 flex-1 truncate">{file.name}</span>
              <span className="shrink-0 text-xs text-muted-foreground">
                {formatSize(file.size)}
              </span>
              <button
                type="button"
                aria-label={t('pactor.upload.remove', { name: file.name })}
                disabled={disabled}
                className="shrink-0 cursor-pointer text-muted-foreground hover:text-foreground disabled:cursor-not-allowed"
                onClick={() => handleRemove(index)}
              >
                <X className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );

  if (inForm && form && name) {
    return (
      <FieldShell
        layout={form.layout}
        label={label}
        rules={rules}
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
