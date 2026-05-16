"use server";

import { createClient } from "@/lib/supabase/server";
import { notifyNewMessage } from "@/lib/resend";

export async function sendMessage(dossierId: string, content: string): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Non authentifié");
  if (!content.trim()) throw new Error("Message vide");

  const { error } = await supabase.from("messages").insert({
    dossier_id:  dossierId,
    sender_id:   user.id,
    sender_type: "client",
    content:     content.trim(),
  });

  if (error) throw new Error(error.message);

  // Notification fire-and-forget — n'affecte pas la réponse client
  void notifyNewMessage({
    dossierId,
    senderId: user.id,
    preview:  content.trim().slice(0, 200),
  });
}

export async function markThreadAsRead(dossierId: string): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("messages")
    .update({ read_at: new Date().toISOString() })
    .eq("dossier_id", dossierId)
    .eq("sender_type", "avocat")
    .is("read_at", null);
}
