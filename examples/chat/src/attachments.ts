import { createChatId, type ChatAttachment } from '@pactor/chat';

/**
 * 把 File 读成 data URL，产出 ChatAttachment（伪上传：无网络，引用留在内存）
 */
export function readAsAttachment(file: File): Promise<ChatAttachment> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () =>
      resolve({
        id: createChatId('attachment'),
        name: file.name,
        mimeType: file.type || 'application/octet-stream',
        size: file.size,
        url: typeof reader.result === 'string' ? reader.result : undefined,
      });
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}
