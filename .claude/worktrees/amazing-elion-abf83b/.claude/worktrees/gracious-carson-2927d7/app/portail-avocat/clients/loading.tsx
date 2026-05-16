export default function ClientsLoading() {
  return (
    <div className="max-w-7xl p-6 md:p-8">
      {/* Header skeleton */}
      <div className="mb-6 space-y-2">
        <div className="h-8 w-32 animate-pulse rounded-sm bg-surface-alt" />
        <div className="h-4 w-72 animate-pulse rounded-sm bg-surface-alt" />
      </div>

      {/* Cards skeleton */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-sm border border-border bg-surface p-5 space-y-3">
            {/* Name */}
            <div className="h-5 w-40 animate-pulse rounded-sm bg-surface-alt" />
            {/* Email */}
            <div className="h-3 w-52 animate-pulse rounded-sm bg-surface-alt" />
            {/* Stats */}
            <div className="space-y-1.5 pt-1">
              <div className="h-3 w-28 animate-pulse rounded-sm bg-surface-alt" />
              <div className="h-3 w-64 animate-pulse rounded-sm bg-surface-alt" />
            </div>
            {/* Buttons */}
            <div className="flex gap-2 pt-1">
              <div className="h-7 w-20 animate-pulse rounded-sm bg-surface-alt" />
              <div className="h-7 w-28 animate-pulse rounded-sm bg-surface-alt" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
