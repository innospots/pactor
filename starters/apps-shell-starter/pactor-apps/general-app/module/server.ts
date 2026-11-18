/**
 * 模块服务端入口：Shell 通过 /api/modules/<moduleId>/* 统一分发到此处。
 * 逻辑路径为原始 /api/general-app/*，由分发器还原后按 `:param` 深度匹配。
 */
import { createBusinessApiHandlers } from "@/backend/api/handlers";

export const handlers = createBusinessApiHandlers();
