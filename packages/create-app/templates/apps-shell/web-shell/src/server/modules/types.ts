/**
 * 模块服务端 API 契约。
 *
 * 模块侧在各自的 module/server.ts 中本地定义同一结构（不跨仓库 import）。
 * Shell 装配器把模块的 handlers 静态收进 server-registry，并由
 * /api/modules/<moduleId>/* 统一分发。
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

export type ModuleServerRegistryEntry = {
  moduleId: string;
  package: string;
  prefixes: string[];
  handlers: ModuleApiHandlers;
};

export type ModuleServerRegistry = Record<string, ModuleServerRegistryEntry>;

/** .generated/pactor/servers.json 的结构（供构建期校验脚本读取） */
export type ServersIndexFile = {
  modules: {
    moduleId: string;
    package: string;
    prefixes: string[];
  }[];
};
