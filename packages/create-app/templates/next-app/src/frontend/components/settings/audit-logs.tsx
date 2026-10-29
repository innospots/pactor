"use client";

import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";

import { useHostI18n } from "../../i18n/messages";

type Log = {
  id: string;
  time: string;
  user: string;
  action: string;
  result: string;
  ip: string;
};
type Result = { records: Log[]; total: number; pageSize: number };

export function AuditLogs() {
  const { locale, t } = useHostI18n();
  const [keyword, setKeyword] = useState("");
  const [result, setResult] = useState("");
  const [filters, setFilters] = useState({ keyword: "", result: "" });
  const [page, setPage] = useState(1);
  const [data, setData] = useState<Result | null>(null);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [selected, setSelected] = useState<Log | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({ ...filters, page: String(page) });
    fetch(`/api/d/audit-logs?${params}`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error();
        return response.json() as Promise<Result>;
      })
      .then((value) => {
        setData(value);
        setFailed(false);
        setLoading(false);
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setFailed(true);
          setLoading(false);
        }
      });
    return () => controller.abort();
  }, [filters, page]);

  function search(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setPage(1);
    setFilters({ keyword: keyword.trim(), result });
  }

  function reset() {
    setKeyword("");
    setResult("");
    setPage(1);
    setLoading(true);
    setFilters({ keyword: "", result: "" });
  }

  function changePage(next: number) {
    setLoading(true);
    setPage(next);
  }

  const pages = Math.max(
    1,
    Math.ceil((data?.total || 0) / (data?.pageSize || 10)),
  );
  const numbers = Array.from({ length: pages }, (_, index) => index + 1).filter(
    (number) =>
      number === 1 ||
      number === pages ||
      Math.abs(number - page) <= 1,
  );
  const dateLocale = locale === "en-US" ? "en-US" : "zh-CN";
  const formatTime = (value: string) =>
    new Date(value).toLocaleString(dateLocale, {
      timeZone: "Asia/Shanghai",
      hour12: false,
    });
  const resultLabel = (value: string) =>
    value === "成功"
      ? t("audit.success")
      : value === "失败"
        ? t("audit.failure")
        : value;
  const actionLabels: Record<string, ReturnType<typeof t>> = {
    登录系统: t("audit.action.login"),
    更新角色: t("audit.action.updateRole"),
    创建用户: t("audit.action.createUser"),
    修改系统设置: t("audit.action.updateSettings"),
    查看报表: t("audit.action.viewReport"),
    导出数据: t("audit.action.exportData"),
  };
  const actionLabel = (value: string) => actionLabels[value] ?? value;

  return (
    <div className="audit-page">
      <div className="kb-heading">
        <div>
          <h1>{t("audit.title")}</h1>
          <p>{t("audit.subtitle")}</p>
        </div>
      </div>
      <form className="audit-search" onSubmit={search}>
        <label className="doc-search">
          <Search size={16} />
          <input
            aria-label={t("audit.searchAria")}
            placeholder={t("audit.searchPlaceholder")}
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
          />
        </label>
        <select
          aria-label={t("audit.resultAria")}
          value={result}
          onChange={(event) => setResult(event.target.value)}
        >
          <option value="">{t("audit.allResults")}</option>
          <option value="成功">{t("audit.success")}</option>
          <option value="失败">{t("audit.failure")}</option>
        </select>
        <button className="doc-button primary">{t("common.query")}</button>
        <button type="button" className="doc-button" onClick={reset}>
          {t("common.reset")}
        </button>
      </form>
      {failed ? (
        <p className="kb-error" role="alert">
          {t("audit.loadError")}
        </p>
      ) : null}
      <section className="audit-list">
        <div className="meta-table-wrap">
          <table className="meta-table">
            <thead>
              <tr>
                <th>{t("audit.column.time")}</th>
                <th>{t("audit.column.user")}</th>
                <th>{t("audit.column.action")}</th>
                <th>{t("audit.column.result")}</th>
                <th>{t("audit.column.ip")}</th>
                <th className="audit-action">{t("audit.column.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {!loading
                ? data?.records.map((log) => (
                    <tr key={log.id}>
                      <td>{formatTime(log.time)}</td>
                      <td>{log.user}</td>
                      <td>{actionLabel(log.action)}</td>
                      <td>
                        <span
                          className={
                            log.result === "成功"
                              ? "audit-success"
                              : "audit-failed"
                          }
                        >
                          {resultLabel(log.result)}
                        </span>
                      </td>
                      <td>{log.ip}</td>
                      <td className="audit-action">
                        <button onClick={() => setSelected(log)}>
                          {t("common.view")}
                        </button>
                      </td>
                    </tr>
                  ))
                : null}
            </tbody>
          </table>
          {loading ? (
            <div className="kb-empty">{t("audit.loading")}</div>
          ) : !data?.records.length ? (
            <div className="kb-empty">{t("audit.empty")}</div>
          ) : null}
        </div>
        {data?.total ? (
          <nav
            className="qa-pagination"
            aria-label={t("audit.paginationAria")}
          >
            <span>
              {t("common.paginationRange", {
                total: data.total,
                page,
                pages,
              })}
            </span>
            <div>
              <button
                className="doc-button"
                disabled={page <= 1 || loading}
                onClick={() => changePage(page - 1)}
              >
                {t("common.previous")}
              </button>
              {numbers.map((number, index) => (
                <span className="qa-page-number" key={number}>
                  {index > 0 && number - numbers[index - 1] > 1 ? (
                    <span>…</span>
                  ) : null}
                  <button
                    className={`doc-button${number === page ? " qa-page-active" : ""}`}
                    aria-current={number === page ? "page" : undefined}
                    aria-label={t("common.page", { page: number })}
                    disabled={loading}
                    onClick={() => changePage(number)}
                  >
                    {number}
                  </button>
                </span>
              ))}
              <button
                className="doc-button"
                disabled={page >= pages || loading}
                onClick={() => changePage(page + 1)}
              >
                {t("common.next")}
              </button>
            </div>
          </nav>
        ) : null}
      </section>
      {selected ? (
        <div className="dictionary-backdrop" onClick={() => setSelected(null)}>
          <section
            className="dictionary-drawer audit-drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby="audit-detail-title"
            onClick={(event) => event.stopPropagation()}
            onKeyDown={(event) => {
              if (event.key === "Escape") setSelected(null);
            }}
          >
            <div className="doc-dialog-title">
              <h2 id="audit-detail-title">{t("audit.detail.title")}</h2>
              <button
                className="doc-icon-button"
                aria-label={t("common.close")}
                onClick={() => setSelected(null)}
              >
                <X size={18} />
              </button>
            </div>
            <div className="audit-detail-section">
              <h3>{t("audit.detail.section")}</h3>
              <dl>
                <div>
                  <dt>{t("audit.detail.id")}</dt>
                  <dd>{selected.id}</dd>
                </div>
                <div>
                  <dt>{t("audit.detail.time")}</dt>
                  <dd>{formatTime(selected.time)}</dd>
                </div>
                <div>
                  <dt>{t("audit.detail.user")}</dt>
                  <dd>{selected.user}</dd>
                </div>
                <div>
                  <dt>{t("audit.detail.action")}</dt>
                  <dd>{actionLabel(selected.action)}</dd>
                </div>
                <div>
                  <dt>{t("audit.detail.result")}</dt>
                  <dd>
                    <span
                      className={
                        selected.result === "成功"
                          ? "audit-success"
                          : "audit-failed"
                      }
                    >
                      {resultLabel(selected.result)}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt>{t("audit.detail.ip")}</dt>
                  <dd>{selected.ip}</dd>
                </div>
              </dl>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}
