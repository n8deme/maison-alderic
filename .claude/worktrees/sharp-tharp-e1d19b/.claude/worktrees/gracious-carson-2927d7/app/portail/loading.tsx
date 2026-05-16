export default function PortailLoading() {
  return (
    <div className="mx-auto max-w-7xl p-6 md:p-8">
      <div className="animate-pulse space-y-6">
        <div className="h-8 w-52 rounded-sm bg-surface-alt" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-36 rounded-lg bg-surface-alt" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
          <div className="h-72 rounded-lg bg-surface-alt xl:col-span-8" />
          <div className="h-72 rounded-lg bg-surface-alt xl:col-span-4" />
        </div>
      </div>
    </div>
  );
}
