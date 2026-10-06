/**
 * 页面 DSL 的 service 数据源注册表（
 * `services={{...}}` 包装层），经 SitemapApp 的 `services` prop 全局注册。
 * 实现为 mock（src/pactor/mocks/）；
 * 列表类服务负责把 DSL 的一族布尔快筛参数还原为数组（表达式引擎不支持数组方法）。
 */
import type { ServiceHandler } from "@pactor-app/runtime";

import { queryDashboard } from "./mocks/dashboard-mock";
import {
  getProvider,
  pullProviderModels,
  queryProviders,
} from "./mocks/providers-mock";
import { getModel, queryModels } from "./mocks/models-mock";
import { getRoute, queryRoutes } from "./mocks/routes-mock";
import {
  CLIENT_TAG_FILTERS,
  clientsByTemplate,
  getClient,
  queryClients,
} from "./mocks/clients-mock";
import {
  CLIENT_TEMPLATE_TAG_FILTERS,
  getClientTemplate,
  queryClientTemplates,
} from "./mocks/client-templates-mock";
import { getCallLog, queryCallLogs } from "./mocks/call-logs-mock";
import { getCost, queryCosts } from "./mocks/costs-mock";
import { getAudit, listAuditOperators, queryAudits } from "./mocks/audit-mock";
import {
  getDataListItem,
  queryDataList,
  saveDataListItem,
} from "./mocks/data-list-mock";
import {
  queryAvailability,
  queryClientUsage,
  queryModelUsage,
  queryProviderUsage,
} from "./mocks/ops-usage-mock";

function str(value: unknown): string {
  return typeof value === "string" ? value : "";
}

function opt(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

/** 标签 state 键：连字符转下划线（如 team-default → tag_team_default） */
const tagKey = (value: string) => `tag_${value.replace(/-/g, "_")}`;

/** 快筛值数组：service 直调为数组，http query 序列化后为逗号串；空值返回 undefined */
function strList(value: unknown): string[] | undefined {
  if (Array.isArray(value)) {
    return value.filter((v): v is string => typeof v === "string" && v !== "");
  }
  if (typeof value === "string") return value.split(",").filter(Boolean);
  return undefined;
}

export const pactorServices: Record<string, ServiceHandler> = {
  "dashboard.query": (params) =>
    queryDashboard(str(params.start), str(params.end)),

  // 类型多选：ChipFilter 以 types 数组（http 侧序列化为逗号串）提交；
  // 旧版 DSL 一族一个布尔参数的写法保留兼容，这里还原为 family 数组
  "provider.list": (params) =>
    queryProviders({
      keyword: str(params.keyword),
      status: str(params.status) || "all",
      types:
        strList(params.types) ??
        ["openai", "anthropic", "gemini", "dashscope"].filter(
          (f) => params[f] === true,
        ),
    }),
  "provider.detail": (params) => getProvider(str(params.code)),
  "provider.pullModels": (params) => pullProviderModels(str(params.code)),

  // 厂商多选：ChipFilter 以 providers 数组（http 侧序列化为逗号串）提交；
  // 旧版 DSL 一个 Provider 一个布尔参数的写法保留兼容
  "model.list": (params) =>
    queryModels({
      type: str(params.type) || "all",
      providers:
        strList(params.providers) ??
        ["dashscope", "gemini", "openai"].filter((p) => params[p] === true),
    }),
  "model.detail": (params) => getModel(str(params.code)),

  // 标签多选：ChipFilter 以 tags 数组（http 侧序列化为逗号串）提交；
  // 旧版 DSL 一个标签一个布尔参数（连字符转下划线）的写法保留兼容
  "route.list": (params) =>
    queryRoutes({
      status: str(params.status) || "all",
      type: str(params.type) || "all",
      tags:
        strList(params.tags) ??
        [
          ["reasoning", "tag_reasoning"],
          ["premium", "tag_premium"],
          ["general", "tag_general"],
          ["coding", "tag_coding"],
          ["low-cost", "tag_low_cost"],
          ["mobile", "tag_mobile"],
          ["vision", "tag_vision"],
          ["embedding", "tag_embedding"],
        ]
          .filter(([, k]) => params[k] === true)
          .map(([t]) => t),
    }),
  "route.detail": (params) => getRoute(str(params.code)),

  "client.list": (params) =>
    queryClients({
      status: str(params.status) || "all",
      name: str(params.name),
      code: str(params.code),
      // ChipFilter 以 tags 数组（http 侧为逗号串）提交；旧布尔族写法保留兼容
      tags:
        strList(params.tags) ??
        CLIENT_TAG_FILTERS.filter((t) => params[tagKey(t.value)] === true).map(
          (t) => t.value,
        ),
    }),
  "client.detail": (params) => getClient(str(params.code)),

  "clientTemplate.list": (params) =>
    queryClientTemplates({
      status: str(params.status) || "all",
      keyword: str(params.keyword),
      tags:
        strList(params.tags) ??
        CLIENT_TEMPLATE_TAG_FILTERS.filter(
          (t) => params[tagKey(t.value)] === true,
        ).map((t) => t.value),
    }),
  "clientTemplate.detail": (params) => getClientTemplate(str(params.code)),
  "clientTemplate.createdClients": (params) =>
    clientsByTemplate(str(params.code)),

  "callLog.list": (params) =>
    queryCallLogs({
      start: opt(params.start),
      end: opt(params.end),
      status: str(params.status) || "all",
      model: str(params.model) || "all",
      provider: str(params.provider) || "all",
      protocol: str(params.protocol) || "all",
      routeGroup: str(params.routeGroup) || "all",
      email: str(params.email),
      appKey: str(params.appKey),
    }),
  "callLog.detail": (params) => getCallLog(str(params.id)),

  "cost.list": (params) =>
    queryCosts({
      application: str(params.application),
      appKey: str(params.appKey),
      alias: str(params.alias),
      model: str(params.model) || "all",
      provider: str(params.provider) || "all",
      start: opt(params.start),
      end: opt(params.end),
    }),
  "cost.detail": (params) => getCost(str(params.id)),

  "audit.list": (params) =>
    queryAudits({
      start: opt(params.start),
      end: opt(params.end),
      operator: str(params.operator) || "all",
      operation: str(params.operation) || "all",
      resourceType: str(params.resourceType) || "all",
      resourceId: str(params.resourceId),
    }),
  "audit.detail": (params) => getAudit(str(params.id)) ?? null,
  "audit.operators": () => listAuditOperators(),

  "ops.modelUsage": (params) =>
    queryModelUsage({ start: opt(params.start), end: opt(params.end) }),
  "ops.providerUsage": (params) =>
    queryProviderUsage({ start: opt(params.start), end: opt(params.end) }),
  "ops.clientUsage": (params) =>
    queryClientUsage({ start: opt(params.start), end: opt(params.end) }),
  "ops.availability": (params) =>
    queryAvailability({ start: opt(params.start), end: opt(params.end) }),

  // 数据列表骨架示例（yaml/models/data-list.yaml）；生成业务列表页时成组复制改名
  "dataList.list": (params) =>
    queryDataList({
      keyword: str(params.keyword),
      status: str(params.status) || "all",
    }),
  "dataList.detail": (params) => getDataListItem(str(params.code)),
  "dataList.save": (params) =>
    saveDataListItem(params as Parameters<typeof saveDataListItem>[0]),
};
