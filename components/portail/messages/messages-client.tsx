"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { Send, Loader2 } from "lucide-react";
import { sendMessage } from "@/app/portail/messages/actions";
import { getAvocatPhoto } from "@/lib/avocats-photos";

type Message = {
  id: string;
  content: string;
  created_at: string;
  sender_type: string;
  sender_id: string;
};

type AvocatRef = {
  id: string;
  full_name: string;
  slug: string | null;
};

function fmtTime(iso: string) {
  return new Intl.DateTimeFormat("fr-BE", { hour: "2-digit", minute: "2-digit" }).format(new Date(iso));
}

function fmtDay(iso: string) {
  return new Intl.DateTimeFormat("fr-BE", { weekday: "long", day: "numeric", month: "long" }).format(new Date(iso));
}

function isSameDay(a: string, b: string) {
  return new Date(a).toDateString() === new Date(b).toDateString();
}

export function MessagesClient({
  dossierId,
  initialMessages,
  userId,
  avocatsById,
}: {
  dossierId: string;
  initialMessages: Message[];
  userId: string;
  avocatsById: Record<string, AvocatRef>;
}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [content, setContent]   = useState("");
  const [sending, setSending]   = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const supabase  = createClient();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "auto" });
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const channel = supabase
      .channel(`messages-${dossierId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages", filter: `dossier_id=eq.${dossierId}` },
        (payload) => {
          const msg = payload.new as Message;
          setMessages((prev) => prev.find((m) => m.id === msg.id) ? prev : [...prev, msg]);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [dossierId, supabase]);

  async function handleSend() {
    const text = content.trim();
    if (!text || sending) return;
    setSending(true);
    setContent("");
    try {
      await sendMessage(dossierId, text);
      // Optimistic: the realtime subscription will pick it up from the server
      // but add it immediately so the sender sees it right away
      const optimistic: Message = {
        id:           `opt-${Date.now()}`,
        content:      text,
        created_at:   new Date().toISOString(),
        sender_type:  "client",
        sender_id:    userId,
      };
      setMessages((prev) => [...prev, optimistic]);
    } catch {
      setContent(text);
    } finally {
      setSending(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-text-muted" style={{ fontFamily: "var(--font-body)" }}>
              Aucun message dans ce thread.
            </p>
          </div>
        )}
        {messages.map((msg, idx) => {
          const isClient = msg.sender_id === userId;
          const avocat = !isClient ? avocatsById[msg.sender_id] : undefined;
          const prevMsg  = messages[idx - 1];
          const showDay  = !prevMsg || !isSameDay(prevMsg.created_at, msg.created_at);

          return (
            <div key={msg.id}>
              {showDay && (
                <div className="flex items-center justify-center my-4">
                  <span
                    className="text-[10px] text-text-muted px-3 py-1 rounded-full capitalize"
                    style={{ backgroundColor: "var(--surface-alt)", fontFamily: "var(--font-body)" }}
                  >
                    {fmtDay(msg.created_at)}
                  </span>
                </div>
              )}
              <div className={`mb-1 flex ${isClient ? "justify-end" : "justify-start"} gap-2`}>
                {!isClient && (
                  <Image
                    src={getAvocatPhoto(avocat?.slug ?? "")}
                    alt={avocat?.full_name ?? "Maison Aldéric"}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full object-cover shrink-0"
                  />
                )}
                <div className="max-w-[72%] space-y-0.5">
                  {!isClient && (
                    <p className="text-[10px] text-text-muted px-1" style={{ fontFamily: "var(--font-body)" }}>
                      {avocat?.full_name ?? "Maison Aldéric"}
                    </p>
                  )}
                  <div
                    className="px-4 py-2.5 rounded-sm"
                    style={{
                      backgroundColor: isClient ? "var(--foreground)" : "var(--surface)",
                      border: isClient ? "none" : "1px solid var(--border)",
                    }}
                  >
                    <p
                      className="text-sm leading-relaxed whitespace-pre-wrap"
                      style={{
                        fontFamily: "var(--font-body)",
                        color: isClient ? "var(--background)" : "var(--foreground)",
                      }}
                    >
                      {msg.content}
                    </p>
                  </div>
                  <p
                    className={`text-[10px] text-text-muted px-1 ${isClient ? "text-right" : ""}`}
                    style={{ fontFamily: "var(--font-body)" }}
                  >
                    {fmtTime(msg.created_at)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-border p-3 bg-surface shrink-0">
        <div className="flex gap-2 items-end">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Votre message…"
            rows={2}
            className="flex-1 resize-none text-sm px-3 py-2 border border-border rounded-sm bg-background focus:outline-none focus:ring-1 focus:ring-[color:var(--bordeaux)] placeholder:text-text-muted"
            style={{ fontFamily: "var(--font-body)" }}
          />
          <button
            onClick={handleSend}
            disabled={sending || !content.trim()}
            className="shrink-0 w-9 h-9 flex items-center justify-center rounded-sm transition-colors disabled:opacity-40"
            style={{ backgroundColor: "var(--foreground)", color: "var(--background)" }}
          >
            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </div>
        <p className="text-[10px] text-text-muted mt-1.5" style={{ fontFamily: "var(--font-body)" }}>
          Entrée pour envoyer · Maj+Entrée pour un saut de ligne
        </p>
      </div>
    </div>
  );
}
