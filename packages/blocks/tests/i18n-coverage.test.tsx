// @vitest-environment jsdom
/**
 * blocks 内置文案国际化覆盖（spec: i18n「内置组件默认文案国际化」）：
 * 缺省（无 Provider）保持中文；Provider locale=en-US 时渲染英文。
 */
import { createI18nContext } from '@pactor-app/core';
import { I18nContextProvider } from '@pactor-app/runtime';
import { cleanup, render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import { afterEach, describe, expect, it } from 'vitest';

import { FieldCondition } from '../src/components/FieldCondition/index.js';

afterEach(cleanup);

const fields = [
  {
    featureCode: 'decisionScore',
    featureName: '决策评分',
    fieldType: 'NUMBER',
    recommended: false,
  },
];

function withLocale(locale: string, children: ReactNode): ReactNode {
  const i18n = createI18nContext({ locale, messages: {} });
  return (
    <I18nContextProvider value={i18n}>{children}</I18nContextProvider>
  );
}

describe('i18n 覆盖：FieldCondition', () => {
  it('缺省中文：添加条件', () => {
    render(<FieldCondition fields={fields} onChange={() => {}} />);
    expect(screen.getByText('添加条件')).toBeTruthy();
  });

  it('en-US：Add condition', () => {
    render(
      withLocale(
        'en-US',
        <FieldCondition fields={fields} onChange={() => {}} />,
      ),
    );
    expect(screen.getByText('Add condition')).toBeTruthy();
  });
});
