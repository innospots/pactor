"use client";

import { useMemo } from "react";

import { useI18n } from "@pactor-app/runtime";

import { resolveI18nText } from "../shared/i18n-text";

type I18nValue = string | Record<string, string> | null | undefined;

type CatalogGrantItem = {
  resourceKey?: string | null;
  grantName?: string | null;
  displayName?: I18nValue;
  description?: I18nValue;
};

type CatalogGrantGroup = {
  group?: string | null;
  displayName?: I18nValue;
  resourceKey?: string | null;
  items?: CatalogGrantItem[] | null;
};

type CatalogNode = {
  resourceKey?: string | null;
  resourceType?: string | null;
  entryPageKey?: string | null;
  displayName?: I18nValue;
  children?: CatalogNode[] | null;
  grants?: {
    viewGroups?: CatalogGrantGroup[] | null;
    operationGroups?: CatalogGrantGroup[] | null;
  } | null;
};

type PermissionGrant = {
  resourceKey?: string | null;
  constraintDefinition?: string | null;
};

function normalizeCatalogSource(raw: unknown): CatalogNode[] {
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

function normalizeGrants(raw: unknown): PermissionGrant[] {
  if (Array.isArray(raw)) {
    return raw.filter((item): item is PermissionGrant => typeof item === "object" && item !== null);
  }
  if (typeof raw === "object" && raw !== null) {
    const grants = (raw as Record<string, unknown>).grants;
    if (Array.isArray(grants)) {
      return grants.filter(
        (item): item is PermissionGrant => typeof item === "object" && item !== null,
      );
    }
  }
  return [];
}

function grantKey(item: CatalogGrantItem | PermissionGrant | CatalogGrantGroup | null | undefined): string {
  return item?.resourceKey?.trim() ?? "";
}

export function updateGrantSelection(grants: PermissionGrant[], key: string, checked: boolean): PermissionGrant[] {
  if (!checked) return grants.filter((item) => grantKey(item) !== key);
  return grants.some((item) => grantKey(item) === key) ? grants : [...grants, { resourceKey: key }];
}

function findCatalogPath(
  nodes: CatalogNode[],
  selectedKey: string,
  ancestors: CatalogNode[] = [],
): CatalogNode[] | null {
  for (const node of nodes) {
    if (node == null) {
      continue;
    }
    const nextPath = [...ancestors, node];
    if (grantKey(node) === selectedKey) {
      return nextPath;
    }
    const children = Array.isArray(node.children) ? node.children : [];
    const found = findCatalogPath(children, selectedKey, nextPath);
    if (found != null) {
      return found;
    }
  }
  return null;
}

function resolveGrantModule(path: CatalogNode[] | null): CatalogNode | null {
  if (path == null) {
    return null;
  }
  for (let index = path.length - 1; index >= 0; index -= 1) {
    const node = path[index];
    if (node.resourceType === "MODULE" && node.grants != null) {
      return node;
    }
  }
  return null;
}

function viewGroupUsesItems(group: CatalogGrantGroup): boolean {
  return (group.items?.length ?? 0) > 0;
}

function viewGroupSelectableKeys(group: CatalogGrantGroup): string[] {
  if (viewGroupUsesItems(group)) {
    return (group.items ?? [])
      .map((item) => grantKey(item))
      .filter((key) => key.length > 0);
  }
  const key = grantKey(group);
  return key.length > 0 ? [key] : [];
}

type TranslateText = ReturnType<typeof useI18n>;

function itemTitle(item: CatalogGrantItem | CatalogNode, i18n: TranslateText): string {
  return resolveI18nText(item.displayName, i18n.locale, i18n.defaultLocale)
    || (item as CatalogGrantItem).grantName?.trim()
    || grantKey(item);
}

function itemDescription(item: CatalogGrantItem, i18n: TranslateText): string {
  return resolveI18nText(item.description, i18n.locale, i18n.defaultLocale);
}

function groupTitle(group: CatalogGrantGroup, i18n: TranslateText): string {
  return resolveI18nText(group.displayName, i18n.locale, i18n.defaultLocale)
    || group.group?.trim()
    || "";
}

function GrantCheckbox({
  item,
  checked,
  currentPage,
  onChange,
}: {
  item: CatalogGrantItem;
  checked: boolean;
  currentPage?: boolean;
  onChange: (checked: boolean) => void;
}) {
  const i18n = useI18n();
  const { t } = i18n;
  const description = itemDescription(item, i18n);
  return (
    <label className="flex cursor-pointer items-start gap-3 rounded-md border border-border/70 px-3 py-2.5 hover:bg-muted/40">
      <input
        type="checkbox"
        className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span className="min-w-0">
        <span className="flex flex-wrap items-center gap-2 text-sm font-medium text-foreground">
          {itemTitle(item, i18n)}
          {currentPage ? (
            <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[11px] font-normal text-primary">
              {t("common.ui.current-page")}
            </span>
          ) : null}
        </span>
        {description.length > 0 ? (
          <span className="mt-1 block text-xs leading-5 text-muted-foreground">
            {description}
          </span>
        ) : null}
        <span className="mt-1 block break-all font-mono text-[11px] text-muted-foreground/80">
          {grantKey(item)}
        </span>
      </span>
    </label>
  );
}

function ViewGroupCard({
  group,
  checked,
  onChange,
}: {
  group: CatalogGrantGroup;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  const i18n = useI18n();
  const { t } = i18n;
  const key = grantKey(group);
  return (
    <label
      className={`flex cursor-pointer flex-col gap-2 rounded-lg border px-4 py-3 transition-colors ${
        checked
          ? "border-primary/50 bg-primary/5 shadow-sm"
          : "border-border/70 hover:bg-muted/40"
      }`}
    >
      <span className="flex items-start gap-3">
        <input
          type="checkbox"
          className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
          checked={checked}
          onChange={(event) => onChange(event.target.checked)}
        />
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-medium text-foreground">
            {groupTitle(group, i18n) || t("common.ui.browse-groups")}
          </span>
          <span className="mt-1 block break-all font-mono text-[11px] text-muted-foreground/80">
            {key}
          </span>
        </span>
      </span>
    </label>
  );
}

export interface PermissionGrantPanelProps {
  catalog?: unknown;
  selectedResourceKey?: string;
  grants?: unknown;
  draftGrants?: unknown;
  className?: string;
  onChange?: (event: { grants: PermissionGrant[]; dirty: boolean }) => void;
}

/**
 * 角色权限看板：MENU 自动定位所属 MODULE，展示页面访问与按组操作权限。
 */
export function PermissionGrantPanel({
  catalog,
  selectedResourceKey,
  grants,
  draftGrants,
  className,
  onChange,
}: PermissionGrantPanelProps) {
  const i18n = useI18n();
  const { t } = i18n;
  const catalogNodes = useMemo(() => normalizeCatalogSource(catalog), [catalog]);
  const selectedKey = selectedResourceKey?.trim() ?? "";
  const selectedPath = useMemo(
    () => findCatalogPath(catalogNodes, selectedKey),
    [catalogNodes, selectedKey],
  );
  const moduleNode = useMemo(() => resolveGrantModule(selectedPath), [selectedPath]);
  const selectedNode = selectedPath?.[selectedPath.length - 1] ?? null;

  const savedGrants = useMemo(() => normalizeGrants(grants), [grants]);
  const effectiveGrants = useMemo(() => {
    return Array.isArray(draftGrants) ? normalizeGrants(draftGrants) : savedGrants;
  }, [draftGrants, savedGrants]);
  const selectedKeys = useMemo(
    () => new Set(effectiveGrants.map((item) => grantKey(item)).filter((key) => key.length > 0)),
    [effectiveGrants],
  );

  const viewGroups = useMemo(() => moduleNode?.grants?.viewGroups ?? [], [moduleNode]);
  const operationGroups = useMemo(
    () => moduleNode?.grants?.operationGroups ?? [],
    [moduleNode],
  );
  const viewSelectableKeys = useMemo(
    () => viewGroups.flatMap((group) => viewGroupSelectableKeys(group)),
    [viewGroups],
  );
  const operationItemKeys = useMemo(
    () =>
      operationGroups
        .flatMap((group) => (group.items ?? []).map((item) => grantKey(item)))
        .filter((key) => key.length > 0),
    [operationGroups],
  );
  const moduleItemKeys = useMemo(
    () => [...viewSelectableKeys, ...operationItemKeys],
    [viewSelectableKeys, operationItemKeys],
  );
  const selectedCount = moduleItemKeys.filter((key) => selectedKeys.has(key)).length;

  const toggleGrant = (key: string, checked: boolean) => {
    const nextGrants = updateGrantSelection(effectiveGrants, key, checked);
    onChange?.({ grants: nextGrants, dirty: true });
  };

  if (selectedKey.length === 0) {
    return (
      <div className="flex min-h-56 items-center justify-center rounded-md border border-dashed border-border px-6 py-10 text-center text-sm text-muted-foreground">
        {t("common.ui.select-a-page-or-module-on-the-left-to-view-and-configure-access-and-ope")}
      </div>
    );
  }

  if (moduleNode == null) {
    return (
      <div className="flex min-h-56 items-center justify-center rounded-md border border-dashed border-border px-6 py-10 text-center text-sm text-muted-foreground">
        {t("common.ui.the-selected-node-has-no-configurable-permission-modules")}
      </div>
    );
  }

  const selectedName = selectedNode != null ? itemTitle(selectedNode, i18n) : selectedKey;
  const moduleName = itemTitle(moduleNode, i18n);
  const operationItemCount = operationGroups.reduce(
    (total, group) => total + (group.items?.length ?? 0),
    0,
  );

  return (
    <div className={`flex flex-col gap-4 ${className ?? ""}`}>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-base font-semibold text-foreground">{moduleName}</div>
          <div className="mt-1 text-xs text-muted-foreground">
            {selectedNode?.resourceType === "MENU"
              ? t("common.ui.located-the-parent-module-from-menu-name", { name: selectedName })
              : t("common.ui.current-module-authorization")}
          </div>
        </div>
        <div className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
          {t("common.ui.selected")} {selectedCount} / {moduleItemKeys.length}
        </div>
      </div>

      <p className="rounded-md bg-muted/50 px-3 py-2 text-xs leading-5 text-muted-foreground">
        {t("common.ui.view-permissions-determine-whether-navigation-menus-and-pages-are-visibl")}
      </p>

      <section className="rounded-lg border border-border p-4">
        <div className="flex items-center justify-between gap-2">
          <h4 className="text-sm font-semibold text-foreground">{t("common.ui.view-permissions")}</h4>
          <span className="text-xs text-muted-foreground">
            {viewSelectableKeys.length} {t("common.ui.items")}
          </span>
        </div>
        {viewSelectableKeys.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            {t("common.ui.this-module-has-no-configurable-page-access-permissions")}
          </p>
        ) : (
          <div className="mt-3 space-y-4">
            {viewGroups.map((group, groupIndex) => {
              const items = group.items ?? [];
              const groupKey = `view-${group.group ?? "group"}-${groupIndex}`;
              if (viewGroupUsesItems(group)) {
                return (
                  <div key={groupKey}>
                    <div className="mb-2 flex items-center gap-2">
                      <span className="text-xs font-medium text-muted-foreground">
                        {groupTitle(group, i18n) || t("common.ui.browse-groups")}
                      </span>
                      <span className="h-px flex-1 bg-border" />
                    </div>
                    <div className="grid gap-2 xl:grid-cols-2">
                      {items.map((item) => {
                        const key = grantKey(item);
                        return (
                          <GrantCheckbox
                            key={key}
                            item={item}
                            checked={selectedKeys.has(key)}
                            onChange={(checked) => toggleGrant(key, checked)}
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              }
              const key = grantKey(group);
              if (key.length === 0) {
                return null;
              }
              return (
                <div key={groupKey} className="grid gap-3 sm:grid-cols-2">
                  <ViewGroupCard
                    group={group}
                    checked={selectedKeys.has(key)}
                    onChange={(checked) => toggleGrant(key, checked)}
                  />
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="rounded-lg border border-border p-4">
        <div className="flex items-center justify-between gap-2">
          <h4 className="text-sm font-semibold text-foreground">{t("common.ui.operation-permissions")}</h4>
          <span className="text-xs text-muted-foreground">
            {operationItemCount} {t("common.ui.items")}
          </span>
        </div>
        {operationItemCount === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">
            {t("common.ui.this-module-has-no-standalone-operation-permissions")}
          </p>
        ) : (
          <div className="mt-3 space-y-4">
            {operationGroups.map((group, groupIndex) => {
              const items = group.items ?? [];
              if (items.length === 0) {
                return null;
              }
              return (
                <div key={`${group.group ?? "default"}-${groupIndex}`}>
                  <div className="mb-2 flex items-center gap-2">
                    <span className="text-xs font-medium text-muted-foreground">
                      {resolveI18nText(group.displayName, i18n.locale, i18n.defaultLocale)
                        || group.group
                        || t("common.ui.actions")}
                    </span>
                    <span className="h-px flex-1 bg-border" />
                  </div>
                  <div className="grid gap-2 xl:grid-cols-2">
                    {items.map((item) => {
                      const key = grantKey(item);
                      return (
                        <GrantCheckbox
                          key={key}
                          item={item}
                          checked={selectedKeys.has(key)}
                          onChange={(checked) => toggleGrant(key, checked)}
                        />
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
