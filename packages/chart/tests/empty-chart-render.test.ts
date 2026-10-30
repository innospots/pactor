import { describe, it, expect } from 'vitest';
import { SVGRenderer } from 'echarts/renderers';
import { echarts } from '../src/components/echarts-modules.js';
import { buildHeatmapOption, buildRadarOption, buildSankeyOption, buildTreeOption } from '../src/components/lib/option-builders.js';
import type { ChartTheme } from '../src/components/lib/theme.js';

echarts.use([SVGRenderer]);
const theme: ChartTheme = {
  palette: ['#123456', '#456789', '#789abc'], foreground: '#111111', muted: '#777777',
  border: '#cccccc', card: '#ffffff', success: '#008800', warning: '#ffaa00', destructive: '#cc0000', info: '#0066cc',
};

describe('empty chart lifecycle with ECharts', () => {
  const options = {
    radar: buildRadarOption({ data: [], yKeys: ['value', 'target'] }, theme),
    heatmap: buildHeatmapOption({ data: [] }, theme),
    tree: buildTreeOption({ data: [] }, theme),
    sankey: buildSankeyOption({ nodes: [], links: [] }, theme),
  };
  for (const [name, option] of Object.entries(options)) {
    it(`${name} supports empty data and resize`, () => {
      const chart = echarts.init(null, undefined, { renderer: 'svg', ssr: true, width: 400, height: 260 });
      try {
        expect(() => { chart.setOption(option); chart.resize(); }).not.toThrow();
      } finally { chart.dispose(); }
    });
  }
});
