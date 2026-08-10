/** 表达式语法 / 求值错误，携带源码位置信息 */
export class ExpressionError extends Error {
  constructor(
    message: string,
    public readonly pos?: number,
  ) {
    super(pos === undefined ? message : `${message} (at position ${pos})`);
    this.name = 'ExpressionError';
  }
}
