// 拼接 react-grid-layout / react-resizable 官方样式与本包附加样式为单文件 styles.css
import { createRequire } from 'node:module';
import { readFileSync, writeFileSync } from 'node:fs';

const require = createRequire(import.meta.url);
const sources = [
  require.resolve('react-grid-layout/css/styles.css'),
  require.resolve('react-resizable/css/styles.css'),
  'src/styles.css',
];
const out = sources.map((path) => readFileSync(path, 'utf8').trimEnd()).join('\n\n') + '\n';
writeFileSync('styles.css', out);
console.log(`styles.css written (${sources.length} sources)`);
