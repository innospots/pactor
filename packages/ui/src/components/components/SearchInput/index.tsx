import { useI18n } from '@pactor-app/runtime';
import { SearchIcon } from 'lucide-react';
import { useEffect, useId, type CSSProperties } from 'react';

import { cn } from '../../../lib/utils.js';
import { Button as ShadcnButton } from '../../../ui/button.js';
import { InputGroup } from '../../../ui/input-group.js';
import { Input as ShadcnInput } from '../../../ui/input.js';
import { ClearHoverButton } from '../../clearable.js';
import { CONTROL_SIZE_BOX, type ControlSize } from '../../control-size.js';
import { useFormContext } from '../Form/context.js';
import { FieldShell } from '../Form/form-item.js';
import type { FieldRule } from '../Input/index.js';

/** 搜索按钮布局：cva 档位让按钮高度恒为对应控件档减 4px（上下各留 2px），
 *  仅图标时收窄水平内边距；带文案时字号跟随控件令牌 */
const SEARCH_BUTTON_LAYOUT: Record<
  ControlSize,
  {
    variantSize: 'xs' | 'sm' | 'default';
    iconClassName: string;
    textClassName: string;
  }
> = {
  small: {
    variantSize: 'xs',
    iconClassName: 'px-2',
    textClassName:
      'px-2.5 text-[length:var(--pactor-control-text-sm)] leading-4',
  },
  middle: {
    variantSize: 'sm',
    iconClassName: 'px-2.5',
    textClassName:
      'px-3 text-[length:var(--pactor-control-text-md)] leading-5',
  },
  large: {
    variantSize: 'default',
    iconClassName: 'px-3',
    textClassName:
      'px-4 text-[length:var(--pactor-control-text-lg)] leading-6',
  },
};

/** 组合框高度：显式取控件档高度（border-box 含 1px 边框），
 *  输入框 h-full 撑满内容区，使组合框与同行 Select 等高 */
const SEARCH_GROUP_HEIGHT: Record<ControlSize, string> = {
  small: 'h-(--pactor-control-height-sm)',
  middle: 'h-(--pactor-control-height-md)',
  large: 'h-(--pactor-control-height-lg)',
};

export interface SearchInputProps {
  /** 字段名；在 Form 内声明 name 即自动成为表单项 */
  name?: string;
  /** 表单项标签 */
  label?: string;
  /** 校验规则 */
  rules?: FieldRule[];
  /** 受控值（独立渲染时生效）；Form 内作为字段初始值（优先于 Form initialValues） */
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  /** 最大输入长度（原生 maxLength，达到上限后无法继续输入） */
  maxLength?: number;
  /** 搜索按钮文案：声明后按钮显示图标 + 文案；缺省为仅图标按钮
   *  （无障碍名称取内置「搜索」文案，不显示 tooltip） */
  buttonText?: string;
  /** 搜索提交：输入框聚焦时按回车触发，传出当前输入值（IME 组字回车不触发）；
   *  点击搜索按钮时也会先回调 */
  onSearch?: (value: string) => void;
  /** 控件尺寸（默认 middle，即现行 h-9 尺寸） */
  size?: ControlSize;
  /** hover 清除（缺省开启，传 false 关闭）：值非空时鼠标悬停输入区，右缘浮出
   *  × 按钮，点击清空当前值 */
  allowClear?: boolean;
  /** 输入事件，传出 string 值 */
  onChange?: (value: string) => void;
  /** 通用：根节点 class（Form 内为 form-item 容器；独立渲染时挂组合框根节点） */
  className?: string;
  /** 控件本体 class（无论是否在 Form 内都挂 input 节点） */
  controlClassName?: string;
  /** 通用：根节点内联样式（挂载规则同 className） */
  style?: CSSProperties;
  /** 控件 id；缺省自动生成。独立渲染时供外部 label 的 htmlFor 关联 */
  id?: string;
  /** 无障碍名称（透传原生 aria-label） */
  ariaLabel?: string;
  /** 原生 spellcheck 开关 */
  spellCheck?: boolean;
}

/**
 * SearchInput 适配器：内置「左输入框 + 右搜索按钮」组合框，免去页面
 * 手工组合 `InputGroup` + `Input` + `Button`。输入框保留 hover 清除；
 * 搜索按钮与输入框共用组合框描边、焦点环与尺寸令牌。
 *
 * 在 Form 内且声明 `name` 时自动成为表单项（label / rules 生效，
 * 值由 Form 上下文托管）；按钮为 `type="submit"`，点击走 Form 既有
 * 校验与 `onSubmit` 链路。独立渲染时按钮点击调用 `onSearch(value)`。
 * 两种情况下点击按钮都会先回调 `onSearch`；输入框回车经原语 onSearch
 * 传出值（Form 内同时触发表单隐式提交）。
 */
export function SearchInput({
  name,
  label,
  rules,
  value,
  placeholder,
  disabled,
  maxLength,
  buttonText,
  onSearch,
  size = 'middle',
  allowClear,
  onChange,
  className,
  controlClassName,
  style,
  id,
  ariaLabel,
  spellCheck,
}: SearchInputProps) {
  const form = useFormContext();
  const { t } = useI18n();
  const generatedId = useId();
  const controlId = id ?? generatedId;
  const inForm = form?.inForm === true && typeof name === 'string' && name !== '';
  const inFormRoot = inForm === true;

  // 注册/注销字段校验规则（rules 每次渲染刷新，卸载时注销）；
  // 同时把 value prop 作为字段级初始值交给 Form 上下文合并（仅首次注册生效）
  useEffect(() => {
    if (inForm && form && name) {
      form.registerField(name, rules, value);
      return () => form.unregisterField(name);
    }
    return undefined;
  });

  const fieldValue = inForm && form && name ? form.values[name] : undefined;
  const currentValue =
    typeof fieldValue === 'string' ? fieldValue : inForm ? '' : (value ?? '');
  const showClear = allowClear !== false && disabled !== true && currentValue !== '';

  const handleClear = () => {
    if (inForm && form && name) {
      form.setValue(name, '');
    }
    onChange?.('');
  };

  const buttonTextValue = buttonText?.trim() ? buttonText : undefined;
  const buttonLabel = buttonTextValue ?? t('pactor.searchInput.search');
  const layout = SEARCH_BUTTON_LAYOUT[size];

  const control = (
    <InputGroup
      className={cn(SEARCH_GROUP_HEIGHT[size], !inFormRoot && className)}
      style={inFormRoot ? undefined : style}
    >
      <span className="group relative flex h-full min-w-0 flex-1 items-center">
        <ShadcnInput
          id={controlId}
          type="text"
          value={currentValue}
          placeholder={placeholder ?? t('pactor.input.placeholder')}
          disabled={disabled}
          maxLength={maxLength}
          spellCheck={spellCheck}
          aria-label={ariaLabel}
          onSearch={onSearch}
          className={cn(
            CONTROL_SIZE_BOX[size],
            // 组合框内输入框撑满容器内容区（容器已显式定高）
            'h-full',
            // 右缘浮动清除按钮覆盖在控件内侧，文本预留右内边距；
            // 加 !important：聚合样式多段拼接，后段重复的 px-3 会盖掉 pr-*
            allowClear !== false && 'pr-8!',
            controlClassName,
          )}
          onChange={(event) => {
            if (inForm && form && name) {
              form.setValue(name, event.target.value);
            }
            onChange?.(event.target.value);
          }}
        />
        {showClear ? (
          <ClearHoverButton
            label={t('pactor.input.clear')}
            className="absolute top-1/2 right-2 -translate-y-1/2"
            onClear={handleClear}
          />
        ) : null}
      </span>
      <ShadcnButton
        type={form ? 'submit' : 'button'}
        variant="ghost"
        size={layout.variantSize}
        disabled={disabled}
        aria-label={buttonLabel}
        className={cn(
          // 按钮是组合框最后一个子节点：贴边直角 + 右侧跟随容器圆角。
          // 加 !important：消费方（如 portal-web components.css）对
          // [data-slot="button"] 的统一圆角是无层级规则，会压过工具类
          'shrink-0 rounded-none! rounded-r-md! text-muted-foreground hover:text-foreground',
          buttonTextValue ? layout.textClassName : layout.iconClassName,
        )}
        onClick={() => onSearch?.(currentValue)}
      >
        <SearchIcon aria-hidden="true" className="size-4" />
        {buttonTextValue}
      </ShadcnButton>
    </InputGroup>
  );

  if (inForm && form && name) {
    return (
      <FieldShell
        layout={form.layout}
        label={label}
        htmlFor={controlId}
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
