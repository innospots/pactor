"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { pageAccessEndpoint } from "./config";

/**
 * 页面访问校验（前端侧）：页面切换 / 首次打开之前，先请求项目内
 * POST /api/page-access/verify，由 Next 服务端解析当前页面 DSL 的
 * pageKey / grantGroup 并转发平台接口（见 src/server/page-access.ts）。
 *
 * 校验通过前不把新路径交给 SitemapApp：URL 已随宿主路由变化，但内容区
 * 仍停留在上一个已放行页面（布局 state 不丢）；被拒时展示 403 视图，
 * 匿名访问受保护页面则跳登录页（服务端返回 redirectTo）。
 */

/** /api/page-access/verify 响应 */
export interface PageAccessResult {
  allowed: boolean;
  reason?: string;
  /** 匿名访问受保护页面时的登录重定向目标 */
  redirectTo?: string;
}

/** 已放行的页面（SitemapApp 按此路径渲染） */
export interface CommittedPage {
  pathname: string;
  /** 原始 query string（不含 ?） */
  search: string;
}

type GateStatus =
  | { status: "checking" }
  | { status: "allowed" }
  | { status: "denied"; reason: string; redirectTo?: string };

/** 某条路径最近一次的拒绝结果（放行后清除） */
interface Denial {
  pathname: string;
  reason: string;
  redirectTo?: string;
}

/** 调用服务端校验路径访问权限；网络 / 解析失败按拒绝处理（fail-closed） */
export async function verifyPageAccess(
  pathname: string,
): Promise<PageAccessResult> {
  try {
    const response = await fetch(pageAccessEndpoint, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ path: pathname }),
      cache: "no-store",
      credentials: "same-origin",
    });
    if (!response.ok) {
      return {
        allowed: false,
        reason: `页面权限校验失败：HTTP ${response.status}`,
      };
    }
    const result = (await response.json()) as Partial<PageAccessResult>;
    return {
      allowed: result.allowed === true,
      reason: result.reason,
      redirectTo: result.redirectTo,
    };
  } catch (error) {
    return {
      allowed: false,
      reason: `页面权限校验服务不可用：${
        error instanceof Error ? error.message : String(error)
      }`,
    };
  }
}

/**
 * 页面访问门禁状态机：
 * - 首次打开：校验通过后才提交首个路径（SitemapApp 此时才挂载）；
 * - 页面切换：校验期间保持上一个已提交路径，通过后一次性切换；
 * - 同一路径的 query 变化不算页面切换，直接派生进已提交状态（不重复校验）；
 * - 被拒：保留 committed（供「返回」），由调用方渲染 403 视图；URL 回到
 *   已放行路径时拦截状态即时失效（无需额外 setState）。
 */
export function usePageAccessGate(
  pathname: string,
  search: string,
  replace: (to: string) => void,
): {
  committed: CommittedPage | null;
  status: GateStatus;
  retry: () => void;
} {
  /** 已放行的路径（null = 尚未放行任何页面） */
  const [committedPathname, setCommittedPathname] = useState<string | null>(
    null,
  );
  /** 放行时携带的 query；同一路径的后续 query 变化在渲染期派生覆盖 */
  const [committedSearch, setCommittedSearch] = useState("");
  /** 最近一次拒绝结果；「校验中」由 committed / denial 派生，无需 setState */
  const [denial, setDenial] = useState<Denial | null>(null);
  /** 请求序号：路径切换 / 重试时让在途响应失效，避免旧结果覆盖新页面 */
  const sequence = useRef(0);

  /** 结果落盘：setState 只发生在 Promise 回调中（不在 effect 内同步 setState） */
  const applyResult = useCallback(
    (
      targetPathname: string,
      targetSearch: string,
      result: PageAccessResult,
    ) => {
      if (result.allowed) {
        setDenial(null);
        setCommittedPathname(targetPathname);
        setCommittedSearch(targetSearch);
        return;
      }
      setDenial({
        pathname: targetPathname,
        reason: result.reason ?? "无页面访问权限",
        redirectTo: result.redirectTo,
      });
      if (
        result.redirectTo !== undefined &&
        result.redirectTo !== targetPathname
      ) {
        replace(result.redirectTo);
      }
    },
    [replace],
  );

  /** 发起一次校验（路径切换 / 重试共用）；过期响应直接丢弃 */
  const runCheck = useCallback(
    (targetPathname: string, targetSearch: string) => {
      const requestId = ++sequence.current;
      void verifyPageAccess(targetPathname).then((result) => {
        if (requestId === sequence.current) {
          applyResult(targetPathname, targetSearch, result);
        }
      });
    },
    [applyResult],
  );

  // 只有路径变化需要校验；同一路径的 query 变化由 committed 渲染期派生
  useEffect(() => {
    if (committedPathname === pathname) {
      return;
    }
    runCheck(pathname, search);
    return () => {
      // 路径切换 / 组件卸载：在途校验作废
      sequence.current += 1;
    };
  }, [pathname, search, committedPathname, runCheck]);

  const retry = useCallback(() => {
    runCheck(pathname, search);
  }, [runCheck, pathname, search]);

  const committed = useMemo<CommittedPage | null>(() => {
    if (committedPathname === null) {
      return null;
    }
    return {
      pathname: committedPathname,
      // 同一路径的 query 实时跟随，不同路径沿用放行时的快照
      search: committedPathname === pathname ? search : committedSearch,
    };
  }, [committedPathname, committedSearch, pathname, search]);

  /**
   * 门禁状态由「已放行路径 / 当前路径的拒绝结果」派生：
   * - 当前路径已放行（含 URL 回到已放行路径）→ allowed；
   * - 当前路径有拒绝结果 → denied（重新校验期间沿用，结果到达后覆盖）；
   * - 其余（首次打开 / 路径切换）→ checking。
   */
  const status = useMemo<GateStatus>(() => {
    if (committedPathname !== null && committedPathname === pathname) {
      return { status: "allowed" };
    }
    if (denial !== null && denial.pathname === pathname) {
      return denial.redirectTo !== undefined
        ? {
            status: "denied",
            reason: denial.reason,
            redirectTo: denial.redirectTo,
          }
        : { status: "denied", reason: denial.reason };
    }
    return { status: "checking" };
  }, [committedPathname, pathname, denial]);

  return { committed, status, retry };
}

/** 首次打开时的整页校验视图（SitemapApp 尚未挂载） */
export function PageAccessGateLoading({ text }: { text: string }) {
  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "var(--muted-foreground, #6b7280)",
        fontSize: 14,
      }}
    >
      {text}
    </div>
  );
}

/** 页面切换校验中的轻提示（内容区保持上一个已放行页面） */
export function PageAccessPending() {
  return (
    <div
      role="status"
      style={{
        position: "fixed",
        top: 12,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1000,
        padding: "6px 14px",
        borderRadius: 999,
        border: "1px solid var(--border, #e5e7eb)",
        background: "var(--card, #ffffff)",
        boxShadow: "0 4px 12px rgb(0 0 0 / 0.08)",
        color: "var(--muted-foreground, #6b7280)",
        fontSize: 12,
      }}
    >
      正在校验页面访问权限…
    </div>
  );
}

const buttonStyle = {
  padding: "6px 16px",
  borderRadius: 6,
  border: "1px solid var(--border, #d1d5db)",
  background: "var(--card, #ffffff)",
  color: "var(--foreground, #111827)",
  cursor: "pointer",
  fontSize: 14,
} as const;

const primaryButtonStyle = {
  ...buttonStyle,
  borderColor: "transparent",
  background: "var(--primary, #111827)",
  color: "var(--primary-foreground, #ffffff)",
} as const;

/** 无访问权限视图（展示平台返回的 reason） */
export function PageAccessDenied({
  reason,
  onRetry,
  onBack,
  onHome,
}: {
  reason: string;
  onRetry: () => void;
  onBack?: () => void;
  onHome: () => void;
}) {
  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        padding: 24,
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: 20, fontWeight: 600 }}>无访问权限</div>
      <div style={{ color: "var(--muted-foreground, #6b7280)" }}>{reason}</div>
      <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
        <button type="button" style={primaryButtonStyle} onClick={onRetry}>
          重新校验
        </button>
        {onBack !== undefined ? (
          <button type="button" style={buttonStyle} onClick={onBack}>
            返回上一页
          </button>
        ) : null}
        <button type="button" style={buttonStyle} onClick={onHome}>
          回到首页
        </button>
      </div>
    </div>
  );
}
