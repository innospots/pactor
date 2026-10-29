import rolesFixture from "../fixtures/roles.json";

type Role = (typeof rolesFixture)[number];
type Binding = {
  bindingId: string;
  subjectType: string;
  subjectName: string;
  subjectKey: string;
  boundAt: string;
};

const state = globalThis as typeof globalThis & {
  starterRoles?: Role[];
  starterRoleGrants?: Record<string, { resourceKey: string; displayName: string }[]>;
  starterRoleBindings?: Record<string, Binding[]>;
};

state.starterRoles ??= rolesFixture.map((role) => ({ ...role }));
state.starterRoleGrants ??= {
  "demo-admin": [
    { resourceKey: "view:dashboard", displayName: "数据概览访问" },
    { resourceKey: "view:reports", displayName: "报表中心访问" },
    { resourceKey: "op:dashboard.export", displayName: "导出数据概览" },
    { resourceKey: "op:users.manage", displayName: "管理用户" },
  ],
  "demo-operator": [
    { resourceKey: "view:dashboard", displayName: "数据概览访问" },
    { resourceKey: "view:reports", displayName: "报表中心访问" },
    { resourceKey: "op:dashboard.export", displayName: "导出数据概览" },
  ],
  "demo-viewer": [
    { resourceKey: "view:dashboard", displayName: "数据概览访问" },
    { resourceKey: "view:reports", displayName: "报表中心访问" },
  ],
  "demo-auditor": [{ resourceKey: "view:audit", displayName: "审计日志访问" }],
};
state.starterRoleBindings ??= {
  "demo-admin": [
    { bindingId: "bind-1", subjectType: "USER", subjectName: "演示管理员", subjectKey: "admin", boundAt: "2026-08-02" },
  ],
  "demo-operator": [
    { bindingId: "bind-2", subjectType: "USER", subjectName: "张伟", subjectKey: "zhangwei", boundAt: "2026-08-12" },
    { bindingId: "bind-3", subjectType: "ORG", subjectName: "运营中心", subjectKey: "org-operation", boundAt: "2026-08-15" },
  ],
  "demo-viewer": [
    { bindingId: "bind-4", subjectType: "USER", subjectName: "访客", subjectKey: "guest", boundAt: "2026-08-20" },
  ],
  "demo-auditor": [],
};

const catalog = [
  {
    resourceKey: "module:workspace",
    resourceType: "MODULE",
    displayName: "工作台",
    children: [
      { resourceKey: "menu:workspace", resourceType: "MENU", displayName: "工作台" },
    ],
    grants: {
      viewGroups: [{ resourceKey: "view:workspace", displayName: "工作台访问" }],
      operationGroups: [
        {
          group: "workspace.operation",
          displayName: "工作台操作",
          items: [{ resourceKey: "op:agent.chat", displayName: "使用智能助手" }],
        },
      ],
    },
  },
  {
    resourceKey: "module:analytics",
    resourceType: "MODULE",
    displayName: "数据经营",
    children: [
      { resourceKey: "menu:dashboard", resourceType: "MENU", displayName: "数据概览" },
      { resourceKey: "menu:reports", resourceType: "MENU", displayName: "报表中心" },
      { resourceKey: "menu:data-list", resourceType: "MENU", displayName: "数据列表" },
    ],
    grants: {
      viewGroups: [
        { resourceKey: "view:dashboard", displayName: "数据概览访问" },
        { resourceKey: "view:reports", displayName: "报表中心访问" },
        { resourceKey: "view:data-list", displayName: "数据列表访问" },
      ],
      operationGroups: [
        {
          group: "analytics.operation",
          displayName: "数据操作",
          items: [
            { resourceKey: "op:dashboard.export", displayName: "导出数据概览" },
            { resourceKey: "op:reports.export", displayName: "导出报表" },
            { resourceKey: "op:data-list.manage", displayName: "维护数据列表" },
          ],
        },
      ],
    },
  },
  {
    resourceKey: "module:system",
    resourceType: "MODULE",
    displayName: "系统管理",
    children: [
      { resourceKey: "menu:settings", resourceType: "MENU", displayName: "系统设置" },
      { resourceKey: "menu:dictionaries", resourceType: "MENU", displayName: "字典管理" },
      { resourceKey: "menu:audit", resourceType: "MENU", displayName: "审计日志" },
      { resourceKey: "menu:users", resourceType: "MENU", displayName: "用户管理" },
      { resourceKey: "menu:roles", resourceType: "MENU", displayName: "角色管理" },
    ],
    grants: {
      viewGroups: [
        { resourceKey: "view:settings", displayName: "系统设置访问" },
        { resourceKey: "view:audit", displayName: "审计日志访问" },
        { resourceKey: "view:users", displayName: "用户管理访问" },
      ],
      operationGroups: [
        {
          group: "system.operation",
          displayName: "系统操作",
          items: [
            { resourceKey: "op:users.manage", displayName: "管理用户" },
            { resourceKey: "op:roles.manage", displayName: "管理角色" },
            { resourceKey: "op:settings.manage", displayName: "修改系统设置" },
          ],
        },
      ],
    },
  },
];

function json(data: unknown, status = 200) {
  return Response.json(data, {
    status,
    headers: { "cache-control": "no-store" },
  });
}

export async function GET(request: Request, parts: string[]) {
  if (parts.join("/") === "nexus/catalog/tree") return json(catalog);
  if (parts[0] !== "platform" || parts[1] !== "roles") return undefined;

  const url = new URL(request.url);
  if (parts.length === 2) {
    const input = (url.searchParams.get("input") ?? "").trim().toLowerCase();
    const status = url.searchParams.get("status") ?? "";
    const rows = state.starterRoles!.filter(
      (role) =>
        (!status || role.status === status) &&
        `${role.roleName} ${role.roleCode}`.toLowerCase().includes(input),
    );
    const pageNo = Math.max(1, Number(url.searchParams.get("pageNo")) || 1);
    const pageSize = Math.max(1, Number(url.searchParams.get("pageSize")) || 20);
    return json({
      records: rows.slice((pageNo - 1) * pageSize, pageNo * pageSize),
      total: rows.length,
      pageNo,
      pageSize,
    });
  }

  const role = state.starterRoles!.find((item) => item.roleId === parts[2]);
  if (!role) return json({ error: "角色不存在" }, 404);
  if (parts.length === 3) return json(role);
  if (parts[3] === "permissions") {
    return json({ grants: state.starterRoleGrants![role.roleId] ?? [] });
  }
  if (parts[3] === "bindings") {
    const bindings = state.starterRoleBindings![role.roleId] ?? [];
    const subjectType = url.searchParams.get("subjectType") ?? "";
    const input = (url.searchParams.get("input") ?? "").toLowerCase();
    const filtered = bindings.filter(
      (item) =>
        (!subjectType || item.subjectType === subjectType) &&
        `${item.subjectName} ${item.subjectKey}`.toLowerCase().includes(input),
    );
    return json({ records: filtered, total: filtered.length });
  }
  return json({ error: "接口不存在" }, 404);
}

export async function POST(request: Request, parts: string[]) {
  if (parts.join("/") === "nexus/catalog/sync") return json({ ok: true, synced: catalog.length });
  if (parts.join("/") !== "platform/roles") return json({ error: "接口不存在" }, 404);
  const input = (await request.json().catch(() => ({}))) as Partial<Role>;
  if (!input.roleName?.trim() || !input.roleCode?.trim()) {
    return json({ error: "角色名称和编码不能为空" }, 400);
  }
  const role: Role = {
    roleId: crypto.randomUUID(),
    roleName: input.roleName.trim(),
    roleCode: input.roleCode.trim().toUpperCase(),
    ownerType: "平台",
    memberCount: 0,
    status: "ENABLED",
    description: input.description?.trim() ?? "",
  };
  state.starterRoles!.unshift(role);
  state.starterRoleGrants![role.roleId] = [];
  state.starterRoleBindings![role.roleId] = [];
  return json(role);
}

export async function PUT(request: Request, parts: string[]) {
  if (parts[0] !== "platform" || parts[1] !== "roles") return undefined;
  const role = state.starterRoles!.find((item) => item.roleId === parts[2]);
  if (!role) return json({ error: "角色不存在" }, 404);
  if (parts[3] === "status") {
    const input = (await request.json().catch(() => ({}))) as { status?: string };
    role.status = input.status === "DISABLED" ? "DISABLED" : "ENABLED";
    return json(role);
  }
  if (parts[3] === "permissions") {
    const input = (await request.json().catch(() => ({}))) as {
      grants?: { resourceKey: string; displayName?: string }[];
    };
    state.starterRoleGrants![role.roleId] = (input.grants ?? [])
      .filter((item) => typeof item.resourceKey === "string")
      .map((item) => ({
        resourceKey: item.resourceKey,
        displayName: item.displayName ?? item.resourceKey,
      }));
    return json({ ok: true, grants: state.starterRoleGrants![role.roleId] });
  }
  const input = (await request.json().catch(() => ({}))) as Partial<Role>;
  if (input.roleName !== undefined) role.roleName = input.roleName.trim();
  if (input.description !== undefined) role.description = input.description.trim();
  return json(role);
}

export async function DELETE(_request: Request, parts: string[]) {
  if (parts[0] !== "platform" || parts[1] !== "roles") return undefined;
  if (parts[3] === "bindings" && parts[4]) {
    state.starterRoleBindings![parts[2]] = (state.starterRoleBindings![parts[2]] ?? []).filter(
      (item) => item.bindingId !== parts[4],
    );
    return json({ ok: true });
  }
  const index = state.starterRoles!.findIndex((item) => item.roleId === parts[2]);
  if (index < 0) return json({ error: "角色不存在" }, 404);
  const [removed] = state.starterRoles!.splice(index, 1);
  delete state.starterRoleGrants![removed.roleId];
  delete state.starterRoleBindings![removed.roleId];
  return json({ ok: true });
}
