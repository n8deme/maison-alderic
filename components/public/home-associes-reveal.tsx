import Image from "next/image";
import Link from "next/link";
import { slugify } from "@/lib/slugify";

type AvocatItem = {
  id: string;
  full_name: string;
  title: string;
  expertises: string[] | null;
  avatar_url: string | null;
};

export function HomeAssociesReveal({ avocats }: { avocats: AvocatItem[] }) {
  if (avocats.length === 0) return null;

  return (
    <section className="bg-surface px-6 py-32 md:px-12 md:py-40 lg:px-20">
      <div className="mx-auto max-w-7xl space-y-12 md:space-y-14">
        <div className="flex items-end justify-between">
          <div className="space-y-4">
            <span className="text-xs font-medium uppercase tracking-widest text-text-muted">
              Notre equipe
            </span>
            <h2 className="text-4xl text-foreground md:text-5xl">Les associes</h2>
          </div>
          <Link href="/associes" className="hidden text-sm text-bordeaux md:inline">
            Voir l&apos;equipe →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {avocats.map((a) => (
            <Link key={a.id} href={`/associes/${slugify(a.full_name)}`} className="group space-y-4">
              <div className="relative aspect-[4/5] overflow-hidden rounded-sm border border-border bg-surface-alt">
                {a.avatar_url ? (
                  <Image
                    src={a.avatar_url}
                    alt={a.full_name}
                    fill
                    sizes="(min-width: 1024px) 22vw, (min-width: 640px) 45vw, 90vw"
                    className="object-cover grayscale transition duration-700 ease-out group-hover:grayscale-0"
                  />
                ) : (
                  <div className="h-full w-full bg-[linear-gradient(135deg,var(--surface-alt),var(--border))]" />
                )}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,rgba(26,26,26,0),rgba(26,26,26,0.72))] p-4 opacity-0 transition duration-500 ease-out group-hover:opacity-100">
                  <p className="text-sm font-medium text-white">Profil complet</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-lg text-foreground">{a.full_name}</p>
                <p className="text-sm text-text-secondary">{a.title}</p>
                <p className="line-clamp-1 text-xs text-text-muted">
                  {(a.expertises ?? []).slice(0, 2).join(" • ")}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
