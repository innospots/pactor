import { describe, expect, it } from 'vitest';
import { localizePageDsl } from './dsl-localizer.js';

const bundle = { appId: 'app', locale: 'en-US', release: '1', format: 'simple-v1' as const, bundles: { common: { version: '1', messages: { 'editor.title': 'Editor', 'common.save': 'Save' } } } };
const localize = (page: any) => localizePageDsl({ page, locale: 'en-US', defaultLocale: 'zh-CN', languageBundles: { current: bundle } });

describe('field shorthand', () => {
  it('translates metadata and registered component fields without mutating source', () => {
    const page = { dsl: '1.0', page: { id: 'editor', title: '$i18n{editor.title:编辑器}' }, body: { type: 'Button', props: { text: '$i18n{common.save:保存}' } } };
    const result = localize(page);
    expect(result.page.title).toBe('Editor');
    expect(result.body?.props?.text).toBe('Save');
    expect(page.page.title).toBe('$i18n{editor.title:编辑器}');
  });
  it('handles fallback, escaping, and colons', () => {
    const page = { dsl: '1.0', page: { id: 'x', title: '$i18n{missing.key:a:b\\}c}' } };
    expect(localize(page).page.title).toBe('a:b}c');
  });
  it('rejects malformed and unregistered fields', () => {
    expect(() => localize({ dsl: '1.0', page: { id: 'x', title: '$i18n{broken}' } })).toThrow();
    expect(() => localize({ dsl: '1.0', page: { id: 'x', title: 'x' }, body: { type: 'Button', props: { href: '$i18n{x:y}' } } })).toThrow();
    expect(() => localize({ dsl: '1.0', page: { id: 'x', title: 'x' }, i18n: { bindings: {} } })).toThrow();
    expect(() => localize({ dsl: '1.0', page: { id: '$i18n{x:y}', title: 'x' } })).toThrow();
    expect(() => localize({ dsl: '1.0', page: { id: 'x', title: '$i18n{x:${state.secret}}' } })).toThrow();
    expect(() => localize({ dsl: '1.0', page: { id: 'x', title: '$i18n{x:y}suffix' } })).toThrow();
  });
  it('converts nested action text and embedded component text', () => {
    const page = { dsl: '1.0', page: { id: 'x', title: 'x' }, body: { type: 'Table', props: { columns: [{ title: '$i18n{common.save:保存}', cell: { type: 'Button', props: { text: '$i18n{common.save:保存}' }, events: { onClick: [{ action: 'if', params: { then: [{ action: 'message', params: { text: '$i18n{common.save:保存}' } }] } }] } } }] } } };
    const out: any = localize(page);
    expect(out.body.props.columns[0].cell.events.onClick[0].params.then[0].params.text).toBe('Save');
    expect(out.body.props.columns[0].cell.props.text).toBe('Save');
  });
});
