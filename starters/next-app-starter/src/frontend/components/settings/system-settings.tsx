"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

import { useHostI18n, type HostTranslate } from "../../i18n/messages";

type Key =
  | "siteName"
  | "description"
  | "timezone"
  | "language"
  | "pageSize"
  | "sessionTimeout";
type Values = Record<Key, string>;
type SettingItem = {
  key: Key;
  label: string;
  description: string;
  options?: { value: string; label: string }[];
};
type SettingGroup = { title: string; items: SettingItem[] };

function buildGroups(t: HostTranslate): SettingGroup[] {
  return [
    {
      title: t("systemSettings.group.basic"),
      items: [
        {
          key: "siteName",
          label: t("systemSettings.siteName.label"),
          description: t("systemSettings.siteName.description"),
        },
        {
          key: "description",
          label: t("systemSettings.systemDescription.label"),
          description: t("systemSettings.systemDescription.description"),
        },
      ],
    },
    {
      title: t("systemSettings.group.display"),
      items: [
        {
          key: "language",
          label: t("systemSettings.language.label"),
          description: t("systemSettings.language.description"),
          options: [
            { value: "zh-CN", label: t("systemSettings.language.zh") },
            { value: "en-US", label: t("systemSettings.language.en") },
          ],
        },
        {
          key: "timezone",
          label: t("systemSettings.timezone.label"),
          description: t("systemSettings.timezone.description"),
          options: [
            { value: "Asia/Shanghai", label: t("systemSettings.timezone.shanghai") },
            { value: "UTC", label: t("systemSettings.timezone.utc") },
            { value: "America/New_York", label: t("systemSettings.timezone.newYork") },
          ],
        },
        {
          key: "pageSize",
          label: t("systemSettings.pageSize.label"),
          description: t("systemSettings.pageSize.description"),
          options: ["10", "20", "50"].map((value) => ({
            value,
            label: t("systemSettings.pageSize.option", { value }),
          })),
        },
      ],
    },
    {
      title: t("systemSettings.group.session"),
      items: [
        {
          key: "sessionTimeout",
          label: t("systemSettings.sessionTimeout.label"),
          description: t("systemSettings.sessionTimeout.description"),
          options: ["15", "30", "60", "120"].map((value) => ({
            value,
            label: t("systemSettings.sessionTimeout.option", { value }),
          })),
        },
      ],
    },
  ];
}

export function SystemSettings() {
  const { t } = useHostI18n();
  const [values, setValues] = useState<Values | null>(null);
  const [editing, setEditing] = useState<Key | null>(null);
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [loadFailed, setLoadFailed] = useState(false);
  const groups = buildGroups(t);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/d/system-settings", { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error();
        return response.json() as Promise<Values>;
      })
      .then(setValues)
      .catch(() => {
        if (!controller.signal.aborted) setLoadFailed(true);
      });
    return () => controller.abort();
  }, []);

  const item = groups.flatMap((group) => group.items).find((entry) => entry.key === editing);

  function open(key: Key) {
    if (!values) return;
    setEditing(key);
    setDraft(values[key]);
    setMessage("");
  }

  async function save(event: React.FormEvent) {
    event.preventDefault();
    if (!editing || saving) return;
    setSaving(true);
    setMessage("");
    try {
      const response = await fetch("/api/d/system-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: editing, value: draft }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || t("systemSettings.saveError"));
      setValues((old) => old && { ...old, [editing]: data.value });
      setEditing(null);
    } catch (cause) {
      setMessage(
        cause instanceof Error && cause.message
          ? cause.message
          : t("systemSettings.saveError"),
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="system-settings-page">
      <div className="kb-heading">
        <div>
          <h1>{t("systemSettings.title")}</h1>
          <p>{t("systemSettings.subtitle")}</p>
        </div>
      </div>
      <div className="system-settings-content">
        <p className="system-settings-note">{t("systemSettings.note")}</p>
        {loadFailed ? (
          <p className="kb-error" role="alert">
            {t("systemSettings.loadError")}
          </p>
        ) : null}
        {!values && !loadFailed ? <p>{t("systemSettings.loading")}</p> : null}
        {values
          ? groups.map((group) => (
              <section className="system-settings-group" key={group.title}>
                <h2>{group.title}</h2>
                {group.items.map((entry) => (
                  <div className="system-setting" key={entry.key}>
                    <div>
                      <strong>{entry.label}</strong>
                      <p>{entry.description}</p>
                    </div>
                    <div className="system-setting-display">
                      <span>
                        {entry.options?.find(
                          (option) => option.value === values[entry.key],
                        )?.label ?? (values[entry.key] || "—")}
                      </span>
                      <button
                        className="system-setting-edit"
                        onClick={() => open(entry.key)}
                        aria-label={t("systemSettings.editAria", {
                          label: entry.label,
                        })}
                      >
                        {t("common.edit")}
                      </button>
                    </div>
                  </div>
                ))}
              </section>
            ))
          : null}
      </div>
      {item ? (
        <div
          className="doc-dialog-backdrop"
          onClick={() => !saving && setEditing(null)}
        >
          <section
            className="doc-dialog system-setting-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="system-setting-title"
            onClick={(event) => event.stopPropagation()}
            onKeyDown={(event) => {
              if (event.key === "Escape" && !saving) setEditing(null);
            }}
          >
            <div className="doc-dialog-title">
              <h2 id="system-setting-title">
                {t("systemSettings.editTitle", { label: item.label })}
              </h2>
              <button
                className="doc-icon-button"
                aria-label={t("common.close")}
                disabled={saving}
                onClick={() => setEditing(null)}
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={save}>
              <label htmlFor="system-setting-value">{item.label}</label>
              {item.options ? (
                <select
                  id="system-setting-value"
                  autoFocus
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                >
                  {item.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  id="system-setting-value"
                  autoFocus
                  required={item.key === "siteName"}
                  maxLength={item.key === "siteName" ? 80 : 200}
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                />
              )}
              {message ? (
                <p className="kb-error" role="alert">
                  {message}
                </p>
              ) : null}
              <div className="doc-dialog-actions">
                <button
                  type="button"
                  className="doc-button"
                  disabled={saving}
                  onClick={() => setEditing(null)}
                >
                  {t("common.cancel")}
                </button>
                <button className="doc-button primary" disabled={saving}>
                  {saving ? t("common.saving") : t("common.save")}
                </button>
              </div>
            </form>
          </section>
        </div>
      ) : null}
    </div>
  );
}
