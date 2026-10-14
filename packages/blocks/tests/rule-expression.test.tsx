// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { RuleExpression } from '../src/components/RuleExpression/index.js';

afterEach(cleanup);

const options = [
  { label: '交易金额', value: 'tradeAmt' },
  { label: '交易次数', value: 'tradeCnt' },
  { label: '年龄', value: 'age' },
];

const renderExpr = (onChange = vi.fn(), value: any = null) => {
  render(
    <RuleExpression
      options={options}
      value={value}
      onChange={onChange}
      placeholder="请输入规则表达式"
    />,
  );
  const ed = screen.getByRole('textbox') as HTMLDivElement;
  fireEvent.focus(ed);
  return { ed, onChange };
};

const setCaret = (node: Node, offset: number) => {
  const sel = window.getSelection()!;
  const range = document.createRange();
  range.setStart(node, offset);
  range.collapse(true);
  sel.removeAllRanges();
  sel.addRange(range);
};

/** 模拟打字：在光标处插入文本并触发 input（光标不在文本节点时追加到末尾） */
const typeText = (ed: HTMLElement, text: string) => {
  const sel = window.getSelection()!;
  const node = sel.anchorNode;
  const offset = sel.anchorOffset;
  if (node && ed.contains(node) && node.nodeType === Node.TEXT_NODE) {
    const t = node.textContent ?? '';
    node.textContent = t.slice(0, offset) + text + t.slice(offset);
    setCaret(node, offset + text.length);
  } else {
    const tn = document.createTextNode(text);
    ed.appendChild(tn);
    setCaret(tn, text.length);
  }
  fireEvent.input(ed);
};

/** 编辑器中最后一个文本节点 */
const lastTextNode = (ed: HTMLElement): Text => {
  for (let i = ed.childNodes.length - 1; i >= 0; i--) {
    const n = ed.childNodes[i];
    if (n.nodeType === Node.TEXT_NODE) return n as Text;
  }
  throw new Error('no text node');
};

describe('RuleExpression', () => {
  it('输入字符时按 label 匹配特征字段候选', () => {
    const { ed } = renderExpr();
    typeText(ed, '交易');

    expect(screen.getByText('交易金额')).toBeTruthy();
    expect(screen.getByText('交易次数')).toBeTruthy();
    expect(screen.queryByText('年龄')).toBeNull();
  });

  it('回车选中高亮项，选项作为整体 chip 展示', () => {
    const { ed, onChange } = renderExpr();
    typeText(ed, '交易');
    // 默认高亮第一项，回车选中
    fireEvent.keyDown(ed, { key: 'Enter' });

    expect(onChange).toHaveBeenLastCalledWith({
      expression: 'tradeAmt',
      expressionLabel: '交易金额',
      sourceField: ['tradeAmt'],
    });
    // chip 已插入 DOM，输入文本被 chip 替换
    expect(ed.querySelector('[data-value="tradeAmt"]')).not.toBeNull();
  });

  it('按向下键移动高亮，回车选中第二项', () => {
    const { ed, onChange } = renderExpr();
    typeText(ed, '交易');
    fireEvent.keyDown(ed, { key: 'ArrowDown' });
    fireEvent.keyDown(ed, { key: 'Enter' });

    expect(onChange).toHaveBeenLastCalledWith({
      expression: 'tradeCnt',
      expressionLabel: '交易次数',
      sourceField: ['tradeCnt'],
    });
  });

  it('选中字段后可继续输入文本，expression 为整体文字表示', () => {
    const { ed, onChange } = renderExpr();
    typeText(ed, '交易金额');
    fireEvent.keyDown(ed, { key: 'Enter' });
    typeText(ed, ' > 100');

    expect(onChange).toHaveBeenLastCalledWith({
      expression: 'tradeAmt > 100',
      expressionLabel: '交易金额 > 100',
      sourceField: ['tradeAmt'],
    });
  });

  it('chip 之后按退格整体删除该 chip', () => {
    const { ed, onChange } = renderExpr();
    typeText(ed, '交易金额');
    fireEvent.keyDown(ed, { key: 'Enter' });
    onChange.mockClear();

    // 光标在 chip 之后的文本节点开头，退格删除整个 chip
    fireEvent.keyDown(ed, { key: 'Backspace' });
    expect(onChange).toHaveBeenLastCalledWith({
      expression: '',
      expressionLabel: '',
      sourceField: [],
    });
    expect(ed.querySelector('[data-value]')).toBeNull();
  });

  it('没有匹配到特征字段时按字符串处理', () => {
    const { ed, onChange } = renderExpr();
    typeText(ed, 'xyz');

    expect(screen.queryByRole('list')).toBeNull();
    expect(onChange).toHaveBeenLastCalledWith({
      expression: 'xyz',
      expressionLabel: 'xyz',
      sourceField: [],
    });
  });

  it('可连续输入多个特征字段（字段间带操作符，保存时空格分隔）', () => {
    const { ed, onChange } = renderExpr();
    typeText(ed, '交易金额');
    fireEvent.keyDown(ed, { key: 'Enter' });

    // 输入操作符后继续输入第二个字段名，候选按尾部词匹配
    typeText(ed, '>年龄');
    expect(screen.getByRole('list')).toBeTruthy();
    fireEvent.keyDown(ed, { key: 'Enter' });

    expect(onChange).toHaveBeenLastCalledWith({
      expression: 'tradeAmt > age',
      expressionLabel: '交易金额 > 年龄',
      sourceField: ['tradeAmt', 'age'],
    });
  });

  it('字段之间带空格的文本在选中后保留在正确位置', () => {
    const { ed, onChange } = renderExpr();
    typeText(ed, '交易金额');
    fireEvent.keyDown(ed, { key: 'Enter' });
    typeText(ed, ' > 年龄');
    fireEvent.keyDown(ed, { key: 'Enter' });

    expect(onChange).toHaveBeenLastCalledWith({
      expression: 'tradeAmt > age',
      expressionLabel: '交易金额 > 年龄',
      sourceField: ['tradeAmt', 'age'],
    });
  });

  it('退格先整体删字段 chip，再逐字符删除文本', () => {
    const { ed, onChange } = renderExpr();
    typeText(ed, '交易金额');
    fireEvent.keyDown(ed, { key: 'Enter' });
    typeText(ed, '>年龄');
    fireEvent.keyDown(ed, { key: 'Enter' });
    onChange.mockClear();

    // 第一次退格：整体删除“年龄”chip
    fireEvent.keyDown(ed, { key: 'Backspace' });
    expect(onChange).toHaveBeenLastCalledWith({
      expression: 'tradeAmt>',
      expressionLabel: '交易金额>',
      sourceField: ['tradeAmt'],
    });
    // 第二次删除：文本内逐字符删除（浏览器原生行为，表现为输入事件）
    const tn = lastTextNode(ed);
    tn.textContent = '';
    fireEvent.input(ed);
    expect(onChange).toHaveBeenLastCalledWith({
      expression: 'tradeAmt',
      expressionLabel: '交易金额',
      sourceField: ['tradeAmt'],
    });
  });

  it('根据 value.sourceField 初始化 chip', () => {
    const { ed } = renderExpr(vi.fn(), {
      expression: 'tradeAmt > 100',
      expressionLabel: '交易金额 > 100',
      sourceField: ['tradeAmt'],
    });
    // chip 展示 label，expression 其余部分还原为可编辑文本
    expect(ed.querySelector('[data-value="tradeAmt"]')).not.toBeNull();
    expect(ed.textContent).toContain(' > 100');

    // 在末尾文本段开头输入新字段名并选中
    setCaret(lastTextNode(ed), 0);
    typeText(ed, '交易次数');
    fireEvent.keyDown(ed, { key: 'Enter' });

    expect(ed.querySelector('[data-value="tradeCnt"]')).not.toBeNull();
    expect(ed.querySelector('[data-value="tradeAmt"]')).not.toBeNull();
  });

  it('编辑时按 expression 还原字段与操作符文本', () => {
    const onChange = vi.fn();
    const { ed } = renderExpr(onChange, {
      expression: 'tradeAmt+tradeCnt',
      expressionLabel: '交易金额+交易次数',
      sourceField: ['tradeAmt', 'tradeCnt'],
    });

    // 字段还原为 chip，操作符还原为文本
    expect(ed.querySelector('[data-value="tradeAmt"]')).not.toBeNull();
    expect(ed.querySelector('[data-value="tradeCnt"]')).not.toBeNull();
    expect(ed.textContent).toContain('+');

    // 末尾继续输入，序列化结果与原 expression 一致（空格分隔）
    typeText(ed, '1');
    expect(onChange).toHaveBeenLastCalledWith({
      expression: 'tradeAmt + tradeCnt1',
      expressionLabel: '交易金额 + 交易次数1',
      sourceField: ['tradeAmt', 'tradeCnt'],
    });
  });

  it('鼠标点击可在文本中间定位光标，候选按光标前的词匹配', () => {
    const onChange = vi.fn();
    const { ed } = renderExpr(onChange, {
      expression: 'tradeAmt > 100',
      expressionLabel: '交易金额 > 100',
      sourceField: ['tradeAmt'],
    });
    // 把光标点到 " > 100" 的 ">" 之后，输入字段名并选中
    setCaret(lastTextNode(ed), 2);
    typeText(ed, '交易次数');
    fireEvent.keyDown(ed, { key: 'Enter' });

    expect(onChange).toHaveBeenLastCalledWith({
      // chip 插入光标处（">" 与空格之间），光标后的 " 100" 原样保留
      expression: 'tradeAmt > tradeCnt 100',
      expressionLabel: '交易金额 > 交易次数 100',
      sourceField: ['tradeAmt', 'tradeCnt'],
    });
  });

  it('点击 chip 上的删除按钮整体移除该字段', () => {
    const { ed, onChange } = renderExpr(vi.fn(), {
      expression: 'tradeAmt+tradeCnt',
      expressionLabel: '交易金额+交易次数',
      sourceField: ['tradeAmt', 'tradeCnt'],
    });
    onChange.mockClear();

    const btn = ed.querySelector(
      '[data-value="tradeAmt"] [data-remove]',
    ) as HTMLElement;
    fireEvent.click(btn);

    expect(ed.querySelector('[data-value="tradeAmt"]')).toBeNull();
    expect(ed.querySelector('[data-value="tradeCnt"]')).not.toBeNull();
    expect(onChange).toHaveBeenLastCalledWith({
      // 剩余的操作符与字段之间空格分隔
      expression: '+ tradeCnt',
      expressionLabel: '+ 交易次数',
      sourceField: ['tradeCnt'],
    });
  });

  it('鼠标点击候选项选中字段（mousedown 不抢夺编辑器焦点与选区）', () => {
    const { ed, onChange } = renderExpr();
    typeText(ed, '交易');

    const option = screen.getByText('交易金额');
    // mousedown 必须 preventDefault，否则编辑器失焦/选区丢失，点击无法选中
    expect(fireEvent.mouseDown(option)).toBe(false);
    fireEvent.click(option);

    expect(onChange).toHaveBeenLastCalledWith({
      expression: 'tradeAmt',
      expressionLabel: '交易金额',
      sourceField: ['tradeAmt'],
    });
    expect(ed.querySelector('[data-value="tradeAmt"]')).not.toBeNull();
  });
});
