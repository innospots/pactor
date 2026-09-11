/** 文本文件下载（Blob + 临时 a[download]） */
export function downloadText(filename: string, text: string, type = 'text/css'): void {
  const url = URL.createObjectURL(new Blob([text], { type }));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
