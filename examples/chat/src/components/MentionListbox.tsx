import { MOCK_AGENTS } from '../mock-data';
import { AnchoredPopup } from './AnchoredPopup';

/**
 * `@` 提及列表（对应参考页 @space 弹层）：锚定在输入框上方，
 * 按 query 实时过滤 mock 代理，点击选中（转为上下文 chip）。
 */
export function MentionListbox({
  query,
  rect,
  onClose,
  onSelect,
}: {
  query: string;
  rect: DOMRect;
  onClose: () => void;
  onSelect: (name: string) => void;
}) {
  const filtered = MOCK_AGENTS.filter(
    (agent) => !query || agent.name.includes(query) || agent.id.includes(query.toLowerCase()),
  );

  return (
    <AnchoredPopup rect={rect} onClose={onClose} className="demo-popup--mention" role="listbox">
      {filtered.length === 0 ? (
        <div className="demo-popup__empty">没有匹配的代理</div>
      ) : (
        filtered.map((agent) => (
          <button
            key={agent.id}
            type="button"
            role="option"
            aria-selected="false"
            className="demo-popup__item demo-popup__item--row"
            onClick={() => {
              onSelect(agent.name);
              onClose();
            }}
          >
            <span className="demo-popup__item-label">@{agent.name}</span>
            <span className="demo-popup__item-desc">{agent.description}</span>
          </button>
        ))
      )}
    </AnchoredPopup>
  );
}
