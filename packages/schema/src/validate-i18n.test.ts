import { describe, expect, it } from 'vitest';

import {
  validateAuthorPageDsl,
  validateLocalizedPageDsl,
  validatePageDsl,
} from './index.js';

const basePage = {
  dsl: '1.0',
  page: { id: 'editor', title: '编辑页面' },
  body: { type: 'Button', props: { text: '保存' } },
};

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

/** 将 body.props.text 替换为给定值的页面文档 */
const withText = (text: unknown) => ({
  ...clone(basePage),
  body: { type: 'Button', props: { text } },
});

describe('validateAuthorPageDsl（作者态）', () => {
  it('accepts 页面级 i18n 字段（namespaces + bindings）', () => {
    const result = validateAuthorPageDsl({
      ...clone(basePage),
      i18n: {
        namespaces: ['common', 'editor'],
        bindings: {
          '/page/title': { key: 'editor.page.title', fallback: '编辑页面' },
          '/body/props/text': { key: 'common.save', fallback: '保存' },
        },
      },
    });

    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it('accepts 属性内联多语言与引用语言包两种 $i18n 写法', () => {
    const inline = validateAuthorPageDsl(
      withText({
        $i18n: {
          messages: { 'zh-CN': '保存', 'en-US': 'Save' },
          fallback: '保存',
        },
      }),
    );
    expect(inline.valid).toBe(true);
    expect(inline.errors).toEqual([]);

    const byKey = validateAuthorPageDsl(
      withText({ $i18n: { key: 'common.save', params: { name: 'x' } } }),
    );
    expect(byKey.valid).toBe(true);
    expect(byKey.errors).toEqual([]);
  });

  it('rejects $i18n 包装对象携带其他同级字段', () => {
    const result = validateAuthorPageDsl(
      withText({ $i18n: { key: 'common.save' }, extra: true }),
    );

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({
        path: '/body/props/text',
        keyword: 'additionalProperties',
      }),
    );
  });

  it('rejects key 与 messages 混用', () => {
    const result = validateAuthorPageDsl(
      withText({ $i18n: { key: 'common.save', messages: { 'zh-CN': '保存' } } }),
    );

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({ path: '/body/props/text/$i18n', keyword: 'oneOf' }),
    );
  });

  it('rejects 既无 key 也无 messages 的描述', () => {
    const result = validateAuthorPageDsl(withText({ $i18n: { fallback: '保存' } }));

    expect(result.valid).toBe(false);
  });

  it('rejects 嵌套的 messages（必须 locale → string 扁平映射）', () => {
    const result = validateAuthorPageDsl(
      withText({ $i18n: { messages: { 'zh-CN': { save: '保存' } } } }),
    );

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({
        path: '/body/props/text/$i18n/messages/zh-CN',
        keyword: 'type',
      }),
    );
  });

  it('rejects 非对象 params 与非字符串 fallback', () => {
    const badParams = validateAuthorPageDsl(
      withText({ $i18n: { key: 'common.save', params: 'name' } }),
    );
    expect(badParams.valid).toBe(false);
    expect(badParams.errors).toContainEqual(
      expect.objectContaining({
        path: '/body/props/text/$i18n/params',
        keyword: 'type',
      }),
    );

    const badFallback = validateAuthorPageDsl(
      withText({ $i18n: { key: 'common.save', fallback: 1 } }),
    );
    expect(badFallback.valid).toBe(false);
    expect(badFallback.errors).toContainEqual(
      expect.objectContaining({
        path: '/body/props/text/$i18n/fallback',
        keyword: 'type',
      }),
    );
  });

  it('rejects bindings 值再包 $i18n（bindings 值直接写 key/messages）', () => {
    const result = validateAuthorPageDsl({
      ...clone(basePage),
      i18n: { bindings: { '/page/title': { $i18n: { key: 'common.save' } } } },
    });

    expect(result.valid).toBe(false);
  });

  it('rejects bindings 值中 key 与 messages 混用', () => {
    const result = validateAuthorPageDsl({
      ...clone(basePage),
      i18n: {
        bindings: {
          '/page/title': { key: 'a.b', messages: { 'zh-CN': 'x' } },
        },
      },
    });

    expect(result.valid).toBe(false);
  });

  it('accepts 合法 JSON Pointer 作为 bindings 键（含空串与 ~0/~1 转义）', () => {
    const result = validateAuthorPageDsl({
      ...clone(basePage),
      i18n: {
        bindings: {
          '': { key: 'a.root' },
          '/page/title': { key: 'a.b' },
          '/body/children/0/props/text': { messages: { 'zh-CN': '保存' } },
          '/a~0b~1c': { key: 'a.c' },
        },
      },
    });

    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it('rejects 非法 JSON Pointer 形式的 bindings 键', () => {
    for (const pointer of ['page/title', '~/x', '/a/~2', '/a~']) {
      const result = validateAuthorPageDsl({
        ...clone(basePage),
        i18n: { bindings: { [pointer]: { key: 'a.b' } } },
      });
      expect(result.valid).toBe(false);
    }
  });

  it('rejects 页面级 i18n 的未知字段', () => {
    const result = validateAuthorPageDsl({
      ...clone(basePage),
      i18n: { namespaces: ['common'], locale: 'en-US' },
    });

    expect(result.valid).toBe(false);
  });

  it('validatePageDsl 语义不变：仍拒绝顶层 i18n 字段', () => {
    const result = validatePageDsl({
      ...clone(basePage),
      i18n: { namespaces: ['common'] },
    });

    expect(result.valid).toBe(false);
  });
});

describe('validateLocalizedPageDsl（下发态）', () => {
  it('accepts 已本地化为普通字符串的页面', () => {
    const result = validateLocalizedPageDsl({
      dsl: '1.0',
      page: { id: 'editor', title: 'Edit page' },
      body: { type: 'Button', props: { text: 'Save' } },
    });

    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it('accepts 注册的文本属性中出现 $localizedText（含动态 params）', () => {
    const result = validateLocalizedPageDsl(
      withText({
        $localizedText: {
          template: 'Selected: {{count}}',
          params: { count: '${state.selectedCount}' },
        },
      }),
    );

    expect(result.valid).toBe(true);
    expect(result.errors).toEqual([]);
  });

  it('rejects 残留 $i18n 描述并定位路径（含嵌套子树）', () => {
    const doc = clone(basePage) as Record<string, any>;
    doc.body.children = [
      { type: 'Text', props: { label: { $i18n: { key: 'common.save' } } } },
    ];
    const result = validateLocalizedPageDsl(doc);

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({
        path: '/body/children/0/props/label',
        keyword: 'prohibited',
      }),
    );
  });

  it('rejects 顶层 i18n 字段（作者态声明不得下发）', () => {
    const result = validateLocalizedPageDsl({
      ...clone(basePage),
      i18n: { namespaces: ['common'] },
    });

    expect(result.valid).toBe(false);
  });

  it('rejects 缺 template 的 $localizedText', () => {
    const result = validateLocalizedPageDsl(
      withText({ $localizedText: { params: { count: 1 } } }),
    );

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({
        path: '/body/props/text/$localizedText/template',
        keyword: 'required',
      }),
    );
  });

  it('rejects 非字符串 template 与非对象 params 的 $localizedText', () => {
    const badTemplate = validateLocalizedPageDsl(
      withText({ $localizedText: { template: 1 } }),
    );
    expect(badTemplate.valid).toBe(false);

    const badParams = validateLocalizedPageDsl(
      withText({ $localizedText: { template: 'Hi {{name}}', params: 'name' } }),
    );
    expect(badParams.valid).toBe(false);
    expect(badParams.errors).toContainEqual(
      expect.objectContaining({
        path: '/body/props/text/$localizedText/params',
        keyword: 'type',
      }),
    );
  });

  it('rejects $localizedText 包装对象携带其他同级字段', () => {
    const result = validateLocalizedPageDsl(
      withText({ $localizedText: { template: 'Save' }, extra: true }),
    );

    expect(result.valid).toBe(false);
    expect(result.errors).toContainEqual(
      expect.objectContaining({
        path: '/body/props/text',
        keyword: 'additionalProperties',
      }),
    );
  });
});
