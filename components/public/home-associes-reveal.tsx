import Image from "next/image";
import Link from "next/link";
import { getAvocatPhoto } from "@/lib/avocats-photos";
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
              Notre équipe
            </span>
            <h2 className="text-4xl text-foreground md:text-5xl">Les associés</h2>
          </div>
          <Link href="/associes" className="hidden text-sm text-bordeaux md:inline">
            Voir l&apos;équipe →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {avocats.map((a) => (
            <Link key={a.id} href={`/associes/${slugify(a.full_name)}`} className="group space-y-4">
              <div className="flex justify-center">
                <Image
                  src={a.avatar_url ?? getAvocatPhoto(slugify(a.full_name))}
                  alt={a.full_name}
                  width={200}
                  height={200}
                  className="rounded-full object-cover grayscale"
                />
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
