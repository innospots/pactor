/**
 * `initModule`：目标工程接入面的一次性初始化（幂等、只新增不破坏）：
 * - 生成 pactor.module.json（已存在则跳过）；
 * - 生成 module/client.ts + module/module.css（已存在则跳过）；
 * - `--server` 时额外生成 module/server.ts 并在新建配置中写入 serverEntry / apiPrefixes；
 * - 向 package.json 注入 files / exports / scripts / peerDependencies
 *   （已存在的字段不覆盖，冲突时 warning）。
 * 绝不修改目标工程 app/、src/ 下的任何现有文件。
 */
/** 生成的模块样式入口（与 client entry 同属脚手架，由 client.ts import） */
export declare const CLIENT_STYLES_ENTRY = "module/module.css";
/** 默认 server 入口（仅 `init --server` 生成） */
export declare const SERVER_ENTRY = "module/server.ts";
export interface InitModuleOptions {
    /** 目标工程根（默认 cwd） */
    dir?: string;
    /**
     * 覆盖已存在的初始化文件（pactor.module.json / module/client.ts / 脚手架样式，
     * --server 时含 module/server.ts）。
     * 缺省 false 时跳过已存在文件；由 CLI 负责询问用户后传入。
     */
    overwrite?: boolean;
    /**
     * 额外生成 module/server.ts，并在新建的 pactor.module.json 中写入
     * serverEntry 与 apiPrefixes（默认 /api/<模块 slug>）。
     * 缺省 false：纯 DSL 模块不引入 server entry。
     */
    server?: boolean;
}
export interface InitModuleResult {
    created: string[];
    /** overwrite 时重新生成（覆盖）的文件 */
    overwritten: string[];
    skipped: string[];
    warnings: string[];
}
interface ActionSource {
    /** 工程相对导入路径（无扩展名，如 ../src/pactor/risk-actions） */
    specifier: string;
    /** 具名导出（如 riskActions） */
    exports: string[];
}
/** 执行初始化，返回创建 / 覆盖 / 跳过 / 告警清单 */
export declare function initModule(options?: InitModuleOptions): InitModuleResult;
/** 模块 id 统一前缀（缺省自动补齐，已有则不重复添加） */
export declare const MODULE_ID_PREFIX = "pactor-app-";
/** 从包名推导模块 id：去 scope、kebab 化、补 pactor-app- 前缀 */
export declare function deriveModuleId(name: unknown): string;
/** 由模块 id 推导默认 API 前缀：/api/<去掉 pactor-app- 前缀的 slug> */
export declare function deriveApiPrefix(moduleId: string): string;
/** 扫描 src/pactor/*-actions.ts 的具名导出（export const xxx） */
export declare function discoverActions(projectDir: string): ActionSource[];
/** 检测 src/pactor/components/index.ts 是否导出 pactorComponents */
export declare function discoverComponents(projectDir: string): boolean;
/** 生成 module/client.ts 内容（export const extensions = { components, actions }） */
export declare function renderClientEntry(hasComponents: boolean, actions: ActionSource[]): string;
/** 生成 module/module.css 内容（模块自带样式入口，随 client bundle 打进 tgz） */
export declare function renderModuleStyles(): string;
/** 生成 module/server.ts 内容（逻辑路径 → 方法处理函数映射） */
export declare function renderServerEntry(moduleId: string): string;
export {};
