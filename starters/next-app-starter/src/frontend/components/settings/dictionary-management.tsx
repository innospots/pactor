"use client";

import { useEffect, useState } from "react";
import { Plus, Search, X } from "lucide-react";

import { useHostI18n } from "../../i18n/messages";

type Item = { itemValue: string; itemName: string };
type Dictionary = {
  id: string;
  code: string;
  name: string;
  status: string;
  items: Item[];
};
type ErrorState =
  | { kind: "load" }
  | { kind: "save" }
  | { kind: "server"; message: string }
  | null;

const blank = (): Dictionary => ({
  id: "",
  code: "",
  name: "",
  status: "ENABLED",
  items: [],
});

export function DictionaryManagement() {
  const { t } = useHostI18n();
  const [rows, setRows] = useState<Dictionary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ErrorState>(null);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState("");
  const [filters, setFilters] = useState({ input: "", status: "" });
  const [page, setPage] = useState(1);
  const [mode, setMode] = useState<"view" | "edit" | "create" | null>(null);
  const [draft, setDraft] = useState<Dictionary>(blank);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/d/dictionaries", { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error();
        return response.json() as Promise<Dictionary[]>;
      })
      .then((data) => {
        setRows(data);
        setLoading(false);
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setError({ kind: "load" });
          setLoading(false);
        }
      });
    return () => controller.abort();
  }, []);

  const visible = rows.filter(
    (row) =>
      (!filters.status || row.status === filters.status) &&
      `${row.name} ${row.code}`.toLowerCase().includes(filters.input.toLowerCase()),
  );
  const pages = Math.max(1, Math.ceil(visible.length / 10));
  const current = Math.min(page, pages);
  const errorText =
    error?.kind === "load"
      ? t("dictionary.loadError")
      : error?.kind === "save"
        ? t("dictionary.saveError")
        : error?.kind === "server"
          ? error.message
          : "";

  function open(which: "view" | "edit" | "create", row?: Dictionary) {
    setDraft(
      row
        ? { ...row, items: row.items.map((item) => ({ ...item })) }
        : blank(),
    );
    setError(null);
    setMode(which);
  }

  async function save(event: React.FormEvent) {
    event.preventDefault();
    if (saving) return;
    setSaving(true);
    setError(null);
    try {
      const response = await fetch("/api/d/dictionaries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "");
      }
      setRows((old) =>
        draft.id
          ? old.map((row) => (row.id === data.id ? data : row))
          : [data, ...old],
      );
      setMode(null);
      setPage(1);
    } catch (cause) {
      setError(
        cause instanceof Error && cause.message
          ? { kind: "server", message: cause.message }
          : { kind: "save" },
      );
    } finally {
      setSaving(false);
    }
  }

  function updateItem(index: number, field: keyof Item, value: string) {
    setDraft((old) => ({
      ...old,
      items: old.items.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    }));
  }

  return (
    <div className="dictionary-page">
      <div className="kb-heading">
        <div>
          <h1>{t("dictionary.title")}</h1>
          <p>{t("dictionary.subtitle")}</p>
        </div>
        <button className="doc-button primary" onClick={() => open("create")}>
          <Plus size={16} />
          {t("dictionary.newType")}
        </button>
      </div>
      <form
        className="dictionary-search"
        onSubmit={(event) => {
          event.preventDefault();
          setFilters({ input: input.trim(), status });
          setPage(1);
        }}
      >
        <label className="doc-search">
          <Search size={16} />
          <input
            aria-label={t("dictionary.searchAria")}
            placeholder={t("dictionary.searchPlaceholder")}
            value={input}
            onChange={(event) => setInput(event.target.value)}
          />
        </label>
        <select
          aria-label={t("dictionary.statusAria")}
          value={status}
          onChange={(event) => setStatus(event.target.value)}
        >
          <option value="">{t("dictionary.allStatuses")}</option>
          <option value="ENABLED">{t("dictionary.enabled")}</option>
          <option value="DISABLED">{t("dictionary.disabled")}</option>
        </select>
        <button className="doc-button primary">{t("common.query")}</button>
        <button
          type="button"
          className="doc-button"
          onClick={() => {
            setInput("");
            setStatus("");
            setFilters({ input: "", status: "" });
            setPage(1);
          }}
        >
          {t("common.reset")}
        </button>
      </form>
      {error && !mode ? (
        <p className="kb-error" role="alert">
          {errorText}
        </p>
      ) : null}
      <div className="meta-table-wrap">
        <table className="meta-table">
          <thead>
            <tr>
              <th>{t("dictionary.column.name")}</th>
              <th>{t("dictionary.column.code")}</th>
              <th>{t("dictionary.column.status")}</th>
              <th>{t("dictionary.column.items")}</th>
              <th className="dictionary-action">{t("dictionary.column.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {visible
              .slice((current - 1) * 10, current * 10)
              .map((row) => (
                <tr key={row.id}>
                  <td>
                    <button onClick={() => open("view", row)}>{row.name}</button>
                  </td>
                  <td>{row.code}</td>
                  <td>
                    {row.status === "ENABLED"
                      ? t("dictionary.enabled")
                      : t("dictionary.disabled")}
                  </td>
                  <td>{row.items.length}</td>
                  <td className="dictionary-action">
                    <button onClick={() => open("view", row)}>
                      {t("common.view")}
                    </button>
                    <button onClick={() => open("edit", row)}>
                      {t("common.edit")}
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        {loading ? (
          <div className="kb-empty">{t("dictionary.loading")}</div>
        ) : !visible.length ? (
          <div className="kb-empty">{t("dictionary.empty")}</div>
        ) : null}
      </div>
      {visible.length ? (
        <nav
          className="qa-pagination"
          aria-label={t("dictionary.paginationAria")}
        >
          <span>
            {t("common.paginationRange", {
              total: visible.length,
              page: current,
              pages,
            })}
          </span>
          <div>
            <button
              className="doc-button"
              disabled={current === 1}
              onClick={() => setPage(current - 1)}
            >
              {t("common.previous")}
            </button>
            {Array.from({ length: pages }, (_, index) => index + 1).map(
              (number) => (
                <button
                  key={number}
                  className={`doc-button${number === current ? " qa-page-active" : ""}`}
                  aria-current={number === current ? "page" : undefined}
                  aria-label={t("common.page", { page: number })}
                  onClick={() => setPage(number)}
                >
                  {number}
                </button>
              ),
            )}
            <button
              className="doc-button"
              disabled={current === pages}
              onClick={() => setPage(current + 1)}
            >
              {t("common.next")}
            </button>
          </div>
        </nav>
      ) : null}
      {mode ? (
        <div
          className="dictionary-backdrop"
          onClick={() => !saving && setMode(null)}
        >
          <section
            className="dictionary-drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby="dictionary-title"
            onClick={(event) => event.stopPropagation()}
            onKeyDown={(event) => {
              if (event.key === "Escape" && !saving) setMode(null);
            }}
          >
            <div className="doc-dialog-title">
              <h2 id="dictionary-title">
                {mode === "view"
                  ? t("dictionary.drawer.view")
                  : mode === "edit"
                    ? t("dictionary.drawer.edit")
                    : t("dictionary.drawer.create")}
              </h2>
              <button
                className="doc-icon-button"
                aria-label={t("common.close")}
                onClick={() => setMode(null)}
                disabled={saving}
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={save}>
              <h3>{t("dictionary.form.basic")}</h3>
              <label>
                {t("dictionary.form.name")}
                <input
                  required
                  maxLength={80}
                  readOnly={mode === "view"}
                  value={draft.name}
                  onChange={(event) =>
                    setDraft({ ...draft, name: event.target.value })
                  }
                />
              </label>
              <label>
                {t("dictionary.form.code")}
                <input
                  required
                  pattern="[A-Za-z][A-Za-z0-9_]*"
                  title={t("dictionary.form.codeTitle")}
                  readOnly={mode !== "create"}
                  value={draft.code}
                  onChange={(event) =>
                    setDraft({ ...draft, code: event.target.value })
                  }
                />
              </label>
              <label>
                {t("dictionary.form.status")}
                <select
                  disabled={mode === "view"}
                  value={draft.status}
                  onChange={(event) =>
                    setDraft({ ...draft, status: event.target.value })
                  }
                >
                  <option value="ENABLED">{t("dictionary.enabled")}</option>
                  <option value="DISABLED">{t("dictionary.disabled")}</option>
                </select>
              </label>
              <div className="dictionary-items-head">
                <h3>{t("dictionary.form.items")}</h3>
                {mode !== "view" ? (
                  <button
                    type="button"
                    className="doc-button"
                    onClick={() =>
                      setDraft({
                        ...draft,
                        items: [
                          ...draft.items,
                          { itemValue: "", itemName: "" },
                        ],
                      })
                    }
                  >
                    <Plus size={16} />
                    {t("dictionary.form.addItem")}
                  </button>
                ) : null}
              </div>
              {draft.items.map((item, index) => (
                <div className="dictionary-item" key={index}>
                  <input
                    aria-label={t("dictionary.form.itemValueAria", {
                      index: index + 1,
                    })}
                    placeholder={t("dictionary.form.itemValue")}
                    required
                    readOnly={mode === "view"}
                    value={item.itemValue}
                    onChange={(event) =>
                      updateItem(index, "itemValue", event.target.value)
                    }
                  />
                  <input
                    aria-label={t("dictionary.form.itemNameAria", {
                      index: index + 1,
                    })}
                    placeholder={t("dictionary.form.itemName")}
                    required
                    readOnly={mode === "view"}
                    value={item.itemName}
                    onChange={(event) =>
                      updateItem(index, "itemName", event.target.value)
                    }
                  />
                  {mode !== "view" ? (
                    <button
                      type="button"
                      className="doc-button"
                      onClick={() =>
                        setDraft({
                          ...draft,
                          items: draft.items.filter(
                            (_, itemIndex) => itemIndex !== index,
                          ),
                        })
                      }
                    >
                      {t("common.delete")}
                    </button>
                  ) : null}
                </div>
              ))}
              {!draft.items.length ? (
                <p className="dictionary-empty">
                  {t("dictionary.form.emptyItems")}
                </p>
              ) : null}
              {error ? (
                <p className="kb-error" role="alert">
                  {errorText}
                </p>
              ) : null}
              <div className="doc-dialog-actions">
                <button
                  type="button"
                  className="doc-button"
                  onClick={() => setMode(null)}
                  disabled={saving}
                >
                  {mode === "view" ? t("common.close") : t("common.cancel")}
                </button>
                {mode !== "view" ? (
                  <button className="doc-button primary" disabled={saving}>
                    {saving
                      ? t("common.saving")
                      : t("dictionary.form.saveAll")}
                  </button>
                ) : null}
              </div>
            </form>
          </section>
        </div>
      ) : null}
    </div>
  );
}
