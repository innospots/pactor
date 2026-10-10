/**
 * 零结果态（React，pactor Empty / Button 渲染）：集合页 FilterBar 内部使用，
 * 与 ExceptionState 共用 EXCEPTION_STATES 映射（kind = no-results）。
 */
import { Button, Empty } from '@pactor-app/ui/components';
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
    <Empty title={def.title} description={hint ?? def.hint}>
      {onClear && <Button text="清除筛选" size="small" onClick={onClear} />}
    </Empty>
  );
}
