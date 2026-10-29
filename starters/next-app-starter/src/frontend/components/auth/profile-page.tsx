"use client";

import { useHostI18n } from "../../i18n/messages";

export interface SessionUser { name?: string; username?: string; roles?: string[]; permissions?: string[] }
function visibleIdentity(value: string | undefined): string {
  return value && !/^\{\{[^{}]+\}\}$/.test(value) ? value : "";
}
export function ProfilePage({ user }: { user?: SessionUser }) {
  const { locale, t } = useHostI18n();
  const roles = user?.roles?.join(locale === "en-US" ? ", " : "、");
  return <div className="profile-page"><p className="theme-eyebrow">{t("profile.eyebrow")}</p><h1>{t("profile.title")}</h1><p className="profile-subtitle">{t("profile.subtitle")}</p><section className="profile-card"><h2>{t("profile.section")}</h2><dl><div><dt>{t("profile.name")}</dt><dd>{visibleIdentity(user?.name) || "—"}</dd></div><div><dt>{t("profile.username")}</dt><dd>{visibleIdentity(user?.username) || "—"}</dd></div><div><dt>{t("profile.roles")}</dt><dd>{roles || "—"}</dd></div></dl></section></div>;
}
