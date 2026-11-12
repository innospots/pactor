// @vitest-environment jsdom
import './setup.js';

import { cleanup, fireEvent, render } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Upload, type UploadFileMeta } from '../../src/components/components/Upload/index.js';

afterEach(cleanup);

function pickFiles(input: HTMLInputElement, files: File[]) {
  Object.defineProperty(input, 'files', { value: files, configurable: true });
  fireEvent.change(input);
}

function fileInput(container: HTMLElement): HTMLInputElement {
  return container.querySelector('input[type=file]') as HTMLInputElement;
}

describe('Upload keepFiles', () => {
  it('默认只给元数据，不带 File（字段值保持可序列化）', () => {
    const onChange = vi.fn();
    const { container } = render(<Upload onChange={onChange} accept=".csv" />);
    pickFiles(fileInput(container), [new File(['a,b\n1,2'], 'train.csv', { type: 'text/csv' })]);

    expect(onChange).toHaveBeenCalledTimes(1);
    const value = onChange.mock.calls[0]![0] as UploadFileMeta[];
    expect(value).toHaveLength(1);
    expect(value[0]).toMatchObject({ name: 'train.csv', type: 'text/csv' });
    expect(value[0]!.raw).toBeUndefined();
    expect(JSON.parse(JSON.stringify(value))).toEqual([
      { name: 'train.csv', size: expect.any(Number), type: 'text/csv' },
    ]);
  });

  it('keepFiles 时元数据带原始 File，可读出字节', async () => {
    const onChange = vi.fn();
    const { container } = render(<Upload keepFiles onChange={onChange} accept=".csv" />);
    const file = new File(['a,b\n1,2\n'], 'train.csv', { type: 'text/csv' });
    pickFiles(fileInput(container), [file]);

    const value = onChange.mock.calls[0]![0] as UploadFileMeta[];
    expect(value[0]!.raw).toBe(file);
    expect(await value[0]!.raw!.text()).toBe('a,b\n1,2\n');
  });

  it('keepFiles 与 accept / maxSize 校验共存：不合规文件不进入列表', () => {
    const onChange = vi.fn();
    const { container } = render(<Upload keepFiles accept=".csv" maxSize={4} onChange={onChange} />);
    pickFiles(fileInput(container), [new File(['0123456789'], 'big.csv', { type: 'text/csv' })]);
    expect(onChange).not.toHaveBeenCalled();
  });

  it('multiple + keepFiles：多选时 File 与元数据一一对应', () => {
    const onChange = vi.fn();
    const { container } = render(<Upload keepFiles multiple onChange={onChange} />);
    const first = new File(['a'], 'train.csv', { type: 'text/csv' });
    const second = new File(['b'], 'valid.csv', { type: 'text/csv' });
    pickFiles(fileInput(container), [first, second]);

    const value = onChange.mock.calls[0]![0] as UploadFileMeta[];
    expect(value.map((item) => item.name)).toEqual(['train.csv', 'valid.csv']);
    expect(value.map((item) => item.raw)).toEqual([first, second]);
  });
});
