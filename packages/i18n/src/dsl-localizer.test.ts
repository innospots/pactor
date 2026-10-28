import { describe, expect, it, vi } from 'vitest';

import type { MessageBundleSet } from '@pactor-app/core';
import { validateLocalizedPageDsl } from '@pactor-app/schema';

import {
  localizePageDsl,
  MISSING_TRANSLATION_TEXT,
  type AuthorPageDsl,
  type LocalizeDiagnostic,
} from './dsl-localizer.js';
import { TranslatableFieldRegistry } from './translatable-field-registry.js';

/** 构造 MessageBundleSet：namespace → messages */
function bundleSet(locale: string, bundles: Record<string, Record<string, string>>): MessageBundleSet {
  return {
    appId: 'app',
    locale,
    release: 'rel-1',
    format: 'simple-v1',
    bundles: Object.fromEntries(
      Object.entries(bundles).map(([ns, messages]) => [ns, { version: '1', messages }]),
    ),
  };
}

const EMPTY_EN = bundleSet('en-US', { common: {} });
const EMPTY_ZH = bundleSet('zh-CN', { common: {} });

function asPage(doc: unknown): AuthorPageDsl {
  return doc as AuthorPageDsl;
}

function deepFreeze<T>(value: T): T {
  if (typeof value === 'object' && value !== null) {
    for (const child of Object.values(value)) {
      deepFreeze(child);
    }
    Object.freeze(value);
  }
  return value;
}

function localize(page: AuthorPageDsl, over?: Partial<Parameters<typeof localizePageDsl>[0]>) {
  return localizePageDsl({
    page,
    locale: 'en-US',
    defaultLocale: 'zh-CN',
    languageBundles: { current: EMPTY_EN, fallbacks: [EMPTY_ZH] },
    ...over,
  });
}

describe('三种声明方式产出相同字段值（验收标准）', () => {
  const bundles = {
    current: bundleSet('en-US', { common: { 'common.save': 'Save' } }),
    fallbacks: [bundleSet('zh-CN', { common: { 'common.save': '保存' } })],
  };

  const inline = asPage({
    dsl: '1.0',
    page: { id: 'p' },
    body: {
      type: 'Button',
      props: { text: { $i18n: { messages: { 'zh-CN': '保存', 'en-US': 'Save' }, fallback: '保存' } } },
    },
  });
  const keyRef = asPage({
    dsl: '1.0',
    page: { id: 'p' },
    i18n: { namespaces: ['common'] },
    body: { type: 'Button', props: { text: { $i18n: { key: 'common.save', fallback: '保存' } } } },
  });
  const binding = asPage({
    dsl: '1.0',
    page: { id: 'p' },
    body: { type: 'Button', props: { text: '$i18n{common.save:保存}' } },
  });

  it('en-US 下三种方式均为 Save', () => {
    for (const page of [inline, keyRef, binding]) {
      const out = localize(page, { languageBundles: bundles });
      expect(out.body).toMatchObject({ props: { text: 'Save' } });
      expect(out).not.toHaveProperty('i18n');
    }
  });

  it('zh-CN 下三种方式均为 保存', () => {
    for (const page of [inline, keyRef, binding]) {
      const out = localize(page, {
        locale: 'zh-CN',
        languageBundles: { current: bundles.fallbacks[0]!, fallbacks: [bundles.current] },
      });
      expect(out.body).toMatchObject({ props: { text: '保存' } });
    }
  });

  it('输出通过下发态校验（无 $i18n 残留）', () => {
    for (const page of [inline, keyRef, binding]) {
      const out = localize(page, { languageBundles: bundles });
      expect(validateLocalizedPageDsl(out).valid).toBe(true);
    }
  });
});

describe('缺失词条回退链（设计第 8 节）', () => {
  const text = (key: string, extra?: Record<string, unknown>) =>
    asPage({
      dsl: '1.0',
      page: { id: 'p' },
      body: { type: 'Button', props: { text: { $i18n: { key, ...extra } } } },
    });

  it('当前语言缺失 → 显式语言级回退包命中（fallback-locale）', () => {
    const diagnostics: LocalizeDiagnostic[] = [];
    const out = localize(text('common.greet'), {
      locale: 'fr-CA',
      languageBundles: {
        current: bundleSet('fr-CA', { common: {} }),
        fallbacks: [
          bundleSet('fr', { common: { 'common.greet': 'Bonjour' } }),
          bundleSet('zh-CN', { common: { 'common.greet': '你好' } }),
        ],
      },
      onDiagnostic: (d) => diagnostics.push(d),
    });
    expect(out.body).toMatchObject({ props: { text: 'Bonjour' } });
    expect(diagnostics).toContainEqual(
      expect.objectContaining({ resolution: 'fallback-locale', key: 'common.greet' }),
    );
  });

  it('回退包也缺失 → defaultLocale 词条（default-locale）', () => {
    const diagnostics: LocalizeDiagnostic[] = [];
    const out = localize(text('common.greet'), {
      languageBundles: {
        current: EMPTY_EN,
        fallbacks: [bundleSet('zh-CN', { common: { 'common.greet': '你好' } })],
      },
      onDiagnostic: (d) => diagnostics.push(d),
    });
    expect(out.body).toMatchObject({ props: { text: '你好' } });
    expect(diagnostics).toContainEqual(expect.objectContaining({ resolution: 'default-locale' }));
  });

  it('全部缺失 → 描述 fallback → key', () => {
    expect(localize(text('common.greet', { fallback: '兜底' })).body).toMatchObject({
      props: { text: '兜底' },
    });
    expect(localize(text('common.greet')).body).toMatchObject({
      props: { text: 'common.greet' },
    });
  });

  it('内联描述全部缺失且无 key → 统一缺失文案并记录诊断', () => {
    const diagnostics: LocalizeDiagnostic[] = [];
    const out = localize(
      asPage({
        dsl: '1.0',
        page: { id: 'p' },
        body: { type: 'Button', props: { text: { $i18n: { messages: { 'fr-FR': 'Salut' } } } } },
      }),
      { onDiagnostic: (d) => diagnostics.push(d) },
    );
    expect(out.body).toMatchObject({ props: { text: MISSING_TRANSLATION_TEXT } });
    expect(diagnostics).toContainEqual(expect.objectContaining({ resolution: 'missing-text' }));
  });

  it('内联 messages 沿显式语言级回退链查找', () => {
    const out = localize(
      asPage({
        dsl: '1.0',
        page: { id: 'p' },
        body: {
          type: 'Button',
          props: { text: { $i18n: { messages: { fr: 'Bonjour', 'zh-CN': '你好' } } } },
        },
      }),
      {
        locale: 'fr-CA',
        languageBundles: {
          current: bundleSet('fr-CA', { common: {} }),
          fallbacks: [bundleSet('fr', { common: {} }), bundleSet('zh-CN', { common: {} })],
        },
      },
    );
    expect(out.body).toMatchObject({ props: { text: 'Bonjour' } });
  });

  it('空字符串视为有效翻译，不触发回退', () => {
    const out = localize(text('common.empty'), {
      languageBundles: { current: bundleSet('en-US', { common: { 'common.empty': '' } }) },
    });
    expect(out.body).toMatchObject({ props: { text: '' } });
  });

  it('译文恰好等于 key 视为命中（不以 value === key 判缺失）', () => {
    const diagnostics: LocalizeDiagnostic[] = [];
    const out = localize(text('common.save'), {
      languageBundles: { current: bundleSet('en-US', { common: { 'common.save': 'common.save' } }) },
      onDiagnostic: (d) => diagnostics.push(d),
    });
    expect(out.body).toMatchObject({ props: { text: 'common.save' } });
    expect(diagnostics).toEqual([]);
  });
});

describe('动态参数与 $localizedText 编译（设计 4.3/7）', () => {
  it('含 ${...} 运行时参数 → 编译为 $localizedText（template 为已选语言词条，params 保留原样）', () => {
    const out = localize(
      asPage({
        dsl: '1.0',
        page: { id: 'p' },
        body: {
          type: 'Text',
          props: {
            text: {
              $i18n: {
                key: 'user.selectedCount',
                params: { count: '${state.selectedCount}' },
                fallback: '已选择 {{count}} 项',
              },
            },
          },
        },
      }),
      {
        languageBundles: {
          current: bundleSet('en-US', { user: { 'user.selectedCount': 'Selected: {{count}}' } }),
        },
      },
    );
    expect(out.body).toMatchObject({
      props: {
        text: {
          $localizedText: {
            template: 'Selected: {{count}}',
            params: { count: '${state.selectedCount}' },
          },
        },
      },
    });
    // 下发态不含翻译 key、其他语言或语言包引用
    expect(validateLocalizedPageDsl(out).valid).toBe(true);
  });

  it('参数全为字面量 → 服务端直接插值输出最终字符串', () => {
    const out = localize(
      asPage({
        dsl: '1.0',
        page: { id: 'p' },
        body: {
          type: 'Text',
          props: {
            text: {
              $i18n: {
                key: 'user.greeting',
                params: { name: 'World', n: 3 },
                fallback: '你好 {{name}}',
              },
            },
          },
        },
      }),
      {
        languageBundles: {
          current: bundleSet('en-US', { user: { 'user.greeting': 'Hello, {{name}} ({{n}})' } }),
        },
      },
    );
    expect(out.body).toMatchObject({ props: { text: 'Hello, World (3)' } });
  });

  it('字面量与表达式混合 → $localizedText，params 原样保留', () => {
    const out = localize(
      asPage({
        dsl: '1.0',
        page: { id: 'p' },
        body: {
          type: 'Text',
          props: {
            text: {
              $i18n: {
                messages: { 'en-US': '{{label}}: {{value}}' },
                params: { label: 'Total', value: '${row.total}' },
              },
            },
          },
        },
      }),
    );
    expect(out.body).toMatchObject({
      props: {
        text: {
          $localizedText: {
            template: '{{label}}: {{value}}',
            params: { label: 'Total', value: '${row.total}' },
          },
        },
      },
    });
  });

  it('未知参数保留 {{name}} 占位符并记录诊断', () => {
    const diagnostics: LocalizeDiagnostic[] = [];
    const out = localize(
      asPage({
        dsl: '1.0',
        page: { id: 'p' },
        body: {
          type: 'Text',
          props: {
            text: { $i18n: { messages: { 'en-US': 'Hello, {{name}}' }, params: {} } },
          },
        },
      }),
      { onDiagnostic: (d) => diagnostics.push(d) },
    );
    expect(out.body).toMatchObject({ props: { text: 'Hello, {{name}}' } });
    expect(diagnostics).toContainEqual(
      expect.objectContaining({ type: 'missing-param', param: 'name', resolution: 'placeholder' }),
    );
  });

  it('无 params 时模板原文直出', () => {
    const out = localize(
      asPage({
        dsl: '1.0',
        page: { id: 'p' },
        body: { type: 'Text', props: { text: { $i18n: { messages: { 'en-US': 'Plain {{x}}' } } } } },
      }),
    );
    expect(out.body).toMatchObject({ props: { text: 'Plain {{x}}' } });
  });
});

describe('${ 注入拒绝（设计第 7 节）', () => {
  it('词条含字面量 ${ → UNSAFE_MESSAGE', () => {
    expect(() =>
      localize(
        asPage({
          dsl: '1.0',
          page: { id: 'p' },
          body: { type: 'Button', props: { text: { $i18n: { key: 'common.evil' } } } },
        }),
        { languageBundles: { current: bundleSet('en-US', { common: { 'common.evil': 'Hi ${x}' } }) } },
      ),
    ).toThrowError(expect.objectContaining({ code: 'UNSAFE_MESSAGE' }));
  });

  it('fallback 含字面量 ${ → UNSAFE_MESSAGE', () => {
    expect(() =>
      localize(
        asPage({
          dsl: '1.0',
          page: { id: 'p' },
          body: {
            type: 'Button',
            props: { text: { $i18n: { key: 'common.missing', fallback: '回退 ${state.x}' } } },
          },
        }),
      ),
    ).toThrowError(expect.objectContaining({ code: 'UNSAFE_MESSAGE' }));
  });


});

describe('不可变性', () => {
  it('输入冻结时转换正常且输入不被修改', () => {
    const page = deepFreeze(
      asPage({
        dsl: '1.0',
        page: { id: 'p', title: '$i18n{common.title:标题}' },
        i18n: { namespaces: ['common'] },
        body: {
          type: 'Button',
          props: {
            text: { $i18n: { key: 'common.save' } },
            label: '保持不变',
          },
          events: { click: { action: 'message', params: { text: { $i18n: { key: 'common.msg' } } } } },
        },
      }),
    );
    const bundles = deepFreeze({
      current: bundleSet('en-US', {
        common: { 'common.save': 'Save', 'common.title': 'Title', 'common.msg': 'Done' },
      }),
      fallbacks: [EMPTY_ZH],
    });
    const snapshot = JSON.stringify(page);
    const out = localize(page, { languageBundles: bundles });
    expect(JSON.stringify(page)).toBe(snapshot);
    expect(out).not.toBe(page);
    expect(out.body).not.toBe(page.body);
    expect(out.page.title).toBe('Title');
    expect(out.body).toMatchObject({ props: { text: 'Save', label: '保持不变' } });
    expect(out.body).toMatchObject({ events: { click: { params: { text: 'Done' } } } });
    expect(out).not.toHaveProperty('i18n');
  });

  it('无 i18n 声明的页面返回内容相等的新对象', () => {
    const page = asPage({
      dsl: '1.0',
      page: { id: 'p' },
      body: { type: 'Button', props: { text: '普通文本' } },
    });
    const out = localize(page);
    expect(out).not.toBe(page);
    expect(out).toEqual(page);
  });
});

describe('重复声明与未注册字段', () => {
  it('未注册字段出现 $i18n → UNREGISTERED_I18N_FIELD（不静默忽略）', () => {
    expect(() =>
      localize(
        asPage({
          dsl: '1.0',
          page: { id: 'p' },
          body: { type: 'Button', props: { name: { $i18n: { key: 'common.save' } } } },
        }),
      ),
    ).toThrowError(expect.objectContaining({ code: 'UNREGISTERED_I18N_FIELD' }));
  });

  it('未知组件 type 的 $i18n 同样报错', () => {
    expect(() =>
      localize(
        asPage({
          dsl: '1.0',
          page: { id: 'p' },
          body: { type: 'CustomWidget', props: { text: { $i18n: { key: 'common.save' } } } },
        }),
      ),
    ).toThrowError(expect.objectContaining({ code: 'UNREGISTERED_I18N_FIELD' }));
  });

  it('数组通配之外的嵌套字段报错（columns[*].dataIndex）', () => {
    expect(() =>
      localize(
        asPage({
          dsl: '1.0',
          page: { id: 'p' },
          body: {
            type: 'Table',
            props: { columns: [{ title: 'A', dataIndex: { $i18n: { key: 'common.save' } } }] },
          },
        }),
      ),
    ).toThrowError(expect.objectContaining({ code: 'UNREGISTERED_I18N_FIELD' }));
  });

  it('自定义 registry 替换默认注册表', () => {
    const registry = new TranslatableFieldRegistry().register('Link', 'props.text');
    const out = localize(
      asPage({
        dsl: '1.0',
        page: { id: 'p' },
        body: { type: 'Link', props: { text: { $i18n: { messages: { 'en-US': 'Go' } } } } },
      }),
      { registry },
    );
    expect(out.body).toMatchObject({ props: { text: 'Go' } });
    // 自定义 registry 下 Button 不再注册
    expect(() =>
      localize(
        asPage({
          dsl: '1.0',
          page: { id: 'p' },
          body: { type: 'Button', props: { text: { $i18n: { key: 'k' } } } },
        }),
        { registry },
      ),
    ).toThrowError(expect.objectContaining({ code: 'UNREGISTERED_I18N_FIELD' }));
  });
});

describe('注册字段转换：数组通配与动作参数（设计 4.4）', () => {
  const bundles = {
    current: bundleSet('en-US', {
      common: { 'col.name': 'Name', 'col.age': 'Age', 'opt.a': 'Option A' },
    }),
  };

  it('Table columns[*].title 逐项转换，其他字段原样', () => {
    const out = localize(
      asPage({
        dsl: '1.0',
        page: { id: 'p' },
        body: {
          type: 'Table',
          props: {
            columns: [
              { title: { $i18n: { key: 'col.name' } }, dataIndex: 'name' },
              { title: { $i18n: { key: 'col.age' } }, dataIndex: 'age' },
              { title: '静态列', dataIndex: 'static' },
            ],
          },
        },
      }),
      { languageBundles: bundles },
    );
    expect(out.body).toMatchObject({
      props: {
        columns: [
          { title: 'Name', dataIndex: 'name' },
          { title: 'Age', dataIndex: 'age' },
          { title: '静态列', dataIndex: 'static' },
        ],
      },
    });
  });

  it('Select options[*].label 转换，value 原样', () => {
    const out = localize(
      asPage({
        dsl: '1.0',
        page: { id: 'p' },
        body: {
          type: 'Select',
          props: { options: [{ label: { $i18n: { key: 'opt.a' } }, value: 'a' }] },
        },
      }),
      { languageBundles: bundles },
    );
    expect(out.body).toMatchObject({ props: { options: [{ label: 'Option A', value: 'a' }] } });
  });

  it('message / confirm 动作参数转换；未注册动作参数报错', () => {
    const page = asPage({
      dsl: '1.0',
      page: { id: 'p' },
      body: {
        type: 'Button',
        props: { text: 'x' },
        events: {
          click: [
            { action: 'message', params: { text: { $i18n: { messages: { 'en-US': 'Saved' } } } } },
            {
              action: 'confirm',
              params: {
                title: { $i18n: { messages: { 'en-US': 'Sure?' } } },
                content: { $i18n: { messages: { 'en-US': 'Cannot undo' } } },
              },
            },
          ],
        },
      },
    });
    const out = localize(page);
    expect(out.body).toMatchObject({
      events: {
        click: [{ params: { text: 'Saved' } }, { params: { title: 'Sure?', content: 'Cannot undo' } }],
      },
    });

    expect(() =>
      localize(
        asPage({
          dsl: '1.0',
          page: { id: 'p' },
          body: {
            type: 'Button',
            props: { text: 'x' },
            events: { click: { action: 'message', params: { url: { $i18n: { key: 'k' } } } } },
          },
        }),
      ),
    ).toThrowError(expect.objectContaining({ code: 'UNREGISTERED_I18N_FIELD' }));
  });

  it('页面级 actions / lifecycle / 命名组件与引用节点一并转换', () => {
    const out = localize(
      asPage({
        dsl: '1.0',
        page: { id: 'p' },
        actions: { notify: { action: 'message', params: { text: { $i18n: { key: 'common.msg' } } } } },
        lifecycle: { onInit: { action: 'confirm', params: { title: { $i18n: { key: 'common.t' } } } } },
        components: {
          SaveButton: { type: 'Button', props: { text: { $i18n: { key: 'common.save' } } } },
        },
        body: { component: 'SaveButton', props: { text: { $i18n: { key: 'common.save2' } } } },
      }),
      {
        languageBundles: {
          current: bundleSet('en-US', {
            common: {
              'common.msg': 'Done',
              'common.t': 'Confirm',
              'common.save': 'Save',
              'common.save2': 'Save!',
            },
          }),
        },
      },
    );
    expect(out.actions).toMatchObject({ notify: { params: { text: 'Done' } } });
    expect(out.lifecycle).toMatchObject({ onInit: { params: { title: 'Confirm' } } });
    expect(out.components).toMatchObject({ SaveButton: { props: { text: 'Save' } } });
    expect(out.body).toMatchObject({ props: { text: 'Save!' } });
  });
});

describe('遍历范围之外的 $i18n 不静默透传（残留扫描）', () => {
  const evil = { $i18n: { key: 'common.save' } };

  it('$i18n 位于 state / dataSources / meta → UNREGISTERED_I18N_FIELD', () => {
    for (const extra of [
      { state: { label: evil } },
      { dataSources: { ds: { type: 'static', value: { label: evil } } } },
      { meta: { label: evil } },
    ]) {
      expect(() => localize(asPage({ dsl: '1.0', page: { id: 'p' }, ...extra }))).toThrowError(
        expect.objectContaining({ code: 'UNREGISTERED_I18N_FIELD' }),
      );
    }
  });

  it('$i18n 位于节点未遍历字段（permission / when）→ UNREGISTERED_I18N_FIELD', () => {
    for (const node of [
      { type: 'Button', props: { text: 'x' }, permission: evil },
      { type: 'Button', props: { text: 'x' }, when: { expression: evil } },
    ]) {
      expect(() => localize(asPage({ dsl: '1.0', page: { id: 'p' }, body: node }))).toThrowError(
        expect.objectContaining({ code: 'UNREGISTERED_I18N_FIELD' }),
      );
    }
  });

  it('已合法转换的 $localizedText 输出不被误伤', () => {
    const out = localize(
      asPage({
        dsl: '1.0',
        page: { id: 'p' },
        body: {
          type: 'Text',
          props: {
            text: {
              $i18n: { messages: { 'en-US': '{{count}} items' }, params: { count: '${state.n}' } },
            },
          },
        },
      }),
    );
    expect(out.body).toMatchObject({
      props: { text: { $localizedText: { template: '{{count}} items' } } },
    });
  });
});

describe('诊断与输入校验', () => {
  it('onDiagnostic 可选；未提供时不影响转换', () => {
    const spy = vi.fn();
    localize(
      asPage({
        dsl: '1.0',
        page: { id: 'p' },
        body: { type: 'Button', props: { text: { $i18n: { key: 'missing.key' } } } },
      }),
      { onDiagnostic: spy },
    );
    expect(spy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'missing-translation',
        key: 'missing.key',
        resolution: 'key',
        locale: 'en-US',
      }),
    );
  });

  it('locale / defaultLocale 缺失 → INVALID_LOCALE', () => {
    const page = asPage({ dsl: '1.0', page: { id: 'p' } });
    expect(() =>
      localizePageDsl({
        page,
        locale: '',
        defaultLocale: 'zh-CN',
        languageBundles: { current: EMPTY_EN },
      }),
    ).toThrowError(expect.objectContaining({ code: 'INVALID_LOCALE' }));
  });
});
