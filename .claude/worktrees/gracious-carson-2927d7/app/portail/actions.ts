"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Server action — déconnecte l'utilisateur et redirige vers /connexion.
 *
 * Usage depuis un Server Component :
 *   <form action={signOut}><button>Se déconnecter</button></form>
 */
export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/connexion");
}
