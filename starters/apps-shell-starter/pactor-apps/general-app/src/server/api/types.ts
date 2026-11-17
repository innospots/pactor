/**
 * 模块 server 契约类型。
 *
 * 与 Shell 侧 `@pactor-app/shell/server` 的结构保持一致，但模块不反向
 * import 宿主包（模块工程可独立运行、独立打包）。
 */

export type ModuleApiMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE"
  | "HEAD"
  | "OPTIONS";

export interface ModuleApiContext {
  moduleId: string;
  /** 逻辑 URL：原始 /api/... 路径 + query（不是 /api/modules/... 挂载 URL） */
  url: URL;
  /** :param 段解析结果 */
  params: Record<string, string>;
}

export type ModuleApiHandler = (
  request: Request,
  context: ModuleApiContext,
) => Response | Promise<Response>;

export type ModuleApiHandlers = Record<
  string,
  Partial<Record<ModuleApiMethod, ModuleApiHandler>>
>;
