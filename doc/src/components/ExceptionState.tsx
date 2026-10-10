/**
 * 通用异常状态（React 岛，pactor Empty / Result / Spinner 渲染）：
 * loading / empty / no-results / missing / broken-ref / copy-fail / link-broken。
 * 与 EmptyResults 共用 EXCEPTION_STATES 映射，保证视觉口径一致；
 * pactor 组件自带图标，原 EXCEPTION_STATES 的 unicode 图标不再使用。
 */
import { Empty, Result, Spinner, type ResultStatus } from '@pactor-app/ui/components';
import { EXCEPTION_STATES, type ExceptionKind } from '../lib/exception-state';

/** kind → pactor 状态组件形态 */
const EMPTY_KINDS: ExceptionKind[] = ['empty', 'no-results', 'missing'];
const RESULT_STATUS: Partial<Record<ExceptionKind, ResultStatus>> = {
  'broken-ref': 'error',
  'copy-fail': 'error',
  'link-broken': 'warning',
};

export default function ExceptionState({
  kind,
  title,
  hint,
}: {
  kind: ExceptionKind;
  title?: string;
  hint?: string;
}) {
  const def = EXCEPTION_STATES[kind];

  if (kind === 'loading') {
    return (
      <div className="exception" role="status" data-exception-kind={kind}>
        <div className="exception-icon" aria-hidden="true">
          <Spinner />
        </div>
        <div className="exception-title">{title ?? def.title}</div>
        <div className="exception-hint">{hint ?? def.hint}</div>
      </div>
    );
  }

  if (EMPTY_KINDS.includes(kind)) {
    return (
      <Empty title={title ?? def.title} description={hint ?? def.hint} />
    );
  }

  return (
    <Result
      status={RESULT_STATUS[kind] ?? 'info'}
      title={title ?? def.title}
      subTitle={hint ?? def.hint}
    />
  );
}
