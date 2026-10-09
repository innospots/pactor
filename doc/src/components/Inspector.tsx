/**
 * 右侧双态看板（React 岛，design D6）。
 * 默认态：页面目录（headings 锚点）+ 页面/分类元信息；
 * 检查态：事件委托监听 document click，点击中间内容区任意
 * data-inspect 元素即原位切换为该对象的属性看板，关闭恢复默认态。
 */
import { Fragment, useEffect, useRef, useState } from 'react';

export interface InspectorHeading {
  id: string;
  text: string;
}

export interface InspectorMetaItem {
  label: string;
  value: string;
}

interface InspectState {
  id: string;
  name: string;
  type: string;
  maturity: string;
  change: string;
  integration: string;
  props: [string, string][];
  description: string;
}

const MATURITY_BADGE: Record<string, { text: string; kind: string }> = {
  stable: { text: '稳定', kind: 'success' },
  experimental: { text: '实验', kind: 'info' },
  deprecated: { text: '废弃', kind: 'danger' },
};

const INTEGRATION_BADGE: Record<string, { text: string; kind: string }> = {
  integrated: { text: '已接入', kind: 'success' },
  pending: { text: '待资产接入', kind: 'warning' },
};

const CHANGE_BADGE: Record<string, { text: string; kind: string }> = {
  new: { text: '本期新增', kind: 'info' },
  updated: { text: '本期更新', kind: 'info' },
};

function Badge({ text, kind }: { text: string; kind: string }) {
  return <span className={`badge ${kind}`}>{text}</span>;
}

function readInspectState(el: Element): InspectState {
  let props: [string, string][] = [];
  const rawProps = el.getAttribute('data-inspect-props');
  if (rawProps) {
    try {
      const parsed: unknown = JSON.parse(rawProps);
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        props = Object.entries(parsed as Record<string, unknown>).map(
          ([k, v]) => [k, String(v)],
        );
      }
    } catch {
      // 属性不是合法 JSON 时忽略，看板仍展示基础信息
    }
  }
  return {
    id: el.getAttribute('data-inspect') ?? '',
    name: el.getAttribute('data-inspect-name') ?? '未命名对象',
    type: el.getAttribute('data-inspect-type') ?? '对象检查',
    maturity: el.getAttribute('data-inspect-maturity') ?? 'stable',
    change: el.getAttribute('data-inspect-change') ?? '',
    integration: el.getAttribute('data-inspect-integration') ?? 'pending',
    props,
    description:
      el.getAttribute('data-inspect-desc') ??
      '该对象暂无更多说明，完整规范随资产数据接入后补充。',
  };
}

export default function Inspector({
  headings,
  meta,
  usage,
}: {
  headings: InspectorHeading[];
  meta: InspectorMetaItem[];
  /** 默认态「使用说明」文案（缺省为对象检查模式说明） */
  usage?: string;
}) {
  const [current, setCurrent] = useState<InspectState | null>(null);
  const selectedRef = useRef<Element | null>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = e.target;
      if (!(target instanceof Element)) return;
      const el = target.closest('[data-inspect]');
      if (!el) return;
      // 点击行为不跳转：非链接元素一律阻止默认行为；链接元素保留导航
      if (!target.closest('a[href]')) e.preventDefault();

      selectedRef.current?.classList.remove('inspect-selected');
      el.classList.add('inspect-selected');
      selectedRef.current = el;
      setCurrent(readInspectState(el));

      // 小屏下点击对象时直接展开右抽屉
      document.getElementById('inspector')?.classList.add('open');
      document.getElementById('drawerOverlay')?.classList.add('show');
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  const clear = () => {
    setCurrent(null);
    selectedRef.current?.classList.remove('inspect-selected');
    selectedRef.current = null;
  };

  const closeDrawer = () => {
    document.dispatchEvent(new CustomEvent('assetlib:close-drawer'));
  };

  const copyId = async () => {
    if (!current) return;
    try {
      await navigator.clipboard.writeText(current.id);
    } catch {
      // 剪贴板不可用时静默失败，用户可手动选择复制
    }
  };

  const scrollToHeading = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  if (current) {
    const maturity = MATURITY_BADGE[current.maturity];
    const integration = INTEGRATION_BADGE[current.integration];
    const change = current.change ? CHANGE_BADGE[current.change] : undefined;
    return (
      <div className="inspector-inner">
        <div className="ins-head">
          <div>
            <div className="ins-title">{current.name}</div>
            <div className="ins-subtitle">{current.type}</div>
          </div>
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              className="icon-btn mobile-btn"
              onClick={closeDrawer}
              aria-label="收起看板"
            >
              ×
            </button>
            <button className="icon-btn" onClick={clear} aria-label="关闭检查">
              ×
            </button>
          </div>
        </div>
        <div className="ins-section">
          <h4>状态</h4>
          <div className="badges" style={{ marginTop: 0 }}>
            {maturity && <Badge {...maturity} />}
            {change && <Badge {...change} />}
            {integration && <Badge {...integration} />}
          </div>
        </div>
        <div className="ins-section">
          <h4>当前属性</h4>
          <dl className="kv">
            <dt>ID</dt>
            <dd>{current.id}</dd>
            {current.props.length > 0 ? (
              current.props.map(([k, v]) => (
                <Fragment key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </Fragment>
              ))
            ) : (
              <>
                <dt>属性</dt>
                <dd>暂无正式接入数据</dd>
              </>
            )}
          </dl>
        </div>
        <div className="ins-section">
          <h4>使用说明</h4>
          <div className="ins-desc">{current.description}</div>
        </div>
        <div className="ins-section">
          <h4>快捷操作</h4>
          <div className="actions">
            <button className="btn small" onClick={copyId}>
              复制 ID
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="inspector-inner">
      <div className="ins-head">
        <div className="ins-title">页面看板</div>
        <button
          className="icon-btn mobile-btn"
          onClick={closeDrawer}
          aria-label="收起看板"
        >
          ×
        </button>
      </div>
      {headings.length > 0 && (
        <div className="ins-section">
          <h4>页面目录</h4>
          {headings.map((h) => (
            <button
              key={h.id}
              className="anchor"
              onClick={() => scrollToHeading(h.id)}
            >
              {h.text}
            </button>
          ))}
        </div>
      )}
      {meta.length > 0 && (
        <div className="ins-section">
          <h4>元信息</h4>
          <dl className="kv">
            {meta.map((m) => (
              <Fragment key={m.label}>
                <dt>{m.label}</dt>
                <dd>{m.value}</dd>
              </Fragment>
            ))}
          </dl>
        </div>
      )}
      <div className="ins-section">
        <h4>使用说明</h4>
        <div className="ins-desc">
          {usage ??
            '点击中间内容区带高亮边框的对象（卡片、Token 行、色板等），此处将切换为该对象的属性看板；点击 × 恢复本目录。'}
        </div>
      </div>
    </div>
  );
}
