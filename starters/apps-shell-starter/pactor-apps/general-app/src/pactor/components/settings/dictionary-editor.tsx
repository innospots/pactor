"use client";

import { useState, type FormEvent } from "react";
import { useHostI18n } from "../../i18n/messages";

type Item = { itemValue: string; itemName: string };
type Dictionary = { id: string; code: string; name: string; status: string; items: Item[] };

export function DictionaryEditor({ value, mode = "create", onSaved }: { value?: Dictionary; mode?: "view" | "edit" | "create"; onSaved?: () => void }) {
  const { t } = useHostI18n();
  const [draft, setDraft] = useState<Dictionary>(() => value ? structuredClone(value) : { id: "", code: "", name: "", status: "ENABLED", items: [] });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const readOnly = mode === "view";

  async function save(event: FormEvent) {
    event.preventDefault();
    if (saving || readOnly) return;
    setSaving(true);
    setError("");
    try {
      const response = await fetch("/api/d/dictionaries", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(draft) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || t("dictionary.saveError"));
      onSaved?.();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : t("dictionary.saveError"));
    } finally { setSaving(false); }
  }

  function updateItem(index: number, field: keyof Item, value: string) {
    setDraft((current) => ({ ...current, items: current.items.map((item, i) => i === index ? { ...item, [field]: value } : item) }));
  }

  return <form className="dictionary-editor" onSubmit={save}>
    <h3>{t("dictionary.form.basic")}</h3>
    <label>{t("dictionary.form.name")}<input required maxLength={80} readOnly={readOnly} value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /></label>
    <label>{t("dictionary.form.code")}<input required pattern="[A-Za-z][A-Za-z0-9_]*" title={t("dictionary.form.codeTitle")} readOnly={mode !== "create"} value={draft.code} onChange={(e) => setDraft({ ...draft, code: e.target.value })} /></label>
    <label>{t("dictionary.form.status")}<select disabled={readOnly} value={draft.status} onChange={(e) => setDraft({ ...draft, status: e.target.value })}><option value="ENABLED">{t("dictionary.enabled")}</option><option value="DISABLED">{t("dictionary.disabled")}</option></select></label>
    <div className="dictionary-items-head"><h3>{t("dictionary.form.items")}</h3>{!readOnly && <button type="button" className="doc-button" onClick={() => setDraft({ ...draft, items: [...draft.items, { itemValue: "", itemName: "" }] })}>{t("dictionary.form.addItem")}</button>}</div>
    {draft.items.map((item, index) => <div className="dictionary-item" key={index}>
      <input required readOnly={readOnly} aria-label={t("dictionary.form.itemValueAria", { index: index + 1 })} placeholder={t("dictionary.form.itemValue")} value={item.itemValue} onChange={(e) => updateItem(index, "itemValue", e.target.value)} />
      <input required readOnly={readOnly} aria-label={t("dictionary.form.itemNameAria", { index: index + 1 })} placeholder={t("dictionary.form.itemName")} value={item.itemName} onChange={(e) => updateItem(index, "itemName", e.target.value)} />
      {!readOnly && <button type="button" className="doc-button" onClick={() => setDraft({ ...draft, items: draft.items.filter((_, i) => i !== index) })}>{t("common.delete")}</button>}
    </div>)}
    {!draft.items.length && <p className="dictionary-empty">{t("dictionary.form.emptyItems")}</p>}
    {error && <p className="kb-error" role="alert">{error}</p>}
    {!readOnly && <div className="doc-dialog-actions"><button className="doc-button primary" disabled={saving}>{saving ? t("common.saving") : t("dictionary.form.saveAll")}</button></div>}
  </form>;
}
