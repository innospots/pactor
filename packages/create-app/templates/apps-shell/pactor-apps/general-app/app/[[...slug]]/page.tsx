/**
 * 可选 catch-all：匹配全部站内路径，但渲染为空——应用本体挂在
 * app/layout.tsx 的 PactorApp（layout 跨导航常驻，page 会被重挂载）。
 */
export default function CatchAllPage() {
  return null;
}
