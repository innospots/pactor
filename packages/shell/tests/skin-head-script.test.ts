import { renderToStaticMarkup } from 'react-dom/server';
import { createElement } from 'react';

import { describe, expect, it } from 'vitest';

import { SkinHeadScript } from '../src/skin/SkinHeadScript.js';

function scriptHtml(props?: Parameters<typeof SkinHeadScript>[0]): string {
  return renderToStaticMarkup(createElement(SkinHeadScript, props));
}

describe('SkinHeadScript', () => {
  it('包含存储键、皮肤名单与 themes 路径', () => {
    const html = scriptHtml();
    expect(html).toContain('localStorage.getItem("pactor.theme")');
    expect(html).toContain('"qing-hui"');
    expect(html).toContain('"/themes"');
    expect(html).toContain('data-pactor-skin');
    expect(html).toContain('prefers-color-scheme: dark');
    expect(html).toContain('localStorage.getItem("pactor.mode")');
  });

  it('不传 defaultSkin 时缺省不注入首屏 link（skin 落回 null）', () => {
    expect(scriptHtml()).toContain('skin=null');
  });

  it('传 defaultSkin 时作为无存储值的首屏缺省', () => {
    expect(scriptHtml({ defaultSkin: 'qing-ming' })).toContain('skin="qing-ming"');
  });

  it('持久化 "system" 走系统偏好（仅显式 light 跳过 dark 判定）', () => {
    const html = scriptHtml();
    expect(html).toContain('mode!=="light"');
    expect(html).not.toContain('mode?mode==="dark"');
  });

  it('自定义 storageKey / modeStorageKey / themesPath / allowedSkins', () => {
    const html = scriptHtml({
      storageKey: 'mc-skin',
      modeStorageKey: 'mc-mode',
      themesPath: '/skins',
      allowedSkins: ['qing-hui'],
    });
    expect(html).toContain('localStorage.getItem("mc-skin")');
    expect(html).toContain('localStorage.getItem("mc-mode")');
    expect(html).toContain('"/skins"');
    expect(html).toContain('["qing-hui"]');
  });
});
