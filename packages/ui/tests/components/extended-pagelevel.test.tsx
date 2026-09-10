// @vitest-environment jsdom
/**
 * 页面级组合组件契约（spec: shadcn-extended-components / 页面级组合组件）：
 * Sidebar 布局渲染与 collapsible 折叠、DataTable 排序/筛选/分页与
 * onSort/onPageChange 事件值、Chart 四种类型渲染，以及三者的通用 props。
 */
import { act, fireEvent, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  COMMON_PROPS_PROBE,
  expectCommonProps,
  expectEventState,
  expectIconBeforeLabel,
  renderDsl,
} from './helpers.js';

const COMMON_PROPS = COMMON_PROPS_PROBE;

describe('Sidebar', () => {
  const sidebarDsl = {
    type: 'Sidebar',
    props: {
      brand: { title: '后台', logo: '/logo.svg' },
      items: [
        { label: '概览', href: '/' },
        {
          label: '配置',
          children: [{ label: '成员', href: '/members' }],
        },
      ],
    },
    children: [{ type: 'Text', props: { text: '主内容' } }],
  } as const;

  it('渲染品牌区、导航项（含嵌套子菜单）与主内容区', () => {
    const { container } = renderDsl(sidebarDsl as never);

    // 品牌文案在侧栏品牌行与移动端顶栏各渲染一份（顶栏桌面经 CSS 隐藏）
    expect(screen.getAllByText('后台').length).toBeGreaterThan(0);
    const logo = container.querySelector(
      '[data-slot=sidebar-brand-logo]',
    ) as HTMLImageElement;
    expect(logo.getAttribute('src')).toBe('/logo.svg');

    const overview = screen.getByRole('link', { name: '概览' });
    expect(overview.getAttribute('href')).toBe('/');
    const member = screen.getByRole('link', { name: '成员' });
    expect(member.getAttribute('href')).toBe('/members');

    expect(
      container.querySelector('[data-slot=sidebar-inset]')!.textContent,
    ).toContain('主内容');
  });

  it('collapsible：点击折叠触发器收起侧栏并触发 onCollapse（传 boolean）', async () => {
    const { container, context } = renderDsl({
      type: 'Sidebar',
      props: { brand: { title: '后台' }, items: [{ label: '概览', href: '/' }], collapsible: true },
      events: {
        onCollapse: { action: 'setState', params: { collapsed: '${event}' } },
      },
      children: [{ type: 'Text', props: { text: '主内容' } }],
    });

    const sidebar = container.querySelector('[data-slot=sidebar]')!;
    expect(sidebar.getAttribute('data-state')).toBe('expanded');

    fireEvent.click(
      container.querySelector('[data-slot=sidebar-collapse-trigger]')!,
    );
    await expectEventState(context, 'collapsed', true);
    expect(sidebar.getAttribute('data-state')).toBe('collapsed');
    expect(sidebar.getAttribute('data-collapsible')).toBe('icon');
    // 折叠后收窄为 icon rail：导航区保留（label CSS 视觉隐藏）
    expect(container.querySelector('[data-slot=sidebar-content]')).not.toBeNull();
    // hover 菜单项经 Tooltip 展示
    fireEvent.focus(container.querySelector('[data-slot=sidebar-menu-button]')!);
    await vi.waitFor(() => {
      expect(
        document.querySelector('[data-slot=tooltip-content]')?.textContent,
      ).toBe('概览');
    });

    fireEvent.click(
      container.querySelector('[data-slot=sidebar-collapse-trigger]')!,
    );
    await expectEventState(context, 'collapsed', false);
    expect(sidebar.getAttribute('data-state')).toBe('expanded');
    expect(container.querySelector('[data-slot=sidebar-content]')).not.toBeNull();
  });

  it('通用 props 作用于根节点', () => {
    const { container } = renderDsl({
      type: 'Sidebar',
      props: { brand: { title: 'x' }, ...COMMON_PROPS },
      children: [{ type: 'Text', props: { text: 'y' } }],
    });
    expectCommonProps(container.querySelector('[data-slot=sidebar-wrapper]'));
  });

  it('导航项声明 icon 时在文字前渲染图标（链接与纯文本两种形态）', () => {
    const { container } = renderDsl({
      type: 'Sidebar',
      props: {
        items: [
          { label: '概览', href: '/', icon: 'home' },
          { label: '配置', icon: 'settings' },
        ],
      },
      children: [{ type: 'Text', props: { text: '主内容' } }],
    });

    expectIconBeforeLabel(screen.getByRole('link', { name: '概览' }), '概览');
    // 纯文本项（无 href）渲染为 button
    const textItem = Array.from(
      container.querySelectorAll('[data-slot=sidebar-menu-button]'),
    ).find((el) => el.textContent?.includes('配置'));
    expect(textItem).toBeDefined();
    expectIconBeforeLabel(textItem!, '配置');
  });
});

describe('DataTable', () => {
  const ROWS = [
    { id: 1, name: '张三', age: 28 },
    { id: 2, name: '李四', age: 32 },
    { id: 3, name: '王五', age: 25 },
  ];
  const COLUMNS = [
    { key: 'name', title: '姓名', filterable: true },
    { key: 'age', title: '年龄', sortable: true },
  ];

  function renderDataTable(props: Record<string, unknown>, events?: unknown) {
    return renderDsl({
      type: 'DataTable',
      props: { columns: COLUMNS, rows: ROWS, ...props },
      ...(events ? { events: events as never } : {}),
    });
  }

  function bodyRowTexts(container: HTMLElement): string[] {
    return Array.from(container.querySelectorAll('tbody tr')).map(
      (row) => row.textContent ?? '',
    );
  }

  it('渲染列与数据行', () => {
    const { container } = renderDataTable({});

    expect(container.querySelectorAll('tbody tr')).toHaveLength(3);
    expect(screen.getByText('张三')).toBeTruthy();
    expect(screen.getByText('32')).toBeTruthy();
  });

  it('sortable：点击表头触发 onSort 传 { key, order } 且行数据重排，再次点击切换为 desc', async () => {
    const { container, context } = renderDataTable(
      {},
      {
        onSort: { action: 'setState', params: { sortInfo: '${event}' } },
      },
    );

    fireEvent.click(screen.getByRole('button', { name: '年龄' }));
    await expectEventState(context, 'sortInfo', { key: 'age', order: 'asc' });
    // asc：王五(25) → 张三(28) → 李四(32)
    expect(bodyRowTexts(container)[0]).toContain('王五');

    fireEvent.click(screen.getByRole('button', { name: '年龄' }));
    await expectEventState(context, 'sortInfo', { key: 'age', order: 'desc' });
    expect(bodyRowTexts(container)[0]).toContain('李四');
  });

  it('filterable：表头筛选输入客户端包含匹配过滤行', () => {
    const { container } = renderDataTable({});

    const filter = container.querySelector(
      '[data-slot=data-table-filter][data-column=name]',
    )!;
    fireEvent.change(filter, { target: { value: '李' } });

    const rows = bodyRowTexts(container);
    expect(rows).toHaveLength(1);
    expect(rows[0]).toContain('李四');
  });

  it('分页：pageSize 切页触发 onPageChange 传页码 number 且渲染对应页数据', async () => {
    const { container, context } = renderDataTable(
      { pagination: { pageSize: 2 } },
      {
        onPageChange: { action: 'setState', params: { page: '${event}' } },
      },
    );

    expect(container.querySelectorAll('tbody tr')).toHaveLength(2);
    fireEvent.click(screen.getByRole('button', { name: '2' }));
    await expectEventState(context, 'page', 2);
    expect(container.querySelectorAll('tbody tr')).toHaveLength(1);
    expect(screen.getByText('王五')).toBeTruthy();
  });

  it('pagination: false 不渲染分页器', () => {
    const { container } = renderDataTable({ pagination: false });
    expect(container.querySelector('[data-slot=table-pagination]')).toBeNull();
  });

  it('cell 自定义渲染：children DSL 子树经 row/rowIndex 作用域渲染', async () => {
    const { context } = renderDsl({
      type: 'DataTable',
      props: {
        rows: ROWS,
        columns: [
          { key: 'name', title: '姓名' },
          {
            key: 'ops',
            title: '操作',
            children: [
              {
                type: 'Button',
                props: { text: '编辑第 ${rowIndex} 行' },
                events: {
                  onClick: {
                    action: 'setState',
                    params: { editing: '${row.id}' },
                  },
                },
              },
            ],
          },
        ],
      },
    });

    const buttons = screen.getAllByRole('button', { name: /编辑第 \d 行/ });
    expect(buttons).toHaveLength(3);
    fireEvent.click(buttons[2]!);
    await expectEventState(context, 'editing', 3);
  });

  it('通用 props 作用于根节点', () => {
    const { container } = renderDataTable({ ...COMMON_PROPS });
    expectCommonProps(container.querySelector('[data-slot=data-table]'));
  });
});

describe('Chart', () => {
  // jsdom 下 getBoundingClientRect 恒返回 0，recharts ResponsiveContainer
  // 初始尺寸取自它；仅给 responsive-container mock 固定尺寸（其余元素返回 0，
  // 避免 Legend 测量出超大尺寸把绘图区挤没），使图表真实渲染出 SVG 系列元素
  beforeEach(() => {
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(
      function (this: HTMLElement) {
        const sized = this.classList?.contains('recharts-responsive-container');
        const width = sized ? 600 : 0;
        const height = sized ? 300 : 0;
        return {
          width,
          height,
          top: 0,
          left: 0,
          right: width,
          bottom: height,
          x: 0,
          y: 0,
          toJSON: () => ({}),
        } as DOMRect;
      },
    );
  });

  const DATA = [
    { month: '一月', amount: 120, profit: 30 },
    { month: '二月', amount: 200, profit: 80 },
    { month: '三月', amount: 150, profit: 45 },
  ];

  it('bar：渲染柱状图（数据经表达式注入），系列取 chart 令牌色', async () => {
    const { container, context } = renderDsl(
      {
        type: 'Chart',
        props: {
          chartType: 'bar',
          data: '${data.sales}',
          xKey: 'month',
          yKeys: ['amount'],
        },
      },
      {
        dataSources: {
          sales: { type: 'static', value: DATA, autoLoad: true },
        },
      },
    );

    const root = container.querySelector('[data-slot=chart]')!;
    expect(root.getAttribute('data-chart-type')).toBe('bar');
    expect(container.querySelector('svg.recharts-surface')).not.toBeNull();

    // 未经 PageRuntime 时手动触发 autoLoad
    await act(async () => {
      await context.data.init();
    });

    // 数据源异步加载，等待系列渲染
    await vi.waitFor(() => {
      expect(
        container.querySelectorAll('.recharts-bar-rectangle path').length,
      ).toBeGreaterThan(0);
    });
    expect(container.querySelector('svg')!.innerHTML).toContain(
      'var(--chart-1)',
    );
  });

  it('line / area：渲染对应系列元素；多 yKeys 时渲染 Legend', () => {
    const { container } = renderDsl({
      type: 'Flex',
      children: [
        {
          type: 'Chart',
          props: {
            chartType: 'line',
            data: DATA,
            xKey: 'month',
            yKeys: ['amount', 'profit'],
          },
        },
        {
          type: 'Chart',
          props: {
            chartType: 'area',
            data: DATA,
            xKey: 'month',
            yKeys: ['amount'],
          },
        },
      ],
    });

    expect(
      container.querySelectorAll('.recharts-line-curve').length,
    ).toBeGreaterThan(0);
    expect(
      container.querySelectorAll('.recharts-area-area').length,
    ).toBeGreaterThan(0);
    // 多系列 line 图渲染图例
    expect(container.querySelector('.recharts-legend-wrapper')).not.toBeNull();
  });

  it('pie：以 xKey 为 name、yKeys[0] 为 value 渲染切片', () => {
    const { container } = renderDsl({
      type: 'Chart',
      props: {
        chartType: 'pie',
        data: DATA,
        xKey: 'month',
        yKeys: ['amount'],
      },
    });

    expect(
      container.querySelectorAll('.recharts-pie-sector').length,
    ).toBeGreaterThan(0);
  });

  it('通用 props 作用于根节点', () => {
    const { container } = renderDsl({
      type: 'Chart',
      props: {
        chartType: 'bar',
        data: DATA,
        xKey: 'month',
        yKeys: ['amount'],
        ...COMMON_PROPS,
      },
    });
    expectCommonProps(container.querySelector('[data-slot=chart]'));
  });
});
