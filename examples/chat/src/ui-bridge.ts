import { createUiBridge } from '@pactor/ui/interaction';

/**
 * 示例级 UiBridge（examples/chat）：宿主根部挂载
 * `ShadcnInteractionProvider` 后注入 modal / message 实现，
 * toast / confirm 等反馈统一走 @pactor/ui 交互层（无 antd 依赖）。
 */
export const uiBridge = createUiBridge();

/** toast 反馈（Provider 未挂载时受控 no-op） */
export function showMessage(
  type: 'success' | 'error' | 'info' | 'warning',
  text: string,
): void {
  uiBridge.message?.[type](text);
}

/** 确认对话框：经 UiBridge 注入的 modal.confirm，确认 true / 取消 false */
export function showConfirm(content: string, title = '确认执行'): Promise<boolean> {
  const modal = uiBridge.modal;
  if (!modal) {
    // Provider 未挂载的兜底（不应发生）：受控取消
    return Promise.resolve(false);
  }
  return new Promise<boolean>((resolve) => {
    modal.confirm({
      title,
      content,
      onOk: () => resolve(true),
      onCancel: () => resolve(false),
    });
  });
}
