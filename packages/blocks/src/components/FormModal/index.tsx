import { useI18n } from '@pactor-app/runtime';
import { useState, type CSSProperties, type ReactNode } from 'react';

import { Button } from '@pactor-app/ui/ui';
import {
  Dialog as ShadcnDialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@pactor-app/ui/ui';
import { Form } from '@pactor-app/ui/components';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface FormModalProps {
  /** 弹层标题 */
  title?: string;
  /** 标题下辅助说明 */
  description?: string;
  /** 受控开关（可绑 `${state.x}` 表达式）；缺省走 defaultOpen 内部自管理 */
  open?: boolean;
  /** 非受控模式的初始开关（open 缺省时生效），默认 false */
  defaultOpen?: boolean;
  /** 表单名（缺省 'default'）：`form.setValues` / `form.submit` 联动动作按名寻址 */
  formName?: string;
  /** 表单布局，默认 vertical */
  layout?: 'horizontal' | 'vertical' | 'inline';
  /** 表单初始值（创建时生效；字段级 value 优先于 initialValues[name]） */
  initialValues?: Record<string, unknown>;
  /** 取消按钮文字（缺省 i18n pactor.formModal.cancel） */
  cancelText?: string;
  /** 提交按钮文字（缺省 i18n pactor.formModal.submit） */
  submitText?: string;
  /** 表单元素（DSL children；Input / Select 等声明 name 即自动成为表单项） */
  children?: ReactNode;
  /** 提交事件（校验通过后触发），参数为表单 values（${event}） */
  onSubmit?: (values: Record<string, unknown>) => void;
  /** 取消按钮点击事件（缺省时回退触发 onClose） */
  onCancel?: () => void;
  /** 关闭事件（X / 遮罩 / Escape 任一途径关闭时触发） */
  onClose?: () => void;
  /** 通用：弹层内容根节点 class（与内置样式合并） */
  className?: string;
  /** 通用：弹层内容根节点内联样式 */
  style?: CSSProperties;
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * FormModal 表单弹层（区块组件）：Dialog 内嵌 Form——标题（title/description）
 * + DSL children 表单元素（声明 name 自动成为表单项，支持 rules 校验）
 * + 底部取消 / 提交按钮（文字可自定义）。
 * open 受控（绑 ${state.x}，事件里 setState 关闭）；缺省经 defaultOpen
 * 内部自管理，此时取消 / 校验通过的提交会自动关闭。
 * 提交按钮走 Form type=submit 统一校验，通过后 onSubmit 传出 values（${event}）。
 * 内部复用 ui Form（依赖 Renderer 上下文），与 Login 同约定。
 */
export function FormModal({
  title,
  description,
  open,
  defaultOpen = false,
  formName,
  layout,
  initialValues,
  cancelText,
  submitText,
  children,
  onSubmit,
  onCancel,
  onClose,
  className,
  style,
}: FormModalProps) {
  const { t } = useI18n();
  const [innerOpen, setInnerOpen] = useState(defaultOpen);
  const controlled = open !== undefined;
  const visible = controlled ? open : innerOpen;

  const close = () => {
    if (!controlled) setInnerOpen(false);
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    else onClose?.();
    close();
  };

  const handleSubmit = (values: Record<string, unknown>) => {
    onSubmit?.(values);
    close();
  };

  return (
    <ShadcnDialog
      open={visible}
      onOpenChange={(next) => {
        if (!next) {
          onClose?.();
          close();
        }
      }}
    >
      <DialogContent className={className} style={style}>
        {title || description ? (
          <DialogHeader>
            {title ? <DialogTitle>{title}</DialogTitle> : null}
            {description ? <DialogDescription>{description}</DialogDescription> : null}
          </DialogHeader>
        ) : null}
        <Form
          name={formName}
          layout={layout}
          initialValues={initialValues}
          className="flex flex-col gap-4"
          onSubmit={handleSubmit}
        >
          {children}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>
              {cancelText ?? t('pactor.formModal.cancel')}
            </Button>
            <Button type="submit">{submitText ?? t('pactor.formModal.submit')}</Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </ShadcnDialog>
  );
}
