import type { ComponentType } from "react";

import type { ActionHandler } from "@pactor-app/runtime";

export type ModuleExtensionBundle = {
  components?: Record<string, ComponentType<unknown>>;
  actions?: Record<string, ActionHandler>;
};

function mergeExtensionRecord<T>(
  extensions: Record<string, ModuleExtensionBundle>,
  pick: (bundle: ModuleExtensionBundle) => Record<string, T> | undefined,
  label: string,
): Record<string, T> {
  const merged: Record<string, T> = {};
  for (const [moduleId, bundle] of Object.entries(extensions)) {
    for (const [key, value] of Object.entries(pick(bundle) ?? {})) {
      const namespacedKey = `${moduleId}/${key}`;
      if (merged[namespacedKey] || merged[key]) {
        console.warn(
          `[shell] ${label}注册冲突：${key}（模块 ${moduleId}），已使用命名空间键 ${namespacedKey}`,
        );
      }
      merged[namespacedKey] = value;
      merged[key] ??= value;
    }
  }
  return merged;
}

export function mergeModuleComponents(
  extensions: Record<string, ModuleExtensionBundle>,
): Record<string, ComponentType<unknown>> {
  return mergeExtensionRecord(
    extensions,
    (b) => b.components as Record<string, ComponentType<unknown>>,
    "组件",
  );
}

export function mergeModuleActions(
  extensions: Record<string, ModuleExtensionBundle>,
): Record<string, ActionHandler> {
  return mergeExtensionRecord(extensions, (b) => b.actions, "动作");
}
