import type { Metadata } from "next";

import { ChatClient } from "./chat-client";

export const metadata: Metadata = {
  title: "对话 - Pactor",
};

export default function ChatPage() {
  return <ChatClient />;
}
