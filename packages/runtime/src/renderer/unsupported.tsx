/**
 * 未注册组件的占位渲染（决策 D5）：展示类型名，dev 友好，
 * 不抛错也不渲染空白。
 */
export function UnsupportedComponent({ type }: { type: string }) {
  return (
    <div
      data-pactor-unsupported={type}
      style={{
        border: '1px dashed #d97706',
        borderRadius: 4,
        padding: 8,
        color: '#b45309',
        fontSize: 12,
      }}
    >
      Unsupported component: {type}
    </div>
  );
}
