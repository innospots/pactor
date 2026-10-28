import type { Locale } from "./locale";
import { messages } from "./messages";

/** Insert a self-contained client-localized page into the remote sitemap. */
export function withClientDemo(value: unknown, locale: Locale): unknown {
  if (typeof value !== "object" || value === null) return value;
  const site = value as { pages?: unknown[]; menus?: unknown[] };
  if (!Array.isArray(site.pages) || !Array.isArray(site.menus)) return value;
  const id = "client-i18n-demo";
  const page = {
    dsl: "1.0",
    page: { id, title: "Client i18n" },
    state: { name: "Pactor" },
    body: {
      type: "Page",
      children: [
        { type: "Typography", props: { variant: "h3", text: "${t('demo.title')}" } },
        { type: "Text", props: { text: "${t('demo.description')}" } },
        { type: "Text", props: { text: "${t('demo.greeting', { name: state.name })}" } },
        {
          type: "Button",
          props: { text: "${t('demo.button')}", variant: "primary" },
          events: { onClick: [{ action: "message", params: { messageType: "info", text: "${t('demo.notice')}" } }] },
        },
      ],
    },
  };
  return {
    ...site,
    pages: [...site.pages, { id, path: "/client-i18n", title: messages[locale]["demo.menu"], version: 1, pageDsl: page }],
    menus: [...site.menus, { id, type: "page", pageId: id, title: messages[locale]["demo.menu"], path: "/client-i18n", layout: "blank", public: true }],
  };
}
