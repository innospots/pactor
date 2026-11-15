import { createModuleDApiHandlers } from "../src/backend/mock/module-api-handlers";

export type {
  ModuleApiContext,
  ModuleApiHandler,
  ModuleApiHandlers,
  ModuleApiMethod,
} from "../src/backend/mock/module-api-handlers";

/** 原型业务接口：与独立模式 src/app/api/d 共用 mockBusinessData */
export const handlers = createModuleDApiHandlers();
