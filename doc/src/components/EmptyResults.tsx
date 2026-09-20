/**
 * 零结果态（React）：集合页 FilterBar 内部使用，
 * 与 ExceptionState.astro 共用 EXCEPTION_STATES 映射（kind = no-results）。
 */
import { EXCEPTION_STATES } from '../lib/exception-state';

export default function EmptyResults({
  onClear,
  hint,
}: {
  /** 「清除筛选」回调（清空搜索 / 筛选 / 排序并同步 URL） */
  onClear?: () => void;
  /** 覆盖默认提示文案 */
  hint?: string;
}) {
  const def = EXCEPTION_STATES['no-results'];
  return (
    <div className="exception" role="status">
      <div className="exception-icon" aria-hidden="true">
        {def.icon}
      </div>
      <div className="exception-title">{def.title}</div>
      <div className="exception-hint">{hint ?? def.hint}</div>
      {onClear && (
        <div className="exception-actions">
          <button type="button" className="btn small" onClick={onClear}>
            清除筛选
          </button>
        </div>
      )}
    </div>
  );
}
