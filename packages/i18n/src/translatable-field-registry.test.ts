import { describe, expect, it } from 'vitest';

import { I18nError } from './errors.js';
import {
  createDefaultTranslatableFieldRegistry,
  TranslatableFieldRegistry,
} from './translatable-field-registry.js';

describe('TranslatableFieldRegistry 注册与匹配', () => {
  it('注册普通字段与数组通配字段', () => {
    const registry = new TranslatableFieldRegistry();
    registry.register('Card', ['props.title', 'props.items[*].label']);
    expect(registry.isTranslatable('Card', 'props.title')).toBe(true);
    expect(registry.isTranslatable('Card', 'props.items[*].label')).toBe(true);
    expect(registry.isTranslatable('Card', 'props.items[*].value')).toBe(false);
    expect(registry.isTranslatable('Card', 'props.name')).toBe(false);
  });

  it('重复注册同一 type 累积合并', () => {
    const registry = new TranslatableFieldRegistry();
    registry.register('Card', 'props.title');
    registry.register('Card', ['props.subtitle']);
    expect(registry.isTranslatable('Card', 'props.title')).toBe(true);
    expect(registry.isTranslatable('Card', 'props.subtitle')).toBe(true);
    expect(registry.registeredComponents()).toEqual(['Card']);
  });

  it('未注册 type / undefined type 一律不匹配', () => {
    const registry = new TranslatableFieldRegistry();
    registry.register('Card', 'props.title');
    expect(registry.isTranslatable('Other', 'props.title')).toBe(false);
    expect(registry.isTranslatable(undefined, 'props.title')).toBe(false);
  });

  it('注册动作字段', () => {
    const registry = new TranslatableFieldRegistry();
    registry.registerAction('notify', ['params.text', 'params.list[*].label']);
    expect(registry.isTranslatableActionField('notify', 'params.text')).toBe(true);
    expect(registry.isTranslatableActionField('notify', 'params.list[*].label')).toBe(true);
    expect(registry.isTranslatableActionField('notify', 'params.url')).toBe(false);
    expect(registry.isTranslatableActionField('other', 'params.text')).toBe(false);
    expect(registry.registeredActions()).toEqual(['notify']);
  });

  it('组件字段路径必须以 props. 开头', () => {
    const registry = new TranslatableFieldRegistry();
    for (const bad of ['text', 'params.text', '', 'props', '.props.text']) {
      expect(() => registry.register('Card', bad)).toThrowError(
        expect.objectContaining({ code: 'INVALID_FIELD_PATH' }),
      );
    }
  });

  it('动作字段路径必须以 params. 开头', () => {
    const registry = new TranslatableFieldRegistry();
    expect(() => registry.registerAction('notify', 'props.text')).toThrowError(
      expect.objectContaining({ code: 'INVALID_FIELD_PATH' }),
    );
  });

  it('非法段（空段、孤立方括号、多个通配后缀）被拒绝', () => {
    const registry = new TranslatableFieldRegistry();
    for (const bad of ['props..text', 'props.columns[*][*].title', 'props.[*].title', 'props.a[*extra].b']) {
      expect(() => registry.register('Card', bad)).toThrowError(
        expect.objectContaining({ code: 'INVALID_FIELD_PATH' }),
      );
    }
  });

  it('组件 type / 动作名必须为非空字符串', () => {
    const registry = new TranslatableFieldRegistry();
    expect(() => registry.register('', 'props.text')).toThrowError(I18nError);
    expect(() => registry.registerAction('', 'params.text')).toThrowError(I18nError);
  });
});

describe('内置注册表（设计 4.4 常用展示字段）', () => {
  const registry = createDefaultTranslatableFieldRegistry();

  it('Button/Text/Input 常用字段', () => {
    expect(registry.isTranslatable('Button', 'props.text')).toBe(true);
    expect(registry.isTranslatable('Button', 'props.ariaLabel')).toBe(true);
    expect(registry.isTranslatable('Text', 'props.text')).toBe(true);
    expect(registry.isTranslatable('Input', 'props.label')).toBe(true);
    expect(registry.isTranslatable('Input', 'props.placeholder')).toBe(true);
    expect(registry.isTranslatable('Input', 'props.description')).toBe(true);
  });

  it('Table 列与 Select 选项', () => {
    expect(registry.isTranslatable('Table', 'props.columns[*].title')).toBe(true);
    expect(registry.isTranslatable('Table', 'props.columns[*].dataIndex')).toBe(false);
    expect(registry.isTranslatable('Select', 'props.options[*].label')).toBe(true);
    expect(registry.isTranslatable('Select', 'props.options[*].value')).toBe(false);
  });

  it('内置动作：message / confirm', () => {
    expect(registry.isTranslatableActionField('message', 'params.text')).toBe(true);
    expect(registry.isTranslatableActionField('confirm', 'params.title')).toBe(true);
    expect(registry.isTranslatableActionField('confirm', 'params.content')).toBe(true);
    expect(registry.isTranslatableActionField('confirm', 'params.onOk')).toBe(false);
  });

  it('不可翻译字段不注册（name/value/variant/className）', () => {
    for (const field of ['props.name', 'props.value', 'props.variant', 'props.className']) {
      expect(registry.isTranslatable('Button', field)).toBe(false);
      expect(registry.isTranslatable('Input', field)).toBe(false);
    }
  });
});
