import Link from "next/link";

import { getAssemblySummary } from "@/modules/registry";

export default function ShellHomePage() {
  const { modules, routeCount } = getAssemblySummary();

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-8 px-6 py-16">
      <header className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-wide text-zinc-500">
          InnoSpots Web Shell
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">模块化 Pactor 基座</h1>
        <p className="text-zinc-600">
          构建期装配 UI npm 模块，运行期通过统一 DSL API 与 Pactor Host 渲染业务页面。
        </p>
      </header>

      <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-medium">装配状态</h2>
        <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-zinc-500">已启用模块</dt>
            <dd className="font-mono text-base">{modules.length}</dd>
          </div>
          <div>
            <dt className="text-zinc-500">路由条目</dt>
            <dd className="font-mono text-base">{routeCount}</dd>
          </div>
        </dl>
        {modules.length === 0 ? (
          <p className="mt-4 text-sm text-zinc-600">
            在 <code className="rounded bg-zinc-100 px-1">src/modules/module-list.json</code>{" "}
            中启用 UI 模块后执行{" "}
            <code className="rounded bg-zinc-100 px-1">npm run assemble:modules</code>。
          </p>
        ) : (
          <ul className="mt-4 space-y-2 text-sm">
            {modules.map((m) => (
              <li key={m.id} className="flex flex-wrap items-baseline gap-2">
                <span className="font-medium">{m.name}</span>
                <span className="font-mono text-zinc-500">{m.package}</span>
                <Link className="text-blue-600 hover:underline" href={m.basePath}>
                  {m.basePath}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
