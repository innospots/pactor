/**
 * 资源加载错误：HTTP 非 2xx/304、资源不存在等场景抛出。
 */
export class ResourceError extends Error {
  /** HTTP 状态码（网络层错误时可能缺省） */
  readonly status?: number;
  /** 底层错误（如网络异常） */
  readonly cause?: unknown;

  constructor(message: string, options?: { status?: number; cause?: unknown }) {
    super(message);
    this.name = 'ResourceError';
    this.status = options?.status;
    this.cause = options?.cause;
  }
}
