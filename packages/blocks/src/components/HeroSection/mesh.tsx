import type { CSSProperties } from 'react';

/** 装饰网格光斑：多层柔和渐变（纯 CSS，无 WebGL；Arc HeroMesh 的简化实现）。
 *  外层放大留出漂移余量（keyframes pactor-hero-mesh-drift 缓慢平移缩放） */
const MESH_BLOB_STYLE: CSSProperties = {
  backgroundImage:
    'radial-gradient(60% 55% at 18% 24%, color-mix(in oklch, hsl(var(--primary)) 18%, transparent)),' +
    'radial-gradient(48% 45% at 82% 18%, color-mix(in oklch, hsl(var(--accent)) 14%, transparent)),' +
    'radial-gradient(46% 50% at 62% 82%, color-mix(in oklch, hsl(var(--primary)) 11%, transparent))',
};

/** 装饰网格点阵：细点 + 向下渐隐遮罩 */
const MESH_DOTS_STYLE: CSSProperties = {
  backgroundImage: 'radial-gradient(circle, hsl(var(--border)) 1px, transparent 1px)',
  backgroundSize: '28px 28px',
  maskImage: 'linear-gradient(to bottom, black, transparent 85%)',
  WebkitMaskImage: 'linear-gradient(to bottom, black, transparent 85%)',
};

/** 胶片颗粒：SVG 噪点平铺 + overlay 混合（静态，随系统减弱动画时保留质感） */
const GRAIN_STYLE: CSSProperties = {
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`,
  opacity: 0.05,
  mixBlendMode: 'overlay',
};

/**
 * HeroMesh 装饰网格：光斑缓慢漂移 + 点阵渐隐 + 胶片颗粒。
 * 纯装饰：aria-hidden、不拦截指针；动效尊重 prefers-reduced-motion
 * （漂移静止为定格帧，颗粒保留）。
 */
export function HeroMesh() {
  return (
    <div
      data-slot="hero-section-mesh"
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      <div
        className="absolute -inset-[12%] animate-[pactor-hero-mesh-drift_22s_ease-in-out_infinite] motion-reduce:animate-none"
        style={MESH_BLOB_STYLE}
      />
      <div className="absolute inset-0 opacity-60" style={MESH_DOTS_STYLE} />
      <div className="absolute inset-0" style={GRAIN_STYLE} />
    </div>
  );
}
