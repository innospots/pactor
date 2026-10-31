// @vitest-environment jsdom
/**
 * 图表组件集契约（第九批：src/components/chart 目录，echarts 渲染）：
 * - EChartBase 生命周期（init / notMerge 更新 / dispose）经 mock echarts 实例断言；
 * - 初始化失败（无 canvas 环境）降级占位；
 * - MapChart 未注册地图时 Empty 降级 + warn；
 * - MetricCard 纯展示（趋势语义色）；
 * - DSL 集成：注册表渲染 + events.onSelect（${event} 规范化）。
 */
import './setup.js';

import { cleanup, render, screen, waitFor } from '@testing-library/react';
import type { DslNode } from '@pactor-app/core';
import { afterEach, describe, expect, it, vi } from 'vitest';

const fake = vi.hoisted(() => {
  const instances: {
    on: (event: string, handler: (params: unknown) => void) => void;
    setOption: ReturnType<typeof vi.fn>;
    resize: ReturnType<typeof vi.fn>;
    dispose: ReturnType<typeof vi.fn>;
  }[] = [];
  let throwOnInit = false;
  const registerMapMock = vi.fn();
  const registered = new Set<string>();
  return {
    instances,
    clickHandlers: [] as ((params: unknown) => void)[],
    registerMapMock,
    registered,
    setThrowOnInit(value: boolean) {
      throwOnInit = value;
    },
    echarts: {
      use: () => {},
      init: () => {
        if (throwOnInit) throw new Error('canvas not supported');
        const instance = {
          on: (_event: string, handler: (params: unknown) => void) => {
            fake.clickHandlers.push(handler);
          },
          setOption: vi.fn(),
          resize: vi.fn(),
          dispose: vi.fn(),
        };
        instances.push(instance);
        return instance;
      },
      getMap: (name: string) => (registered.has(name) ? { geoJSON: {} } : undefined),
      registerMap: (...args: unknown[]) => {
        registerMapMock(...args);
        registered.add(args[0] as string);
      },
    },
  };
});

vi.mock('../src/components/echarts-modules.js', () => ({
  echarts: fake.echarts,
}));

import {
  ColumnChart,
  GaugeChart,
  LineChart,
  MapChart,
  MetricCard,
} from '../src/index.js';
import {
  CHART_SKIN_CHANGE_EVENT,
  resetChartTheme,
} from '../src/components/lib/theme.js';
import { expectEventState, renderDsl } from './helpers.js';

afterEach(() => {
  cleanup();
  fake.instances.length = 0;
  fake.clickHandlers.length = 0;
  fake.registered.clear();
  fake.setThrowOnInit(false);
  document.documentElement.removeAttribute('data-pactor-theme');
  document.documentElement.style.removeProperty('--chart-1');
  resetChartTheme();
});

describe('EChartBase 生命周期（mock echarts）', () => {
  it('初始化实例并以 notMerge 更新 option', () => {
    const { container, rerender } = render(
      <LineChart data={[{ m: '一月', v: 1 }]} xKey="m" yKeys={['v']} />,
    );

    const host = container.querySelector('[data-slot=line-chart]') as HTMLElement;
    expect(host).not.toBeNull();
    expect(host.style.height).toBe('256px');
    expect(fake.instances).toHaveLength(1);
    expect(fake.instances[0]!.setOption).toHaveBeenCalledWith(
      expect.objectContaining({ series: expect.any(Array) }),
      { notMerge: true },
    );

    rerender(<LineChart data={[{ m: '一月', v: 2 }]} xKey="m" yKeys={['v']} height={320} />);
    expect(host.style.height).toBe('320px');
    expect(fake.instances[0]!.setOption.mock.calls.length).toBeGreaterThanOrEqual(2);
  });

  it('自定义 height / className / style 透传根节点', () => {
    const { container } = render(
      <ColumnChart
        data={[{ m: '一月', v: 1 }]}
        xKey="m"
        yKeys={['v']}
        height="50%"
        className="biz-probe"
        style={{ opacity: 0.5 }}
      />,
    );
    const host = container.querySelector('[data-slot=column-chart]') as HTMLElement;
    expect(host.style.height).toBe('50%');
    expect(host.classList.contains('biz-probe')).toBe(true);
    expect(host.style.opacity).toBe('0.5');
  });

  it('卸载时 dispose 实例', () => {
    const { unmount } = render(<GaugeChart value={60} />);
    expect(fake.instances).toHaveLength(1);
    unmount();
    expect(fake.instances[0]!.dispose).toHaveBeenCalled();
  });

  it('初始化失败降级为占位提示', () => {
    fake.setThrowOnInit(true);
    const { container } = render(
      <LineChart data={[{ m: '一月', v: 1 }]} xKey="m" yKeys={['v']} />,
    );
    expect(container.querySelector('[data-slot=chart-fallback]')!.textContent).toContain(
      '当前环境不支持图表渲染',
    );
    expect(fake.instances).toHaveLength(0);
  });

  it('空数据渲染同高空态占位，不初始化 echarts', () => {
    const { container } = render(<LineChart data={[]} height={320} />);
    const empty = container.querySelector('[data-slot=chart-empty]') as HTMLElement;
    expect(empty).not.toBeNull();
    expect(empty.style.height).toBe('320px');
    expect(empty.textContent).toContain('暂无数据');
    expect(container.querySelector('[data-slot=line-chart]')).toBeNull();
    expect(fake.instances).toHaveLength(0);
  });

  it('空数据 → 有数据：切换为图表并初始化实例', () => {
    const { container, rerender } = render(<LineChart data={[]} xKey="m" yKeys={['v']} />);
    expect(container.querySelector('[data-slot=chart-empty]')).not.toBeNull();
    rerender(<LineChart data={[{ m: '一月', v: 1 }]} xKey="m" yKeys={['v']} />);
    expect(container.querySelector('[data-slot=chart-empty]')).toBeNull();
    expect(container.querySelector('[data-slot=line-chart]')).not.toBeNull();
    expect(fake.instances).toHaveLength(1);
    expect(fake.instances[0]!.setOption).toHaveBeenCalled();
  });
});

describe('MetricCard', () => {
  it('标题 / 数值 / 前缀后缀', () => {
    render(<MetricCard title="月收入" value={12800} prefix="¥" suffix="元" />);
    expect(screen.getByText('月收入')).not.toBeNull();
    const value = document.querySelector('[data-slot=metric-card-value]')!;
    expect(value.textContent).toBe('¥12800元');
  });

  it('正趋势：上升箭头 + success 语义色', () => {
    render(<MetricCard title="t" value={1} trend={12.5} trendLabel="较上月" />);
    const trend = document.querySelector('[data-slot=metric-card-trend]')!;
    expect(trend.getAttribute('data-trend')).toBe('up');
    expect(trend.classList.contains('text-success')).toBe(true);
    expect(trend.textContent).toContain('12.5%');
    expect(trend.textContent).toContain('较上月');
  });

  it('负趋势：下降箭头 + destructive 语义色；0 不展示趋势', () => {
    const { container, rerender } = render(<MetricCard title="t" value={1} trend={-3} />);
    const trend = container.querySelector('[data-slot=metric-card-trend]')!;
    expect(trend.getAttribute('data-trend')).toBe('down');
    expect(trend.classList.contains('text-destructive')).toBe(true);

    rerender(<MetricCard title="t" value={1} trend={0} />);
    expect(container.querySelector('[data-slot=metric-card-trend]')).toBeNull();
  });
});

describe('MapChart 地图注册约定', () => {
  it('未注册且无 geoJson：Empty 占位 + console.warn，不抛错', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(<MapChart mapName="china" data={[{ name: '北京', value: 1 }]} />);
    expect(screen.getByText('地图未注册')).not.toBeNull();
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('china'));
    warn.mockRestore();
  });

  it('传入 geoJson：注册地图并渲染图表容器', () => {
    const { container } = render(
      <MapChart mapName="demo" geoJson={{ type: 'FeatureCollection', features: [] }} />,
    );
    expect(fake.registerMapMock).toHaveBeenCalledWith(
      'demo',
      expect.objectContaining({ type: 'FeatureCollection' }),
    );
    expect(container.querySelector('[data-slot=map-chart]')).not.toBeNull();
  });

  it('geoJsonUrl：加载成功后注册并渲染；失败降级 Empty', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ type: 'FeatureCollection', features: [] }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const { container } = render(
      <MapChart mapName="remote-map" geoJsonUrl="/maps/demo.json" />,
    );
    expect(container.querySelector('[data-slot=map-chart-loading]')).not.toBeNull();

    await vi.waitFor(() => {
      expect(container.querySelector('[data-slot=map-chart]')).not.toBeNull();
    });
    expect(fetchMock).toHaveBeenCalledWith('/maps/demo.json');
    expect(fake.registerMapMock).toHaveBeenCalledWith(
      'remote-map',
      expect.objectContaining({ type: 'FeatureCollection' }),
    );

    fetchMock.mockRejectedValue(new Error('network'));
    const fail = render(<MapChart mapName="broken-map" geoJsonUrl="/maps/broken.json" />);
    await vi.waitFor(() => {
      expect(fail.container.textContent).toContain('地图加载失败');
    });
    vi.unstubAllGlobals();
  });
});

describe('DSL 集成（注册表渲染 + 事件）', () => {
  it('注册表渲染 LineChart / ColumnChart / GaugeChart', () => {
    const { container } = renderDsl({
      type: 'Flex',
      props: { direction: 'column' },
      children: [
        { type: 'LineChart', props: { data: [{ m: '一月', v: 1 }], xKey: 'm', yKeys: ['v'] } },
        { type: 'ColumnChart', props: { data: [{ m: '一月', v: 1 }], xKey: 'm', yKeys: ['v'] } },
        { type: 'GaugeChart', props: { value: 66 } },
      ],
    } as DslNode);
    expect(container.querySelector('[data-slot=line-chart]')).not.toBeNull();
    expect(container.querySelector('[data-slot=column-chart]')).not.toBeNull();
    expect(container.querySelector('[data-slot=gauge-chart]')).not.toBeNull();
  });

  it('events.onSelect：echarts click 载荷写入状态（${event} 规范化）', async () => {
    const { context } = renderDsl({
      type: 'ColumnChart',
      props: { data: [{ m: '一月', v: 30 }], xKey: 'm', yKeys: ['v'] },
      events: { onSelect: { action: 'setState', params: { picked: '${event}' } } },
    } as DslNode);

    expect(fake.clickHandlers.length).toBe(1);
    const payload = { name: '一月', value: 30, seriesName: 'v', dataIndex: 0 };
    fake.clickHandlers[0]!(payload);
    await expectEventState(context, 'picked', payload);
  });

  it('MetricCard 经 DSL 渲染', () => {
    renderDsl({ type: 'MetricCard', props: { title: '活跃用户', value: 1024, trend: 5.2 } } as DslNode);
    expect(screen.getByText('活跃用户')).not.toBeNull();
    expect(document.querySelector('[data-slot=metric-card-trend]')).not.toBeNull();
  });
});

/** 最近一轮 setOption 的 option 载荷 */
function lastOption(instance: (typeof fake.instances)[number]) {
  const calls = instance.setOption.mock.calls;
  return calls[calls.length - 1]![0] as { color?: string[] };
}

describe('皮肤切换跟随（useChartTheme）', () => {
  it('皮肤令牌变化（令牌覆写）后以新主题重建 option', async () => {
    render(<LineChart data={[{ m: '一月', v: 1 }]} xKey="m" yKeys={['v']} />);
    const instance = fake.instances[0]!;
    expect(lastOption(instance).color?.[0]).not.toBe('rgb(9, 8, 7)');

    document.documentElement.style.setProperty('--chart-1', 'rgb(9, 8, 7)');
    await waitFor(() => expect(lastOption(instance).color?.[0]).toBe('rgb(9, 8, 7)'));
  });

  it('data-pactor-theme 明暗切换触发 option 重建', async () => {
    render(<LineChart data={[{ m: '一月', v: 1 }]} xKey="m" yKeys={['v']} />);
    const instance = fake.instances[0]!;
    const calls = instance.setOption.mock.calls.length;

    document.documentElement.setAttribute('data-pactor-theme', 'dark');
    await waitFor(() =>
      expect(instance.setOption.mock.calls.length).toBeGreaterThan(calls),
    );
  });

  it('宿主 dispatch pactor:skin-change 事件强制刷新', async () => {
    render(<LineChart data={[{ m: '一月', v: 1 }]} xKey="m" yKeys={['v']} />);
    const instance = fake.instances[0]!;
    const calls = instance.setOption.mock.calls.length;

    window.dispatchEvent(new Event(CHART_SKIN_CHANGE_EVENT));
    await waitFor(() =>
      expect(instance.setOption.mock.calls.length).toBeGreaterThan(calls),
    );
  });

  it('卸载后停止监听（末个订阅者移除 observer）', async () => {
    const { unmount } = render(
      <LineChart data={[{ m: '一月', v: 1 }]} xKey="m" yKeys={['v']} />,
    );
    const instance = fake.instances[0]!;
    unmount();
    const calls = instance.setOption.mock.calls.length;

    document.documentElement.setAttribute('data-pactor-theme', 'dark');
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(instance.setOption.mock.calls.length).toBe(calls);
  });
});
