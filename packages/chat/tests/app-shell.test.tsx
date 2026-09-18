// @vitest-environment jsdom
import './setup.js';

import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { AppShell, useSidebarDrawer } from '../src/index.js';

afterEach(cleanup);

/**
 * AppShell（spec: chat-app-shell / chat-on-ui-sidebar）：外壳为 ui
 * Sidebar 薄封装——内部组合 shadcn Sidebar 原语（SidebarProvider /
 * Sidebar / SidebarInset），chat 侧挂 pactor-chat-shell 类做令牌映射。
 */

function renderShell(extra?: { locationKey?: string }) {
  return render(
    <AppShell
      sidebar={<nav data-testid="sidebar">侧栏</nav>}
      brand={<span data-testid="brand">Pactor Chat</span>}
      locationKey={extra?.locationKey}
    >
      <div data-testid="content">主区</div>
    </AppShell>,
  );
}

/** 把 matchMedia 桩为移动视口分支（jsdom 不应用媒体查询） */
function mockMobileViewport(): () => void {
  const originalMatchMedia = window.matchMedia;
  window.matchMedia = ((query: string) => ({
    matches: query.includes('max-width'),
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as typeof window.matchMedia;
  return () => {
    window.matchMedia = originalMatchMedia;
  };
}

describe('AppShell（spec: chat-app-shell）', () => {
  it('渲染侧栏与主内容：sidebar 与 children 均出现（spec: 应用外壳布局）', () => {
    renderShell();
    expect(screen.getByTestId('sidebar')).toBeTruthy();
    expect(screen.getByTestId('content')).toBeTruthy();
    // brand 双位置（决策 D3）：移动端顶栏 + 桌面侧栏品牌行
    expect(screen.getAllByTestId('brand')).toHaveLength(2);
    expect(
      document.querySelector('[data-slot=sidebar-topbar] [data-testid="brand"]'),
    ).toBeTruthy();
    expect(
      document.querySelector('[data-slot=sidebar-brand] [data-testid="brand"]'),
    ).toBeTruthy();
    expect(document.querySelector('.pactor-chat-shell')).toBeTruthy();
    expect(document.querySelector('[data-slot=sidebar]')).toBeTruthy();
    expect(document.querySelector('[data-slot=sidebar-inset]')).toBeTruthy();
  });

  it('移动端抽屉：菜单按钮开启 Sheet，locationKey 变化关闭（spec: 移动端抽屉）', () => {
    const restore = mockMobileViewport();
    try {
      const { rerender } = render(
        <AppShell
          sidebar={<nav data-testid="sidebar">侧栏</nav>}
          locationKey="s1"
        >
          <div data-testid="content">主区</div>
        </AppShell>,
      );

      // 移动端：侧栏为 Sheet 抽屉，初始关闭（内容不可见）
      expect(screen.queryByTestId('sidebar')).toBeNull();

      // 菜单钮开启
      fireEvent.click(screen.getByRole('button', { name: '打开导航' }));
      expect(screen.getByTestId('sidebar')).toBeTruthy();

      // locationKey 变化关闭
      rerender(
        <AppShell
          sidebar={<nav data-testid="sidebar">侧栏</nav>}
          locationKey="s2"
        >
          <div data-testid="content">主区</div>
        </AppShell>,
      );
      expect(screen.queryByTestId('sidebar')).toBeNull();
    } finally {
      restore();
    }
  });

  it('useSidebarDrawer：壳内 close() 关闭抽屉（spec: 壳内关闭抽屉）', () => {
    const restore = mockMobileViewport();
    try {
      function SidebarNav() {
        const drawer = useSidebarDrawer();
        return (
          <button type="button" onClick={() => drawer?.close()}>
            导航项
          </button>
        );
      }
      render(
        <AppShell sidebar={<SidebarNav />}>
          <div>主区</div>
        </AppShell>,
      );

      fireEvent.click(screen.getByRole('button', { name: '打开导航' }));
      expect(screen.getByRole('button', { name: '导航项' })).toBeTruthy();

      fireEvent.click(screen.getByRole('button', { name: '导航项' }));
      // Sheet 关闭后内容不可见
      expect(screen.queryByRole('button', { name: '导航项' })).toBeNull();
    } finally {
      restore();
    }
  });

  it('useSidebarDrawer：壳外返回 null 不抛错（spec: 壳外安全返回 null）', () => {
    function Outside() {
      const drawer = useSidebarDrawer();
      return <span>{drawer === null ? 'null' : 'has-context'}</span>;
    }
    render(<Outside />);
    expect(screen.getByText('null')).toBeTruthy();
  });
});

describe('AppShell 侧栏增强（spec: chat-app-shell / 桌面侧栏头部与折叠，决策 D3）', () => {
  it('折叠切换：侧栏 data-state 切换，折叠钮 aria-expanded / aria-label 更新（spec: 折叠为图标栏）', () => {
    render(
      <AppShell
        sidebar={<nav data-testid="sidebar">侧栏</nav>}
        brand={<span>品牌</span>}
        collapsible
      >
        <div>主区</div>
      </AppShell>,
    );
    const sidebar = document.querySelector('[data-slot=sidebar]')!;
    const button = screen.getByRole('button', { name: '收起侧边栏' });
    expect(button.getAttribute('aria-expanded')).toBe('true');
    expect(sidebar.getAttribute('data-state')).toBe('expanded');

    fireEvent.click(button);
    expect(sidebar.getAttribute('data-state')).toBe('collapsed');
    const expandButton = screen.getByRole('button', { name: '展开侧边栏' });
    expect(expandButton.getAttribute('aria-expanded')).toBe('false');

    fireEvent.click(expandButton);
    expect(sidebar.getAttribute('data-state')).toBe('expanded');
    expect(screen.getByRole('button', { name: '收起侧边栏' })).toBeTruthy();
  });

  it('缺省无折叠：未配置 collapsible 不渲染折叠钮（spec: 缺省无折叠）', () => {
    render(
      <AppShell sidebar={<nav>侧栏</nav>} brand={<span>品牌</span>}>
        <div>主区</div>
      </AppShell>,
    );
    expect(screen.queryByRole('button', { name: '收起侧边栏' })).toBeNull();
    expect(
      document.querySelector('[data-slot=sidebar][data-state="collapsed"]'),
    ).toBeNull();
  });

  it('移动端不渲染折叠钮，抽屉行为不变（spec: 移动端不受影响）', () => {
    const restore = mockMobileViewport();
    try {
      render(
        <AppShell
          sidebar={<nav data-testid="sidebar">侧栏</nav>}
          brand={<span>品牌</span>}
          collapsible
        >
          <div>主区</div>
        </AppShell>,
      );
      expect(screen.queryByRole('button', { name: '收起侧边栏' })).toBeNull();

      // 抽屉语义不变：菜单按钮打开 Sheet
      fireEvent.click(screen.getByRole('button', { name: '打开导航' }));
      expect(screen.getByTestId('sidebar')).toBeTruthy();
    } finally {
      restore();
    }
  });
});

describe('AppShell 侧栏底部槽（spec: chat-app-shell / 侧栏底部槽）', () => {
  it('sidebarFooter 固定在侧栏底部渲染（spec: 底部卡片）', () => {
    render(
      <AppShell
        sidebar={<nav data-testid="sidebar">侧栏</nav>}
        sidebarFooter={<div data-testid="footer">用户卡</div>}
      >
        <div>主区</div>
      </AppShell>,
    );
    const footer = document.querySelector('[data-slot=sidebar-footer]')!;
    expect(footer).toBeTruthy();
    expect(footer.querySelector('[data-testid="footer"]')).toBeTruthy();
    // 底部区在侧栏内、滚动区之后
    const content = document.querySelector('[data-slot=sidebar-content]')!;
    expect(
      content.compareDocumentPosition(footer) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it('未提供 sidebarFooter 时不渲染底部区容器（零渲染承诺）', () => {
    render(
      <AppShell sidebar={<nav>侧栏</nav>}>
        <div>主区</div>
      </AppShell>,
    );
    expect(document.querySelector('[data-slot=sidebar-footer]')).toBeNull();
  });
});

describe('AppShell 侧栏宽度令牌（chat-on-ui-sidebar 统一）', () => {
  it('styles.css 不再钉死侧栏宽度：无 --pactor-chat-sidebar-width 与失效的 [data-collapsed] 规则', () => {
    // 侧栏宽度统一由 ui 皮肤令牌 --sidebar-width / --sidebar-width-icon 驱动
    //（theme-studio 皮肤可覆盖）；chat 私有令牌与等不存在属性的旧规则已移除
    const css = readFileSync(join(__dirname, '../styles.css'), 'utf8');
    expect(css).not.toContain('--pactor-chat-sidebar-width');
    expect(css).not.toMatch(/\[data-collapsed\]\s*\{[^}]*width/);
  });
});

describe('对话列内间距契约（产物栏调宽时聊天区左右恒留 gutter）', () => {
  it('.pactor-chat-workspace 宽度为 calc(100% - 2 × gutter)，而非 100%', () => {
    // 产物栏拖拽调宽挤压剩余空间时，margin auto 会塌到 0；
    // width 预留 gutter 后，左右内间距由宽度计算保证，与面板宽度无关
    const css = readFileSync(join(__dirname, '../styles.css'), 'utf8');
    const block = css.match(
      /\.pactor-chat-workspace\s*\{([\s\S]*?)\n\}/,
    )?.[1];
    expect(block).toContain(
      'width: calc(100% - 2 * var(--pactor-chat-content-gutter))',
    );
    expect(block).not.toMatch(/^\s*width:\s*100%;/m);
  });

  it('面板打开时 gutter 由容器侧保证：host padding-left + 面板 margin-left', () => {
    // 对话列 calc 宽度在 flex 行内把面板宽度计入 100% 基准，shrink 后
    // margin auto 塌 0；容器侧两条规则与面板宽度无关地保住左右间距
    const css = readFileSync(join(__dirname, '../styles.css'), 'utf8');
    expect(css).toContain(
      '.pactor-chat-inspector-host__row:has(> .pactor-chat-inspector)',
    );
    expect(css).toMatch(
      /\.pactor-chat-inspector-host__row:has\(> \.pactor-chat-inspector\)\s*\{[^}]*padding-left:\s*var\(--pactor-chat-content-gutter\)/,
    );
    expect(css).toMatch(
      /\.pactor-chat-inspector-host__row > \.pactor-chat-inspector\s*\{[^}]*margin-left:\s*var\(--pactor-chat-content-gutter\)/,
    );
  });
});

describe('皮肤优先级契约（皮肤覆盖恒优先于 chat 默认值）', () => {
  const css = readFileSync(join(__dirname, '../styles.css'), 'utf8');

  it('--pactor-chat-* 令牌默认值声明在 :root（容器级直接声明会压过皮肤继承值）', () => {
    const rootBlock = css.match(/(?:^|\n):root \{([\s\S]*?)\n\}/)?.[1];
    expect(rootBlock).toBeTruthy();
    for (const token of [
      '--pactor-chat-bg:',
      '--pactor-chat-primary:',
      '--pactor-chat-radius-lg:',
      '--pactor-chat-shadow-sm:',
    ]) {
      expect(rootBlock).toContain(token);
    }
  });

  it('暗色覆盖声明在属性载体上（不绑定容器类），皮肤暗色块同优先级后加载胜出', () => {
    const darkBlock = css.match(/\[data-pactor-theme='dark'\] \{([\s\S]*?)\n\}/)?.[1];
    expect(darkBlock).toContain('--pactor-chat-shadow-sm:');
    // 不得退回容器级后代选择器（皮肤 :root 暗色块会被直接声明压盖）
    expect(css).not.toContain("[data-pactor-theme='dark'] .pactor-chat-");
  });

  it('系统暗色兜底经 :where() 降优先级（0,1,0），不压过皮肤亮色块', () => {
    expect(css).toContain(
      ":root:where(:not([data-pactor-theme='light']):not([data-pactor-theme='dark']))",
    );
  });
});
