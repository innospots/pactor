"use client";

import { useMemo } from "react";

import { Tree, type TreeNodeData } from "@pactor-app/ui/components";

import { useI18n } from "@pactor-app/runtime";
import { resolveI18nText } from "../shared/i18n-text";

type CatalogNode = {
  resourceKey?: string | null;
  displayName?: string | Record<string, string> | null;
  children?: CatalogNode[] | null;
};

function normalizeCatalogTreeSource(raw: unknown): CatalogNode[] {
  if (Array.isArray(raw)) {
    return raw as CatalogNode[];
  }
  if (typeof raw === "object" && raw !== null) {
    const record = raw as Record<string, unknown>;
    if (Array.isArray(record.children)) {
      return record.children as CatalogNode[];
    }
    if (Array.isArray(record.data)) {
      return record.data as CatalogNode[];
    }
  }
  return [];
}

export function mapCatalogNodes(nodes: CatalogNode[] | null | undefined, locale: string, defaultLocale: string): TreeNodeData[] {
  if (!Array.isArray(nodes)) {
    return [];
  }
  const mapped: TreeNodeData[] = [];
  for (const raw of nodes) {
    if (raw == null) {
      continue;
    }
    const key = raw.resourceKey?.trim() ?? "";
    if (key.length === 0) {
      continue;
    }
    const title = resolveI18nText(raw.displayName, locale, defaultLocale).trim() || key;
    const children = mapCatalogNodes(raw.children, locale, defaultLocale);
    mapped.push({
      key,
      title,
      ...(children.length > 0 ? { children } : {}),
    });
  }
  return mapped;
}

function collectExpandableKeys(nodes: TreeNodeData[]): string[] {
  const keys: string[] = [];
  for (const node of nodes) {
    keys.push(node.key);
    if (node.children != null && node.children.length > 0) {
      keys.push(...collectExpandableKeys(node.children));
    }
  }
  return keys;
}

export function filterTree(nodes: TreeNodeData[], search: string): TreeNodeData[] {
  const query = search.trim().toLowerCase();
  if (query.length === 0) {
    return nodes;
  }
  const filtered: TreeNodeData[] = [];
  for (const node of nodes) {
    const children = node.children != null ? filterTree(node.children, query) : [];
    const selfMatch =
      node.key.toLowerCase().includes(query) ||
      node.title.toLowerCase().includes(query);
    if (selfMatch || children.length > 0) {
      filtered.push({
        ...node,
        children: children.length > 0 ? children : undefined,
      });
    }
  }
  return filtered;
}

export interface CatalogTreeProps {
  treeData?: unknown;
  search?: string;
  className?: string;
  onSelect?: (keys: string[]) => void;
}

/**
 * 将 Console catalog/tree API 节点（resourceKey、displayName）映射为 Tree 所需的 key、title。
 */
export function CatalogTree({ treeData, search, className, onSelect }: CatalogTreeProps) {
  const { t, locale, defaultLocale } = useI18n();
  const nodes = useMemo(() => {
    const mapped = mapCatalogNodes(normalizeCatalogTreeSource(treeData), locale, defaultLocale);
    return filterTree(mapped, search ?? "");
  }, [treeData, search, locale, defaultLocale]);

  const defaultExpandedKeys = useMemo(() => collectExpandableKeys(nodes), [nodes]);

  if (nodes.length === 0) {
    return (
      <p className="mt-2 text-sm text-muted-foreground">
        {t("common.ui.no-catalog-resources-if-you-just-installed-a-plugin-try-synchronizing-th")}
      </p>
    );
  }

  return (
    <Tree
      className={className}
      style={{ minHeight: 280 }}
      treeData={nodes}
      defaultExpandedKeys={defaultExpandedKeys}
      expandedKeys={search?.trim() ? defaultExpandedKeys : undefined}
      onSelect={onSelect}
    />
  );
}
