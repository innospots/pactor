"use client";

import { ArrowRight, Bot, History, Languages, Layers, Palette, Plus, Send, Sparkles, Trash2, Wrench, BarChart3, BookOpen, FileText, ScrollText, Settings, Shield, Table2, Users, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { type FormEvent, useEffect, useRef, useState } from "react";
import type { SessionUser } from "../../types/session";
import { useHostI18n } from "../../i18n/messages";

type Message = { id: string; role: "user" | "assistant"; text: string };
type Conversation = { id: string; title: string; messages: Message[] };
type ErrorState = "read" | "save" | null;
const STORAGE_KEY = "pactor-workbench-conversations-v1";

// Compatibility for clients still holding the previous inline workspace DSL.
export function WorkbenchHome({ user }: { user?: SessionUser }) {
  return <div className="workbench-page"><div className="workbench-frame"><WorkbenchHero user={user} /><WorkbenchAssistant user={user} /></div></div>;
}

const entryIcons: Record<string, LucideIcon> = { overview: BarChart3, reports: FileText, records: Table2, settings: Settings, dictionaries: BookOpen, audit: ScrollText, roles: Shield, users: Users, themes: Palette };
export function WorkbenchEntry({ href, icon, title, description, tone }: { href: string; icon: string; title: string; description: string; tone: string }) {
  const Icon = entryIcons[icon] ?? BarChart3;
  return <Link className="workbench-entry" href={href}><span className={`workbench-entry-icon tone-${tone}`}><Icon size={20} strokeWidth={1.8} /></span><span className="workbench-entry-copy"><strong>{title}</strong><small>{description}</small></span><ArrowRight className="workbench-entry-arrow" size={17} /></Link>;
}

export function WorkbenchHero({ user }: { user?: SessionUser }) {
  const { t } = useHostI18n();
  const canViewReports = user?.permissions?.includes("report:view") ?? false;
  const canViewUsers = user?.permissions?.includes("user:view") ?? false;
  const userName = [user?.name, user?.username].find((value) => value && !/^\{\{[^{}]+\}\}$/.test(value));
  return <>
        <header className="workbench-header">
          <div>
            <h1>
              {userName
                ? t("workbench.welcome", { name: userName })
                : t("workbench.welcomeFallback")}
            </h1>
            <p>{t("workbench.subtitle")}</p>
          </div>
        </header>

        <section className="workbench-hero">
          <div className="workbench-hero-copy">
            <span className="workbench-hero-kicker">
              <Sparkles size={14} />
              {t("workbench.hero.badge")}
            </span>
            <h2>{t("workbench.hero.title")}</h2>
            <p>{t("workbench.hero.description")}</p>
            <div className="workbench-hero-actions">
              <Link className="workbench-action-primary" href="/dashboard">
                {t("workbench.hero.primary")}
                <ArrowRight size={17} />
              </Link>
              <a className="workbench-action-secondary" href="#workbench-assistant">
                <Bot size={17} />
                {t("workbench.hero.secondary")}
              </a>
            </div>
          </div>

          <div className="workbench-hero-visual" aria-hidden="true">
            <span className="workbench-orbit orbit-one" />
            <span className="workbench-orbit orbit-two" />
            <span className="workbench-hero-core">P</span>
            <span className="workbench-floating-note note-one">
              <Layers size={15} />
              03
            </span>
            <span className="workbench-floating-note note-two">
              <Languages size={15} />
              02
            </span>
          </div>

          <div className="workbench-hero-stats">
            <div>
              <span className="workbench-stat-icon">
                <Layers size={17} />
              </span>
              <strong>{(canViewReports ? "03" : "02")}</strong>
              <small>{t("workbench.stats.views")}</small>
            </div>
            <div>
              <span className="workbench-stat-icon">
                <Wrench size={17} />
              </span>
              <strong>{(canViewUsers ? "06" : "05")}</strong>
              <small>{t("workbench.stats.tools")}</small>
            </div>
            <div>
              <span className="workbench-stat-icon">
                <Palette size={17} />
              </span>
              <strong>12</strong>
              <small>{t("workbench.stats.themes")}</small>
            </div>
            <div>
              <span className="workbench-stat-icon">
                <Languages size={17} />
              </span>
              <strong>02</strong>
              <small>{t("workbench.stats.languages")}</small>
            </div>
          </div>
        </section>

  </>;
}

export function WorkbenchAssistant({ user }: { user?: SessionUser }) {
  const { t } = useHostI18n();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selected, setSelected] = useState("");
  const [input, setInput] = useState("");
  const [error, setError] = useState<ErrorState>(null);
  const [ready, setReady] = useState(false);
  const threadRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const rows = JSON.parse(saved) as Conversation[];
          setConversations(rows);
          setSelected(rows[0]?.id ?? "");
        }
      } catch {
        setError("read");
      }
      setReady(true);
    });
    return () => {
      active = false;
    };
  }, []);

  const current = conversations.find((conversation) => conversation.id === selected);

  useEffect(() => {
    const thread = threadRef.current;
    if (thread) thread.scrollTop = thread.scrollHeight;
  }, [current?.messages.length, selected]);

  function persist(rows: Conversation[]): boolean {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rows));
      setConversations(rows);
      setError(null);
      return true;
    } catch {
      setError("save");
      return false;
    }
  }

  function createConversation() {
    const row: Conversation = {
      id: crypto.randomUUID(),
      title: t("workbench.assistant.newTitle"),
      messages: [],
    };
    if (persist([row, ...conversations])) {
      setSelected(row.id);
      setInput("");
      queueMicrotask(() => inputRef.current?.focus());
    }
  }

  function submitMessage(event: FormEvent) {
    event.preventDefault();
    const text = input.trim();
    if (!text) return;
    const row = current ?? {
      id: crypto.randomUUID(),
      title: t("workbench.assistant.newTitle"),
      messages: [],
    };
    const updated: Conversation = {
      ...row,
      title: row.messages.length ? row.title : text.slice(0, 34),
      messages: [
        ...row.messages,
        { id: crypto.randomUUID(), role: "user", text },
        {
          id: crypto.randomUUID(),
          role: "assistant",
          text: t("workbench.assistant.sampleReply"),
        },
      ],
    };
    if (
      persist([
        updated,
        ...conversations.filter((conversation) => conversation.id !== row.id),
      ])
    ) {
      setSelected(row.id);
      setInput("");
    }
  }

  function removeConversation() {
    if (!current) return;
    if (!window.confirm(t("workbench.assistant.deleteConfirm", { title: current.title }))) {
      return;
    }
    const rows = conversations.filter((conversation) => conversation.id !== current.id);
    if (persist(rows)) setSelected(rows[0]?.id ?? "");
  }

  function fillPrompt(prompt: string) {
    setInput(prompt);
    queueMicrotask(() => inputRef.current?.focus());
  }

  const canViewReports = user?.permissions?.includes("report:view") ?? false;
  const canViewUsers = user?.permissions?.includes("user:view") ?? false;

  const errorText =
    error === "read"
      ? t("workbench.assistant.readError")
      : error === "save"
        ? t("workbench.assistant.saveError")
        : "";

  return (
          <aside className="assistant-card" id="workbench-assistant">
            <header className="assistant-head">
              <div className="assistant-title">
                <span className="assistant-mark">
                  <Bot size={21} />
                </span>
                <div>
                  <h2>{t("workbench.assistant.title")}</h2>
                  <p>
                    <span className="assistant-online" />
                    {t("workbench.assistant.subtitle")}
                  </p>
                </div>
              </div>
              <button
                className="assistant-new"
                type="button"
                onClick={createConversation}
                title={t("workbench.assistant.new")}
              >
                <Plus size={17} />
                <span>{t("workbench.assistant.new")}</span>
              </button>
            </header>

            <div className="assistant-history">
              <History size={15} />
              <select
                aria-label={t("workbench.assistant.history")}
                value={selected}
                onChange={(event) => {
                  setSelected(event.target.value);
                  setInput("");
                }}
              >
                {ready && conversations.length === 0 ? (
                  <option value="">{t("workbench.assistant.emptyHistory")}</option>
                ) : null}
                {conversations.map((conversation) => (
                  <option value={conversation.id} key={conversation.id}>
                    {conversation.title}
                  </option>
                ))}
              </select>
              <button
                className="assistant-delete"
                type="button"
                aria-label={t("workbench.assistant.delete")}
                title={t("workbench.assistant.delete")}
                disabled={!current}
                onClick={removeConversation}
              >
                <Trash2 size={15} />
              </button>
            </div>

            {errorText ? (
              <p className="assistant-error" role="alert">
                {errorText}
              </p>
            ) : null}

            <div className="assistant-thread" ref={threadRef}>
              {!current?.messages.length ? (
                <div className="assistant-welcome">
                  <span className="assistant-welcome-mark">
                    <Sparkles size={25} />
                  </span>
                  <h3>{t("workbench.assistant.welcomeTitle")}</h3>
                  <p>{t("workbench.assistant.welcomeText")}</p>
                  <div className="assistant-prompts">
                    {[
                      t("workbench.assistant.promptOverview"),
                      t("workbench.assistant.promptReports"),
                      t("workbench.assistant.promptAccess"),
                    ]
                      .filter((prompt) =>
                        prompt === t("workbench.assistant.promptReports")
                          ? canViewReports
                          : prompt === t("workbench.assistant.promptAccess")
                            ? canViewUsers
                            : true,
                      )
                      .map((prompt) => (
                        <button
                          type="button"
                          key={prompt}
                          onClick={() => fillPrompt(prompt)}
                        >
                          {prompt}
                          <ArrowRight size={14} />
                        </button>
                      ))}
                  </div>
                </div>
              ) : (
                current.messages.map((message) => (
                  <div className={`assistant-message ${message.role}`} key={message.id}>
                    <span className="assistant-message-avatar">
                      {message.role === "assistant" ? <Bot size={15} /> : t("workbench.assistant.me")}
                    </span>
                    <div>
                      <strong>
                        {message.role === "assistant"
                          ? t("workbench.assistant.name")
                          : t("workbench.assistant.you")}
                      </strong>
                      <p>{message.text}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <form className="assistant-composer" onSubmit={submitMessage}>
              <textarea
                ref={inputRef}
                aria-label={t("workbench.assistant.inputAria")}
                placeholder={t("workbench.assistant.placeholder")}
                rows={3}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" &&
                    !event.shiftKey &&
                    !event.nativeEvent.isComposing
                  ) {
                    event.preventDefault();
                    event.currentTarget.form?.requestSubmit();
                  }
                }}
              />
              <div>
                <span>{t("workbench.assistant.enterHint")}</span>
                <button
                  type="submit"
                  disabled={!input.trim()}
                  aria-label={t("workbench.assistant.send")}
                >
                  <Send size={16} />
                  {t("workbench.assistant.send")}
                </button>
              </div>
            </form>
          </aside>
  );
}
