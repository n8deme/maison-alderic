import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const supabase = await createClient();

  const { data: avocats, error } = await supabase
    .from("avocats")
    .select("id, slug, full_name, title, bio, expertises, is_founding_partner, bar_admission")
    .order("is_founding_partner", { ascending: false })
    .order("full_name");

  return NextResponse.json({
    count: avocats?.length ?? 0,
    error: error ? {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint,
    } : null,
    first_row: avocats?.[0] ?? null,
    all_full_names: avocats?.map(a => a.full_name) ?? [],
    timestamp: new Date().toISOString(),
  });
}
