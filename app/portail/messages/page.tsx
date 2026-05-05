import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { MessageSquare } from "lucide-react";
import { Inbox } from "lucide-react";
import { MessagesClient } from "@/components/portail/messages/messages-client";
import { markThreadAsRead } from "./actions";

export const metadata: Metadata = { title: "Messages" };

type Message = {
  id: string;
  content: string;
  created_at: string;
  sender_type: string;
  sender_id: string;
};

export default async function MessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ dossier?: string }>;
}) {
  const { dossier: selectedId } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/connexion");

  // Fetch all client dossiers for the left panel
  const { data: dossiers } = await supabase
    .from("dossiers")
    .select("id, reference, title, status")
    .eq("client_id", user.id)
    .in("status", ["active", "pending"])
    .order("opened_at", { ascending: false });

  const list = dossiers ?? [];

  // Default to first dossier if none selected
  const activeId = selectedId ?? list[0]?.id ?? null;

  // Fetch messages for selected thread + mark as read
  let initialMessages: Message[] = [];
  if (activeId) {
    const [msgsResult] = await Promise.all([
      supabase
        .from("messages")
        .select("id, content, created_at, sender_type, sender_id")
        .eq("dossier_id", activeId)
        .order("created_at", { ascending: true }),
      markThreadAsRead(activeId),
    ]);
    initialMessages = (msgsResult.data ?? []) as Message[];
  }

  const activeDossier = list.find((d) => d.id === activeId);

  return (
    <div className="flex h-full overflow-hidden">
      {/* Dossier selector (left panel) */}
      <aside className="w-64 shrink-0 border-r border-border flex flex-col overflow-hidden bg-background hidden sm:flex">
        <div className="px-4 py-4 border-b border-border">
          <p className="text-xs font-medium uppercase tracking-wider text-text-muted" style={{ fontFamily: "var(--font-body)" }}>
            Dossiers
          </p>
        </div>
        <nav className="flex-1 overflow-y-auto py-2">
          {list.length === 0 ? (
            <div className="px-4 py-6">
              <Inbox className="mb-2 h-5 w-5 text-text-muted" />
              <p className="text-xs text-text-muted" style={{ fontFamily: "var(--font-body)" }}>
                Aucun dossier actif.
              </p>
              <Link
                href="/contact"
                className="mt-3 inline-flex rounded-sm border border-bordeaux px-3 py-1.5 text-[10px] font-medium uppercase tracking-wide text-bordeaux transition-colors hover:bg-bordeaux hover:text-white"
              >
                Contacter le cabinet
              </Link>
            </div>
          ) : (
            list.map((d) => (
              <Link
                key={d.id}
                href={`/portail/messages?dossier=${d.id}`}
                className={`block px-4 py-3 border-b border-border-subtle transition-colors ${
                  d.id === activeId ? "bg-surface" : "hover:bg-surface"
                }`}
              >
                <div className="flex items-center gap-2">
                  {d.id === activeId && (
                    <span
                      className="w-0.5 h-4 rounded-full shrink-0"
                      style={{ backgroundColor: "var(--bordeaux)" }}
                    />
                  )}
                  <div className="min-w-0">
                    <p
                      className="text-xs font-medium truncate"
                      style={{
                        fontFamily: "var(--font-body)",
                        color: d.id === activeId ? "var(--foreground)" : "var(--text-secondary)",
                      }}
                    >
                      {d.reference}
                    </p>
                    <p className="text-[10px] text-text-muted truncate" style={{ fontFamily: "var(--font-body)" }}>
                      {d.title}
                    </p>
                  </div>
                </div>
              </Link>
            ))
          )}
        </nav>
      </aside>

      {/* Thread (right panel) */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Thread header */}
        {activeDossier ? (
          <>
            <div className="shrink-0 px-5 py-4 border-b border-border bg-surface flex items-center gap-3">
              <MessageSquare className="w-4 h-4 text-text-muted" />
              <div>
                <p className="text-sm font-medium" style={{ fontFamily: "var(--font-body)" }}>
                  {activeDossier.title}
                </p>
                <p className="text-[10px] text-text-muted" style={{ fontFamily: "var(--font-body)" }}>
                  {activeDossier.reference}
                </p>
              </div>
            </div>
            <div className="flex-1 overflow-hidden">
              <MessagesClient
                dossierId={activeId!}
                initialMessages={initialMessages}
                userId={user.id}
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="w-8 h-8 mx-auto mb-3 text-text-muted" />
              <p className="text-sm text-text-secondary" style={{ fontFamily: "var(--font-body)" }}>
                Sélectionnez un dossier pour voir la messagerie.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
